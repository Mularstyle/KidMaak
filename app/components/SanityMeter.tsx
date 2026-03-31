"use client";

interface SanityMeterProps {
  score: number;
  visible: boolean;
}

function getScoreColor(score: number): {
  bar: string;
  text: string;
  bg: string;
} {
  if (score >= 80) {
    return {
      bar: "bg-green-500",
      text: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    };
  }
  if (score >= 40) {
    return {
      bar: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
    };
  }
  return {
    bar: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  };
}

export default function SanityMeter({ score, visible }: SanityMeterProps) {
  if (!visible) return null;

  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const colors = getScoreColor(clampedScore);

  return (
    <div
      className="w-full max-w-lg mx-auto mt-4 animate-[fadeIn_0.5s_ease-in-out]"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          🧠 Sanity Score
        </span>
        <span className={`text-lg font-bold ${colors.text}`}>
          {clampedScore}%
        </span>
      </div>

      <div
        className={`w-full h-4 rounded-full overflow-hidden ${colors.bg}`}
      >
        <div
          className={`h-full rounded-full ${colors.bar} transition-all duration-700 ease-out animate-[barGrow_0.8s_ease-out]`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>

      <p className={`text-xs mt-1 ${colors.text}`}>
        {clampedScore >= 80
          ? "ยังมีสติอยู่ ไม่เป็นไร 😌"
          : clampedScore >= 40
            ? "เริ่มคิดมากแล้วนะ... 😰"
            : "สติหลุดไปแล้ว! 🤯"}
      </p>
    </div>
  );
}
