'use client';

import { OverthinkLevel } from '@/app/lib/types';

interface OverthinkLevelSelectorProps {
  value: OverthinkLevel;
  onChange: (level: OverthinkLevel) => void;
}

const LEVELS: { level: OverthinkLevel; label: string }[] = [
  { level: 1, label: 'Reasonable human' },
  { level: 2, label: 'Slight worrier' },
  { level: 3, label: 'Full overthinker' },
  { level: 4, label: 'Anxiety master' },
  { level: 5, label: 'Meme/chaos' },
];

export default function OverthinkLevelSelector({ value, onChange }: OverthinkLevelSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">ระดับความคิดมาก</p>
      <div className="flex flex-wrap gap-2">
        {LEVELS.map(({ level, label }) => {
          const isSelected = value === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                isSelected
                  ? 'border-purple-500 bg-purple-600 text-white'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30'
              }`}
            >
              <span className="font-medium">Lv.{level}</span>{' '}
              <span className={isSelected ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
