'use client';

import type { PerspectiveMode } from '@/app/lib/types';

interface PerspectiveSelectorProps {
  value: PerspectiveMode;
  onChange: (mode: PerspectiveMode) => void;
}

const PERSONAS: { mode: PerspectiveMode; label: string; thai: string }[] = [
  { mode: 'psychologist', label: 'psychologist', thai: 'นักจิตวิทยา' },
  { mode: 'doom_thinker', label: 'doom thinker', thai: 'คิดลบ' },
  { mode: 'gen_z', label: 'gen z', thai: 'เจนซี' },
  { mode: 'gen_alpha', label: 'gen alpha', thai: 'เจนอัลฟ่า' },
  { mode: 'anime_protagonist', label: 'anime mc', thai: 'พระเอกอนิเมะ' },
  { mode: 'thai_mom', label: 'thai mom', thai: 'แม่ไทย' },
];

export default function PerspectiveSelector({ value, onChange }: PerspectiveSelectorProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-500">style / สไตล์</p>
      <div className="flex flex-wrap gap-1.5">
        {PERSONAS.map(({ mode, label, thai }) => {
          const isSelected = value === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange(mode)}
              className={`rounded-md border px-3 py-1.5 text-[11px] font-mono transition-colors ${
                isSelected
                  ? 'border-red-500 bg-red-500/10 text-red-500'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              {label} <span className="text-[10px] opacity-70">({thai})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
