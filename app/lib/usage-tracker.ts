/**
 * In-memory usage tracker.
 * Tracks generate/alternate-ending calls with metadata.
 *
 * Note: Data resets on server restart. For persistent tracking,
 * swap to a database (e.g., Upstash Redis, Supabase).
 */

interface UsageEvent {
  type: "generate" | "alternate-ending";
  level: number;
  perspective: string;
  situation: string;
  timestamp: number;
}

interface DailyStats {
  date: string;
  totalGenerates: number;
  totalAlternateEndings: number;
  levelBreakdown: Record<number, number>;
  perspectiveBreakdown: Record<string, number>;
  topSituations: { situation: string; count: number }[];
}

const events: UsageEvent[] = [];
const MAX_EVENTS = 10000; // cap to prevent memory issues

export function trackUsage(event: Omit<UsageEvent, "timestamp">) {
  if (events.length >= MAX_EVENTS) {
    // Remove oldest 20%
    events.splice(0, Math.floor(MAX_EVENTS * 0.2));
  }
  events.push({ ...event, timestamp: Date.now() });
}

export function getStats(): {
  total: { generates: number; alternateEndings: number; total: number };
  today: DailyStats;
  last7Days: DailyStats[];
} {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Total counts
  const generates = events.filter((e) => e.type === "generate").length;
  const alternateEndings = events.filter((e) => e.type === "alternate-ending").length;

  // Today's stats
  const today = buildDailyStats(todayStr);

  // Last 7 days
  const last7Days: DailyStats[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    last7Days.push(buildDailyStats(dateStr));
  }

  return {
    total: { generates, alternateEndings, total: generates + alternateEndings },
    today,
    last7Days,
  };
}

function buildDailyStats(dateStr: string): DailyStats {
  const dayStart = new Date(dateStr).getTime();
  const dayEnd = dayStart + 86400000;

  const dayEvents = events.filter(
    (e) => e.timestamp >= dayStart && e.timestamp < dayEnd
  );

  const generates = dayEvents.filter((e) => e.type === "generate");
  const alternateEndings = dayEvents.filter((e) => e.type === "alternate-ending");

  // Level breakdown
  const levelBreakdown: Record<number, number> = {};
  for (const e of generates) {
    levelBreakdown[e.level] = (levelBreakdown[e.level] || 0) + 1;
  }

  // Perspective breakdown
  const perspectiveBreakdown: Record<string, number> = {};
  for (const e of generates) {
    perspectiveBreakdown[e.perspective] = (perspectiveBreakdown[e.perspective] || 0) + 1;
  }

  // Top situations
  const situationCounts: Record<string, number> = {};
  for (const e of generates) {
    const key = e.situation.slice(0, 50); // truncate for grouping
    situationCounts[key] = (situationCounts[key] || 0) + 1;
  }
  const topSituations = Object.entries(situationCounts)
    .map(([situation, count]) => ({ situation, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    date: dateStr,
    totalGenerates: generates.length,
    totalAlternateEndings: alternateEndings.length,
    levelBreakdown,
    perspectiveBreakdown,
    topSituations,
  };
}
