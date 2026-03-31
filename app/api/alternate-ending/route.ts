import { alternateEndingRequestSchema } from "@/app/lib/validators";
import { getLLMService } from "@/app/lib/llm-service";
import { checkRateLimit, DEFAULT_RATE_LIMIT } from "@/app/lib/rate-limit";
import { verifyTurnstileToken } from "@/app/lib/turnstile";

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

    // Verify Turnstile token
    const turnstileToken = body.turnstileToken;
    const turnstileResult = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileResult.valid) {
      return Response.json(
        { error: "ยืนยันตัวตนไม่สำเร็จ กรุณาลองใหม่" },
        { status: 403 }
      );
    }

    const result = alternateEndingRequestSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const llmService = getLLMService();
    const response = await llmService.generateAlternateEnding(result.data);

    return Response.json(response, {
      headers: { "X-RateLimit-Remaining": String(limit.remaining) },
    });
  } catch {
    return Response.json(
      { error: "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
