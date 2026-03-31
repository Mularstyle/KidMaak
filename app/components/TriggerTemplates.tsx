'use client';

import { TriggerTemplate } from '@/app/lib/types';

interface TriggerTemplatesProps {
  onSelect: (template: string) => void;
}

const TEMPLATES: TriggerTemplate[] = [
  { id: 'no-reply', label: '💬 เขาไม่ตอบแชท', situation: 'เขาไม่ตอบแชท' },
  { id: 'exam-soon', label: '📚 สอบใกล้แล้วแต่ยังไม่อ่าน', situation: 'สอบใกล้แล้วแต่ยังไม่อ่าน' },
  { id: 'boss-talk', label: '👔 หัวหน้าเรียกคุย', situation: 'หัวหน้าเรียกคุย' },
];

export default function TriggerTemplates({ onSelect }: TriggerTemplatesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelect(template.situation)}
          className="rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 active:bg-purple-100 dark:active:bg-purple-900/50"
        >
          {template.label}
        </button>
      ))}
    </div>
  );
}
