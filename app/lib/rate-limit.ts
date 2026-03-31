/**
 * In-memory sliding window rate limiter.
 * Tracks requests per IP within a time window.
 * 
 * Note: This works per-instance. If you scale to multiple serverless
 * instances, consider using Redis or Upstash instead.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

interface RateLimitConfig {
  /** Max requests allowed within the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export function checkRateLimit(ip: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  cleanup(config.windowMs);

  let entry = store.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(ip, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < config.windowMs);

  if (entry.timestamps.length >= config.maxRequests) {
    const oldest = entry.timestamps[0];
    const resetMs = oldest + config.windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    resetMs: config.windowMs,
  };
}

/** Default config: 10 requests per minute per IP */
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000,
};
