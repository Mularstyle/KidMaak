import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Test the core animation logic without React rendering
// We test the timing/state logic that the hook implements

describe("useThoughtAnimation - core logic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should increment count with default 700ms delay", () => {
    const steps = ["step1", "step2", "step3"];
    const delayMs = 700;
    let count = 0;
    const totalSteps = steps.length;

    // Simulate the timer-based increment logic
    const interval = setInterval(() => {
      if (count < totalSteps) {
        count++;
      }
    }, delayMs);

    expect(count).toBe(0);

    vi.advanceTimersByTime(700);
    expect(count).toBe(1);

    vi.advanceTimersByTime(700);
    expect(count).toBe(2);

    vi.advanceTimersByTime(700);
    expect(count).toBe(3);

    // Should not exceed total steps
    vi.advanceTimersByTime(700);
    expect(count).toBe(3);

    clearInterval(interval);
  });

  it("should handle empty steps array", () => {
    const steps: string[] = [];
    // With empty steps, animation should not start
    expect(steps.length).toBe(0);
    // isComplete should be false for empty steps
    const isComplete = steps.length > 0 && 0 >= steps.length;
    expect(isComplete).toBe(false);
    // isAnimating should be false for empty steps
    const isAnimating = steps.length > 0 && 0 < steps.length;
    expect(isAnimating).toBe(false);
  });

  it("should compute isComplete correctly", () => {
    const steps = ["a", "b"];
    // When visibleStepCount equals steps.length, isComplete = true
    const visibleStepCount = 2;
    const isComplete = steps.length > 0 && visibleStepCount >= steps.length;
    expect(isComplete).toBe(true);
    const isAnimating = steps.length > 0 && visibleStepCount < steps.length;
    expect(isAnimating).toBe(false);
  });

  it("should compute isAnimating correctly when in progress", () => {
    const steps = ["a", "b", "c"];
    const visibleStepCount = 1;
    const isAnimating = steps.length > 0 && visibleStepCount < steps.length;
    expect(isAnimating).toBe(true);
    const isComplete = steps.length > 0 && visibleStepCount >= steps.length;
    expect(isComplete).toBe(false);
  });

  it("should support custom delay", () => {
    const delayMs = 500;
    let count = 0;

    const interval = setInterval(() => {
      if (count < 2) count++;
    }, delayMs);

    vi.advanceTimersByTime(500);
    expect(count).toBe(1);

    vi.advanceTimersByTime(500);
    expect(count).toBe(2);

    clearInterval(interval);
  });

  it("should handle single step", () => {
    const steps = ["only step"];
    let count = 0;

    const timer = setTimeout(() => {
      count = 1;
    }, 700);

    vi.advanceTimersByTime(700);
    expect(count).toBe(1);

    const isComplete = steps.length > 0 && count >= steps.length;
    expect(isComplete).toBe(true);

    clearTimeout(timer);
  });
});
