'use client';

import type { OverthinkLevel } from '@/app/lib/types';

interface OverthinkLevelSelectorProps {
  value: OverthinkLevel;
  onChange: (level: OverthinkLevel) => void;
}

const LEVELS: { level: OverthinkLevel; label: string; thai: string }[] = [
  { level: 1, label: 'rational', thai: 'มีเหตุผล' },
  { level: 2, label: 'worried', thai: 'เริ่มคิดมาก' },
  { level: 3, label: 'spiral', thai: 'วนลูป' },
  { level: 4, label: 'crisis', thai: 'วิกฤต' },
  { level: 5, label: 'chaos', thai: 'บ้าไปแล้ว' },
];

export default function OverthinkLevelSelector({ value, onChange }: OverthinkLevelSelectorProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">level / ระดับ</p>
      <div className="flex gap-1.5">
        {LEVELS.map(({ level, label, thai }) => {
          const isSelected = value === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`flex-1 rounded-md border py-2 text-[11px] font-mono transition-colors ${
                isSelected
                  ? 'border-red-500 bg-red-500/10 text-red-500'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <span className="block font-bold">{level}</span>
              <span className="block text-[9px] mt-0.5">{label}</span>
              <span className="block text-[9px]">{thai}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
