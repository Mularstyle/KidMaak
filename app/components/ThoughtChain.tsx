"use client";

import { useRef, useEffect } from "react";
import { useThoughtAnimation } from "../hooks/useThoughtAnimation";

interface ThoughtChainProps {
  steps: string[];
  onAnimationComplete?: () => void;
}

export default function ThoughtChain({ steps, onAnimationComplete }: ThoughtChainProps) {
  const { visibleStepCount, isAnimating, isComplete } = useThoughtAnimation(steps);
  const endRef = useRef<HTMLDivElement>(null);
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [visibleStepCount]);

  useEffect(() => {
    if (isComplete && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onAnimationComplete?.();
    }
  }, [isComplete, onAnimationComplete]);

  useEffect(() => {
    hasCalledComplete.current = false;
  }, [steps]);

  if (steps.length === 0) return null;

  const visibleSteps = steps.slice(0, visibleStepCount);

  return (
    <div className="w-full space-y-0 font-mono">
      {visibleSteps.map((step, index) => (
        <div
          key={index}
          className={`py-2 border-b border-neutral-200 dark:border-neutral-800 text-sm sm:text-base animate-fade-in ${
            index === visibleStepCount - 1 ? "" : ""
          }`}
        >
          <span className="text-red-500 mr-2 select-none">&gt;</span>
          <span className="text-neutral-800 dark:text-neutral-200">{step}</span>
        </div>
      ))}

      {/* Typing indicator */}
      {isAnimating && (
        <div className="py-2 text-sm">
          <span className="text-red-500 mr-2 select-none">&gt;</span>
          <span className="text-neutral-400 cursor-blink">กำลังคิด</span>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
