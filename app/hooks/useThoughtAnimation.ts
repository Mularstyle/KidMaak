"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseThoughtAnimationOptions {
  delayMs?: number;
}

interface UseThoughtAnimationReturn {
  visibleStepCount: number;
  isAnimating: boolean;
  isComplete: boolean;
  reset: () => void;
}

export function useThoughtAnimation(
  steps: string[],
  options?: UseThoughtAnimationOptions
): UseThoughtAnimationReturn {
  const delayMs = options?.delayMs ?? 700;
  const [visibleStepCount, setVisibleStepCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepsLengthRef = useRef(steps.length);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisibleStepCount(0);
  }, []);

  // Reset when steps array changes (new generation)
  useEffect(() => {
    if (steps.length !== stepsLengthRef.current || steps.length === 0) {
      stepsLengthRef.current = steps.length;
      reset();
    }
  }, [steps, reset]);

  // Animate: increment visibleStepCount from 0 to steps.length
  useEffect(() => {
    if (steps.length === 0) return;

    if (visibleStepCount < steps.length) {
      timerRef.current = setTimeout(() => {
        setVisibleStepCount((prev) => prev + 1);
      }, delayMs);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visibleStepCount, steps.length, delayMs]);

  const isComplete = steps.length > 0 && visibleStepCount >= steps.length;
  const isAnimating = steps.length > 0 && visibleStepCount < steps.length;

  return { visibleStepCount, isAnimating, isComplete, reset };
}
