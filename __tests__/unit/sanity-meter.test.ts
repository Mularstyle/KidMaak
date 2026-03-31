import { describe, it, expect } from "vitest";

// Test the color mapping logic used by SanityMeter
// Extracted logic: score >= 80 → green, 40-79 → yellow, 0-39 → red

function getScoreColor(score: number): "green" | "yellow" | "red" {
  if (score >= 80) return "green";
  if (score >= 40) return "yellow";
  return "red";
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

describe("SanityMeter - color logic", () => {
  it("returns green for scores 80-100", () => {
    expect(getScoreColor(80)).toBe("green");
    expect(getScoreColor(90)).toBe("green");
    expect(getScoreColor(100)).toBe("green");
  });

  it("returns yellow for scores 40-79", () => {
    expect(getScoreColor(40)).toBe("yellow");
    expect(getScoreColor(60)).toBe("yellow");
    expect(getScoreColor(79)).toBe("yellow");
  });

  it("returns red for scores 0-39", () => {
    expect(getScoreColor(0)).toBe("red");
    expect(getScoreColor(20)).toBe("red");
    expect(getScoreColor(39)).toBe("red");
  });

  it("handles boundary at 80", () => {
    expect(getScoreColor(79)).toBe("yellow");
    expect(getScoreColor(80)).toBe("green");
  });

  it("handles boundary at 40", () => {
    expect(getScoreColor(39)).toBe("red");
    expect(getScoreColor(40)).toBe("yellow");
  });
});

describe("SanityMeter - score clamping", () => {
  it("clamps negative scores to 0", () => {
    expect(clampScore(-10)).toBe(0);
  });

  it("clamps scores above 100 to 100", () => {
    expect(clampScore(150)).toBe(100);
  });

  it("rounds decimal scores", () => {
    expect(clampScore(79.6)).toBe(80);
    expect(clampScore(39.4)).toBe(39);
  });

  it("passes through valid scores unchanged", () => {
    expect(clampScore(50)).toBe(50);
    expect(clampScore(0)).toBe(0);
    expect(clampScore(100)).toBe(100);
  });
});
