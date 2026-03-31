"use client";

import { useRef, useEffect } from "react";
import { useThoughtAnimation } from "../hooks/useThoughtAnimation";

interface ThoughtChainProps {
  steps: string[];
  onAnimationComplete?: () => void;
}

export default function ThoughtChain({
  steps,
  onAnimationComplete,
}: ThoughtChainProps) {
  const { visibleStepCount, isAnimating, isComplete } =
    useThoughtAnimation(steps);
  const endRef = useRef<HTMLDivElement>(null);
  const hasCalledComplete = useRef(false);

  // Auto-scroll to latest step
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [visibleStepCount]);

  // Call onAnimationComplete when all steps shown
  useEffect(() => {
    if (isComplete && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onAnimationComplete?.();
    }
  }, [isComplete, onAnimationComplete]);

  // Reset the completion flag when steps change
  useEffect(() => {
    hasCalledComplete.current = false;
  }, [steps]);

  if (steps.length === 0) return null;

  const visibleSteps = steps.slice(0, visibleStepCount);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-0">
      {visibleSteps.map((step, index) => (
        <div key={index} className="w-full flex flex-col items-center">
          {/* Arrow connector (between steps) */}
          {index > 0 && (
            <div className="text-purple-400 text-2xl py-1 select-none">↓</div>
          )}

          {/* Step bubble */}
          <div
            className={`w-full rounded-xl border border-purple-200 bg-white/80 dark:bg-gray-800/80 dark:border-purple-700 px-4 py-3 shadow-sm text-sm md:text-base transition-all duration-500 ${
              index === visibleStepCount - 1
                ? "animate-[fadeIn_0.5s_ease-in-out]"
                : ""
            }`}
          >
            <span className="text-purple-500 dark:text-purple-400 font-semibold mr-2">
              Step {index + 1}:
            </span>
            <span className="text-gray-800 dark:text-gray-200">{step}</span>
          </div>
        </div>
      ))}

      {/* Loading indicator while animating */}
      {isAnimating && (
        <div className="w-full flex flex-col items-center">
          <div className="text-purple-400 text-2xl py-1 select-none">↓</div>
          <div className="flex items-center gap-2 text-purple-500 dark:text-purple-400 text-sm py-2 animate-pulse">
            <span>🧠</span>
            <span>กำลังคิด...</span>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={endRef} />
    </div>
  );
}
