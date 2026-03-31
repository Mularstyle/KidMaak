"use client";

interface SanityMeterProps {
  score: number;
  visible: boolean;
}

export default function SanityMeter({ score, visible }: SanityMeterProps) {
  if (!visible) return null;

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const barColor = clamped >= 60 ? "bg-neutral-400" : clamped >= 30 ? "bg-red-400" : "bg-red-600";
  const label = clamped >= 60 ? "ยังไหว" : clamped >= 30 ? "เริ่มไม่ไหว" : "สติหลุด";

  return (
    <div className="w-full mt-6 mb-4 animate-fade-in">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">sanity</span>
        <span className={`font-bold ${clamped < 30 ? "text-red-500" : "text-neutral-600 dark:text-neutral-300"}`}>
          {clamped}% — {label}
        </span>
      </div>
      <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out animate-[barGrow_0.8s_ease-out]`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
