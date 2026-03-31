'use client';

import type { TriggerTemplate } from '@/app/lib/types';

interface TriggerTemplatesProps {
  onSelect: (template: string) => void;
}

const TEMPLATES: TriggerTemplate[] = [
  { id: 'no-reply', label: 'เขาไม่ตอบแชท', situation: 'เขาไม่ตอบแชท' },
  { id: 'exam-soon', label: 'สอบใกล้แล้วแต่ยังไม่อ่าน', situation: 'สอบใกล้แล้วแต่ยังไม่อ่าน' },
  { id: 'boss-talk', label: 'หัวหน้าเรียกคุย', situation: 'หัวหน้าเรียกคุย' },
];

export default function TriggerTemplates({ onSelect }: TriggerTemplatesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(t.situation)}
          className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 transition-colors hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
