import { alternateEndingRequestSchema, sanitizeInput } from "@/app/lib/validators";
import { getLLMService } from "@/app/lib/llm-service";
import { checkRateLimit, DEFAULT_RATE_LIMIT } from "@/app/lib/rate-limit";
import { trackUsage } from "@/app/lib/usage-tracker";

export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    const limit = checkRateLimit(ip, DEFAULT_RATE_LIMIT);
    if (!limit.allowed) {
      return Response.json(
        { error: "คิดมากเกินไปแล้ว! รอสักครู่แล้วลองใหม่" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limit.resetMs / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();

    const result = alternateEndingRequestSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    // Sanitize situation and steps against prompt injection
    const sanitizedSituation = sanitizeInput(result.data.situation);
    if (!sanitizedSituation.safe) {
      return Response.json(
        { error: sanitizedSituation.reason || "ข้อความไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    for (const step of result.data.steps) {
      const sanitizedStep = sanitizeInput(step);
      if (!sanitizedStep.safe) {
        return Response.json(
          { error: "ข้อความมีรูปแบบที่ไม่อนุญาต" },
          { status: 400 }
        );
      }
    }

    const llmService = getLLMService();
    const response = await llmService.generateAlternateEnding({
      ...result.data,
      situation: sanitizedSituation.sanitized,
    });

    // Track usage
    trackUsage({
      type: "alternate-ending",
      level: result.data.level,
      perspective: result.data.perspective,
      situation: sanitizedSituation.sanitized.slice(0, 50),
    });

    return Response.json(response, {
      headers: { "X-RateLimit-Remaining": String(limit.remaining) },
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
      console.error("Gemini quota exceeded:", errMsg);
      return Response.json(
        { error: "ระบบใช้งานเยอะมาก รอสักครู่แล้วลองใหม่นะ 🧠" },
        { status: 429 }
      );
    }
    console.error("Alternate ending API error:", err);
    return Response.json(
      { error: "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
