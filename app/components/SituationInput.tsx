'use client';

import { useState, useEffect } from 'react';
import { validateSituation } from '@/app/lib/validators';

interface SituationInputProps {
  onSubmit: (situation: string) => void;
  isLoading: boolean;
  defaultValue?: string;
}

const MAX_LENGTH = 200;

export default function SituationInput({ onSubmit, isLoading, defaultValue }: SituationInputProps) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(defaultValue);
      setError(null);
    }
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (v.length <= MAX_LENGTH) {
      setValue(v);
      if (error) setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateSituation(value);
    if (!result.valid) { setError(result.error ?? null); return; }
    onSubmit(value);
  };

  const count = value.length;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="พิมพ์สถานการณ์ที่ทำให้คิดมาก..."
          rows={2}
          maxLength={MAX_LENGTH}
          disabled={isLoading}
          className="w-full resize-none rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-3 text-sm font-mono text-[var(--foreground)] placeholder-neutral-400 dark:placeholder-neutral-600 transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/20 disabled:opacity-40"
        />
        <span className={`absolute bottom-2.5 right-3 text-[10px] font-mono ${count >= MAX_LENGTH ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-600'}`}>
          {count}/{MAX_LENGTH}
        </span>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-red-500 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-white transition-colors hover:bg-red-600 active:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? 'processing...' : '→ เริ่มคิดมาก'}
      </button>
    </form>
  );
}
