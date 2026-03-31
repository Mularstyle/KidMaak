'use client';

import { useState, useRef } from 'react';
import type { OverthinkLevel, PerspectiveMode, GenerateResponse, EndingType } from '@/app/lib/types';
import TriggerTemplates from '@/app/components/TriggerTemplates';
import SituationInput from '@/app/components/SituationInput';
import OverthinkLevelSelector from '@/app/components/OverthinkLevelSelector';
import PerspectiveSelector from '@/app/components/PerspectiveSelector';
import ThoughtChain from '@/app/components/ThoughtChain';
import SanityMeter from '@/app/components/SanityMeter';
import AlternateEndings from '@/app/components/AlternateEndings';
import ShareCard from '@/app/components/ShareCard';
import DarkModeToggle from '@/app/components/DarkModeToggle';
import Turnstile from '@/app/components/Turnstile';

export default function Home() {
  const [situation, setSituation] = useState('');
  const [level, setLevel] = useState<OverthinkLevel>(3);
  const [perspective, setPerspective] = useState<PerspectiveMode>('gen_z');
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndingLoading, setIsEndingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const turnstileTokenRef = useRef<string | null>(null);

  const handleTurnstileVerify = (token: string) => {
    turnstileTokenRef.current = token;
  };

  const handleTurnstileExpire = () => {
    turnstileTokenRef.current = null;
  };

  const handleSubmit = async (inputSituation: string) => {
    setError(null);
    setIsLoading(true);
    setResult(null);
    setIsAnimationComplete(false);
    setSituation(inputSituation);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: inputSituation,
          level,
          perspective,
          turnstileToken: turnstileTokenRef.current,
        }),
      });
      if (!res.ok) {
        if (res.status === 429 || res.status === 403) {
          const data = await res.json();
          throw new Error(data.error || 'Request blocked');
        }
        throw new Error('API error');
      }
      const data: GenerateResponse = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error && e.message !== 'API error' ? e.message : 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlternateEnding = async (endingType: EndingType) => {
    if (!result) return;
    setIsEndingLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/alternate-ending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation,
          steps: result.steps,
          level,
          perspective,
          ending_type: endingType,
          turnstileToken: turnstileTokenRef.current,
        }),
      });
      if (!res.ok) {
        if (res.status === 429 || res.status === 403) {
          const data = await res.json();
          throw new Error(data.error || 'Request blocked');
        }
        throw new Error('API error');
      }
      const data = await res.json();
      setResult({
        ...result,
        steps: [...result.steps.slice(0, -1), data.new_final_step],
        sanity_score: data.sanity_score,
      });
    } catch (e) {
      setError(e instanceof Error && e.message !== 'API error' ? e.message : 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง');
    } finally {
      setIsEndingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DarkModeToggle />
      <div className="mx-auto max-w-xl px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-red-500 mb-2">
            [ system overload ]
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            คิดมาก KidMaak
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            พิมพ์สถานการณ์ แล้วดูว่าสมองจะพาไปไกลแค่ไหน
          </p>
        </header>

        {/* Trigger Templates */}
        <section className="mb-4">
          <TriggerTemplates onSelect={setSituation} />
        </section>

        {/* Input */}
        <section className="mb-6">
          <SituationInput onSubmit={handleSubmit} isLoading={isLoading} defaultValue={situation} />
          <Turnstile onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} />
        </section>

        {/* Controls */}
        <section className="mb-4">
          <OverthinkLevelSelector value={level} onChange={setLevel} />
        </section>
        <section className="mb-8">
          <PerspectiveSelector value={perspective} onChange={setPerspective} />
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 border border-red-500/30 bg-red-500/5 rounded-lg px-4 py-3 text-center animate-fade-in">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => handleSubmit(situation)}
              className="mt-2 text-xs text-red-400 underline underline-offset-2 hover:text-red-300"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* Thought Chain */}
        {result && (
          <section className="mb-6">
            <ThoughtChain steps={result.steps} onAnimationComplete={() => setIsAnimationComplete(true)} />
          </section>
        )}

        {/* Sanity Meter */}
        {result && <SanityMeter score={result.sanity_score} visible={isAnimationComplete} />}

        {/* Alternate Endings */}
        {result && (
          <AlternateEndings onSelect={handleAlternateEnding} isLoading={isEndingLoading} visible={isAnimationComplete} />
        )}

        {/* Share Card */}
        {result && (
          <ShareCard situation={situation} steps={result.steps} sanityScore={result.sanity_score} visible={isAnimationComplete} />
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-neutral-400 dark:text-neutral-600">
          <p className="animate-glitch">สร้างด้วยความคิดมาก™ — KidMaak</p>
        </footer>
      </div>
    </div>
  );
}
