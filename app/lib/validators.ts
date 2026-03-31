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
