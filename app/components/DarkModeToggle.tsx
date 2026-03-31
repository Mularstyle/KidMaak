'use client';

import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed top-4 right-4 z-50 rounded-md border border-neutral-300 dark:border-neutral-700 bg-[var(--background)] px-2 py-1 text-xs font-mono text-neutral-500 transition-colors hover:border-red-400 hover:text-red-500"
    >
      {isDark ? 'light' : 'dark'}
    </button>
  );
}
