'use client';

import { useState, useEffect } from 'react';
import { validateSituation } from '@/app/lib/validators';

interface SituationInputProps {
  onSubmit: (situation: string) => void;
  isLoading: boolean;
  defaultValue?: string;
}

const MAX_LENGTH = 200;
const WARNING_THRESHOLD = 180;

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
    const newValue = e.target.value;
    if (newValue.length <= MAX_LENGTH) {
      setValue(newValue);
      if (error) setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateSituation(value);
    if (!result.valid) {
      setError(result.error ?? null);
      return;
    }
    onSubmit(value);
  };

  const charCount = value.length;
  const isNearLimit = charCount >= WARNING_THRESHOLD;
  const isAtLimit = charCount >= MAX_LENGTH;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="พิมพ์สถานการณ์ที่ทำให้คิดมาก..."
          rows={3}
          maxLength={MAX_LENGTH}
          disabled={isLoading}
          className="w-full resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span
          className={`absolute bottom-3 right-3 text-xs ${
            isAtLimit
              ? 'text-red-500 font-semibold'
              : isNearLimit
                ? 'text-red-400'
                : 'text-gray-400'
          }`}
        >
          {charCount}/{MAX_LENGTH}
        </span>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-purple-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-purple-700 active:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isLoading ? 'กำลังคิด...' : '🧠 เริ่มคิดมาก!'}
      </button>
    </form>
  );
}
