import { z } from "zod";

// Input validation

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateSituation(input: string): ValidationResult {
  if (!input || input.trim().length === 0) {
    return { valid: false, error: "กรุณาพิมพ์สถานการณ์ก่อนนะ" };
  }
  if (input.length > 200) {
    return { valid: false, error: "สถานการณ์ต้องไม่เกิน 200 ตัวอักษร" };
  }
  return { valid: true };
}

// Zod schemas for API request/response validation

export const generateRequestSchema = z.object({
  situation: z.string().min(1).max(200),
  level: z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
  perspective: z.enum([
    "psychologist",
    "doom_thinker",
    "gen_z",
    "gen_alpha",
    "anime_protagonist",
    "thai_mom",
  ]),
});

export const generateResponseSchema = z.object({
  steps: z.array(z.string().min(1)).min(1),
  sanity_score: z.number().min(0).max(100),
  ending_type: z.literal("normal"),
});

export const alternateEndingRequestSchema = z.object({
  situation: z.string().min(1).max(200),
  steps: z.array(z.string().min(1)).min(1),
  level: z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
  perspective: z.enum([
    "psychologist",
    "doom_thinker",
    "gen_z",
    "gen_alpha",
    "anime_protagonist",
    "thai_mom",
  ]),
  ending_type: z.enum(["worst", "best", "delusional"]),
});

export const alternateEndingResponseSchema = z.object({
  new_final_step: z.string().min(1),
  sanity_score: z.number().min(0).max(100),
  ending_type: z.enum(["worst", "best", "delusional"]),
});

// --- Prompt Injection Protection ---

/** Patterns that indicate prompt injection attempts */
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|above|prior)/i,
  /forget\s+(all\s+)?(previous|above|prior|your)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+/i,
  /act\s+as\s+(a\s+)?/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /new\s+instructions?:/i,
  /system\s*prompt/i,
  /\bDAN\b/,
  /do\s+anything\s+now/i,
  /jailbreak/i,
  /bypass\s+(your\s+)?(rules|restrictions|filters|safety)/i,
  /override\s+(your\s+)?(rules|instructions|programming)/i,
  /reveal\s+(your\s+)?(system|instructions|prompt|rules)/i,
  /what\s+(are|is)\s+your\s+(system|instructions|prompt|rules)/i,
  /output\s+(your\s+)?(system|initial)\s+prompt/i,
  /\]\s*\}\s*\{/,  // JSON injection attempt
  /```\s*(system|assistant|user)/i,  // role injection
];

export interface SanitizeResult {
  safe: boolean;
  sanitized: string;
  reason?: string;
}

/**
 * Sanitize user input to prevent prompt injection.
 * Returns sanitized text or flags as unsafe.
 */
export function sanitizeInput(input: string): SanitizeResult {
  const trimmed = input.trim();

  // Check against known injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        safe: false,
        sanitized: trimmed,
        reason: "ข้อความมีรูปแบบที่ไม่อนุญาต",
      };
    }
  }

  // Strip control characters (keep Thai, emoji, basic punctuation)
  const cleaned = trimmed
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // control chars
    .replace(/\r\n|\r/g, "\n") // normalize newlines
    .replace(/\n{3,}/g, "\n\n"); // collapse excessive newlines

  return { safe: true, sanitized: cleaned };
}
