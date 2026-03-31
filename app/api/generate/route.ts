import { generateRequestSchema } from "@/app/lib/validators";
import { sanitizeInput } from "@/app/lib/validators";
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

    const result = generateRequestSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    // Sanitize user input against prompt injection
    const sanitized = sanitizeInput(result.data.situation);
    if (!sanitized.safe) {
      return Response.json(
        { error: sanitized.reason || "ข้อความไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const llmService = getLLMService();
    const response = await llmService.generateThoughtChain({
      ...result.data,
      situation: sanitized.sanitized,
    });

    // Track usage
    trackUsage({
      type: "generate",
      level: result.data.level,
      perspective: result.data.perspective,
      situation: sanitized.sanitized.slice(0, 50),
    });

    return Response.json(response, {
      headers: { "X-RateLimit-Remaining": String(limit.remaining) },
    });
  } catch (err) {
    console.error("Generate API error:", err);
    return Response.json(
      { error: "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
