import { GoogleGenAI } from "@google/genai";
import type {
  GenerateRequest,
  GenerateResponse,
  AlternateEndingRequest,
  AlternateEndingResponse,
} from "./types";
import {
  LEVEL_DESCRIPTORS,
  PERSPECTIVE_DESCRIPTORS,
} from "./types";
import {
  getMockGenerateResponse,
  getMockAlternateEndingResponse,
} from "./mock-data";

// LLM Service interface (strategy pattern)
export interface LLMService {
  generateThoughtChain(params: GenerateRequest): Promise<GenerateResponse>;
  generateAlternateEnding(
    params: AlternateEndingRequest,
  ): Promise<AlternateEndingResponse>;
}

/**
 * Simulate API latency with a random delay between 300-500ms
 */
function simulateDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 201) + 300;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Mock LLM Service - uses pre-defined mock data for development
 */
class MockLLMService implements LLMService {
  async generateThoughtChain(
    params: GenerateRequest,
  ): Promise<GenerateResponse> {
    await simulateDelay();
    return getMockGenerateResponse(params.situation, params.level);
  }

  async generateAlternateEnding(
    params: AlternateEndingRequest,
  ): Promise<AlternateEndingResponse> {
    await simulateDelay();
    return getMockAlternateEndingResponse(params.level, params.ending_type);
  }
}

// JSON schemas for Gemini structured output
const GENERATE_RESPONSE_SCHEMA = {
  type: "object" as const,
  properties: {
    steps: {
      type: "array" as const,
      items: { type: "string" as const },
      description: "Array of thought steps, each a short sentence in Thai",
    },
    sanity_score: {
      type: "integer" as const,
      minimum: 0,
      maximum: 100,
      description: "Sanity score from 0 (completely lost it) to 100 (perfectly sane)",
    },
  },
  required: ["steps", "sanity_score"],
};

const ALTERNATE_ENDING_SCHEMA = {
  type: "object" as const,
  properties: {
    new_final_step: {
      type: "string" as const,
      description: "The new final thought step in Thai",
    },
    sanity_score: {
      type: "integer" as const,
      minimum: 0,
      maximum: 100,
      description: "Updated sanity score",
    },
  },
  required: ["new_final_step", "sanity_score"],
};

const SYSTEM_INSTRUCTION = `คุณคือ "Overthinking Simulator"
หน้าที่ของคุณคือ: รับสถานการณ์สั้นๆ แล้วขยายเป็น "ลำดับความคิด" ที่ค่อยๆ แย่ลง

กฎ:
- เริ่มจากเหตุผลปกติ
- ค่อยๆ เพิ่มความกังวล
- escalate ตามระดับ (level)
- แต่ละ step = 1 ประโยคสั้นๆ ภาษาไทย
- สูงสุด 10 steps
- ต้อง relatable และ "แทงใจจริง"
- step สุดท้ายต้อง impactful
- ตอบเป็นภาษาไทยเท่านั้น`;

/**
 * Real LLM Service - uses Google Gemini Flash
 */
class GeminiLLMService implements LLMService {
  private client: GoogleGenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    this.client = new GoogleGenAI({ apiKey });
    this.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  async generateThoughtChain(
    params: GenerateRequest,
  ): Promise<GenerateResponse> {
    const levelDesc = LEVEL_DESCRIPTORS[params.level];
    const perspectiveDesc = PERSPECTIVE_DESCRIPTORS[params.perspective];

    const stepCount = Math.min(3 + params.level * 1.5, 10);

    const prompt = `สถานการณ์: "${params.situation}"
ระดับ: Level ${params.level} (${levelDesc.tone})
มุมมอง: ${perspectiveDesc}
บทสรุป: ${levelDesc.conclusion}

สร้างลำดับความคิดประมาณ ${Math.round(stepCount)} steps
Sanity score ควรอยู่ในช่วงที่เหมาะกับ level (Level 1: 80-100, Level 2: 60-80, Level 3: 40-60, Level 4: 20-40, Level 5: 0-20)`;

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: GENERATE_RESPONSE_SCHEMA,
      },
    });

    const text = response.text ?? "";
    const parsed = JSON.parse(text);

    return {
      steps: parsed.steps,
      sanity_score: Math.max(0, Math.min(100, parsed.sanity_score)),
      ending_type: "normal",
    };
  }

  async generateAlternateEnding(
    params: AlternateEndingRequest,
  ): Promise<AlternateEndingResponse> {
    const levelDesc = LEVEL_DESCRIPTORS[params.level];
    const perspectiveDesc = PERSPECTIVE_DESCRIPTORS[params.perspective];

    const endingDescriptions = {
      worst: "จบแบบแย่ที่สุด เลวร้ายที่สุดที่จะเกิดขึ้นได้",
      best: "จบแบบดีที่สุด happy ending สุดๆ",
      delusional: "จบแบบเพ้อฝัน ไม่มีทางเป็นไปได้แต่สนุก",
    };

    const prompt = `สถานการณ์: "${params.situation}"
ระดับ: Level ${params.level} (${levelDesc.tone})
มุมมอง: ${perspectiveDesc}

ลำดับความคิดที่ผ่านมา:
${params.steps.map((s, i) => `Step ${i + 1}: ${s}`).join("\n")}

สร้าง step สุดท้ายใหม่แบบ: ${endingDescriptions[params.ending_type]}
ต้องเป็นประโยคสั้น 1 ประโยค ภาษาไทย impactful และ relatable`;

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: ALTERNATE_ENDING_SCHEMA,
      },
    });

    const text = response.text ?? "";
    const parsed = JSON.parse(text);

    return {
      new_final_step: parsed.new_final_step,
      sanity_score: Math.max(0, Math.min(100, parsed.sanity_score)),
      ending_type: params.ending_type,
    };
  }
}

/**
 * Factory function - switches between mock/real via USE_MOCK_LLM env variable.
 * Defaults to mock when GEMINI_API_KEY is not set.
 */
export function getLLMService(): LLMService {
  const useMock = process.env.USE_MOCK_LLM === "true" || !process.env.GEMINI_API_KEY;

  if (useMock) {
    return new MockLLMService();
  }

  return new GeminiLLMService();
}
