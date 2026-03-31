import { describe, it, expect } from "vitest";
import { POST as generatePOST } from "@/app/api/generate/route";
import { POST as alternateEndingPOST } from "@/app/api/alternate-ending/route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/generate", () => {
  it("returns 200 with valid request", async () => {
    const req = makeRequest({
      situation: "เขาไม่ตอบแชท",
      level: 3,
      perspective: "gen_z",
    });

    const res = await generatePOST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.steps).toBeDefined();
    expect(Array.isArray(data.steps)).toBe(true);
    expect(data.steps.length).toBeGreaterThan(0);
    expect(typeof data.sanity_score).toBe("number");
    expect(data.sanity_score).toBeGreaterThanOrEqual(0);
    expect(data.sanity_score).toBeLessThanOrEqual(100);
    expect(data.ending_type).toBe("normal");
  });

  it("returns 400 for missing situation", async () => {
    const req = makeRequest({
      level: 3,
      perspective: "gen_z",
    });

    const res = await generatePOST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("returns 400 for invalid level", async () => {
    const req = makeRequest({
      situation: "test",
      level: 10,
      perspective: "gen_z",
    });

    const res = await generatePOST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid perspective", async () => {
    const req = makeRequest({
      situation: "test",
      level: 3,
      perspective: "invalid_mode",
    });

    const res = await generatePOST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty situation", async () => {
    const req = makeRequest({
      situation: "",
      level: 1,
      perspective: "psychologist",
    });

    const res = await generatePOST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for situation exceeding 200 chars", async () => {
    const req = makeRequest({
      situation: "a".repeat(201),
      level: 1,
      perspective: "psychologist",
    });

    const res = await generatePOST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 for malformed JSON body", async () => {
    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });

    const res = await generatePOST(req);
    expect(res.status).toBe(500);
  });
});

describe("POST /api/alternate-ending", () => {
  it("returns 200 with valid request", async () => {
    const req = makeRequest({
      situation: "เขาไม่ตอบแชท",
      steps: ["step 1", "step 2", "step 3"],
      level: 3,
      perspective: "gen_z",
      ending_type: "worst",
    });

    const res = await alternateEndingPOST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(typeof data.new_final_step).toBe("string");
    expect(data.new_final_step.length).toBeGreaterThan(0);
    expect(typeof data.sanity_score).toBe("number");
    expect(data.sanity_score).toBeGreaterThanOrEqual(0);
    expect(data.sanity_score).toBeLessThanOrEqual(100);
    expect(["worst", "best", "delusional"]).toContain(data.ending_type);
  });

  it("returns 400 for missing steps", async () => {
    const req = makeRequest({
      situation: "test",
      level: 3,
      perspective: "gen_z",
      ending_type: "worst",
    });

    const res = await alternateEndingPOST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid ending_type", async () => {
    const req = makeRequest({
      situation: "test",
      steps: ["step 1"],
      level: 3,
      perspective: "gen_z",
      ending_type: "invalid",
    });

    const res = await alternateEndingPOST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty steps array", async () => {
    const req = makeRequest({
      situation: "test",
      steps: [],
      level: 3,
      perspective: "gen_z",
      ending_type: "best",
    });

    const res = await alternateEndingPOST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty situation", async () => {
    const req = makeRequest({
      situation: "",
      steps: ["step 1"],
      level: 1,
      perspective: "psychologist",
      ending_type: "delusional",
    });

    const res = await alternateEndingPOST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 for malformed JSON body", async () => {
    const req = new Request("http://localhost/api/alternate-ending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });

    const res = await alternateEndingPOST(req);
    expect(res.status).toBe(500);
  });
});
