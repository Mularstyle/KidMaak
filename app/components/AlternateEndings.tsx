"use client";

import type { EndingType } from "@/app/lib/types";

interface AlternateEndingsProps {
  onSelect: (endingType: EndingType) => void;
  isLoading: boolean;
  visible: boolean;
}

const ENDING_OPTIONS: { type: EndingType; label: string; emoji: string }[] = [
  { type: "worst", label: "Worst ending", emoji: "😱" },
  { type: "best", label: "Best ending", emoji: "🌈" },
  { type: "delusional", label: "Delusional ending", emoji: "🦄" },
];

export default function AlternateEndings({
  onSelect,
  isLoading,
  visible,
}: AlternateEndingsProps) {
  if (!visible) return null;

  return (
    <div className="w-full max-w-lg mx-auto mt-4 animate-[fadeIn_0.5s_ease-in-out]">
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
        🔮 ลองเลือกตอนจบแบบอื่น?
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        {ENDING_OPTIONS.map(({ type, label, emoji }) => {
          const isSelected = isLoading;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{emoji}</span>
              )}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
