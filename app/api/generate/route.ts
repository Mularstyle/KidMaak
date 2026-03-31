import { generateRequestSchema } from "@/app/lib/validators";
import { getLLMService } from "@/app/lib/llm-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = generateRequestSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const llmService = getLLMService();
    const response = await llmService.generateThoughtChain(result.data);

    return Response.json(response);
  } catch {
    return Response.json(
      { error: "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
