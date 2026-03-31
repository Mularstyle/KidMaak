"use client";

import type { EndingType } from "@/app/lib/types";

interface AlternateEndingsProps {
  onSelect: (endingType: EndingType) => void;
  isLoading: boolean;
  visible: boolean;
}

const OPTIONS: { type: EndingType; label: string }[] = [
  { type: "worst", label: "worst ending" },
  { type: "best", label: "best ending" },
  { type: "delusional", label: "delusional" },
];

export default function AlternateEndings({ onSelect, isLoading, visible }: AlternateEndingsProps) {
  if (!visible) return null;

  return (
    <div className="w-full mt-4 animate-fade-in">
      <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500 text-center mb-2">
        alternate ending
      </p>
      <div className="flex gap-1.5">
        {OPTIONS.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            disabled={isLoading}
            className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 py-2 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 transition-colors hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : label}
          </button>
        ))}
      </div>
    </div>
  );
}
