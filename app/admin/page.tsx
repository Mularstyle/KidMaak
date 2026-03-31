'use client';

import { useState } from 'react';

interface Stats {
  total: { generates: number; alternateEndings: number; total: number };
  today: DailyStats;
  last7Days: DailyStats[];
}

interface DailyStats {
  date: string;
  totalGenerates: number;
  totalAlternateEndings: number;
  levelBreakdown: Record<string, number>;
  perspectiveBreakdown: Record<string, number>;
  topSituations: { situation: string; count: number }[];
}

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stats', {
        headers: { 'Authorization': `Bearer ${secret}` },
      });
      if (!res.ok) {
        throw new Error(res.status === 401 ? 'รหัสไม่ถูกต้อง' : 'เกิดข้อผิดพลาด');
      }
      const data = await res.json();
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-mono">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-xl font-bold mb-6">📊 KidMaak Admin</h1>

        {/* Login */}
        {!stats && (
          <div className="space-y-3">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="ใส่รหัส admin..."
              onKeyDown={(e) => e.key === 'Enter' && fetchStats()}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
            <button
              onClick={fetchStats}
              disabled={loading || !secret}
              className="rounded-lg bg-red-500 px-5 py-2 text-xs uppercase tracking-wider text-white hover:bg-red-600 disabled:opacity-40"
            >
              {loading ? '...' : 'ดู stats'}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}

        {/* Stats Dashboard */}
        {stats && (
          <div className="space-y-8">
            {/* Total */}
            <section>
              <h2 className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">total</h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-500">{stats.total.generates}</p>
                  <p className="text-[10px] text-neutral-500">generates</p>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{stats.total.alternateEndings}</p>
                  <p className="text-[10px] text-neutral-500">alt endings</p>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{stats.total.total}</p>
                  <p className="text-[10px] text-neutral-500">total</p>
                </div>
              </div>
            </section>

            {/* Today */}
            <section>
              <h2 className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">today — {stats.today.date}</h2>
              <p className="text-sm">{stats.today.totalGenerates} generates, {stats.today.totalAlternateEndings} alt endings</p>

              {Object.keys(stats.today.levelBreakdown).length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">levels</p>
                  <div className="flex gap-2">
                    {Object.entries(stats.today.levelBreakdown).sort().map(([level, count]) => (
                      <span key={level} className="text-xs border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1">
                        Lv.{level}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(stats.today.perspectiveBreakdown).length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">perspectives</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stats.today.perspectiveBreakdown).sort((a, b) => b[1] - a[1]).map(([p, count]) => (
                      <span key={p} className="text-xs border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1">
                        {p}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {stats.today.topSituations.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">top situations</p>
                  <div className="space-y-1">
                    {stats.today.topSituations.map((s, i) => (
                      <p key={i} className="text-xs">
                        <span className="text-red-500 mr-1">{s.count}x</span> {s.situation}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Last 7 Days */}
            <section>
              <h2 className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">last 7 days</h2>
              <div className="space-y-1">
                {stats.last7Days.map((day) => (
                  <div key={day.date} className="flex items-center justify-between text-xs border-b border-neutral-100 dark:border-neutral-900 py-1.5">
                    <span className="text-neutral-500">{day.date}</span>
                    <span>{day.totalGenerates + day.totalAlternateEndings} calls</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Refresh */}
            <button
              onClick={fetchStats}
              className="text-xs text-red-400 underline underline-offset-2 hover:text-red-300"
            >
              ↻ refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
