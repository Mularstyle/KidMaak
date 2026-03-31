'use client';

import { PerspectiveMode } from '@/app/lib/types';

interface PerspectiveSelectorProps {
  value: PerspectiveMode;
  onChange: (mode: PerspectiveMode) => void;
}

const PERSONAS: { mode: PerspectiveMode; emoji: string; label: string }[] = [
  { mode: 'psychologist', emoji: '🧠', label: 'Psychologist' },
  { mode: 'doom_thinker', emoji: '💀', label: 'Doom Thinker' },
  { mode: 'gen_z', emoji: '📱', label: 'Gen Z' },
  { mode: 'gen_alpha', emoji: '🎮', label: 'Gen Alpha' },
  { mode: 'anime_protagonist', emoji: '⚔️', label: 'Anime Protagonist' },
  { mode: 'thai_mom', emoji: '👩‍👧', label: 'Thai Mom' },
];

export default function PerspectiveSelector({ value, onChange }: PerspectiveSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">มุมมองผู้พูด</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PERSONAS.map(({ mode, emoji, label }) => {
          const isSelected = value === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange(mode)}
              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-left transition-colors ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/20'
              }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
