'use client';

import { useState } from 'react';
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

export default function Home() {
  const [situation, setSituation] = useState('');
  const [level, setLevel] = useState<OverthinkLevel>(3);
  const [perspective, setPerspective] = useState<PerspectiveMode>('gen_z');
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndingLoading, setIsEndingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

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
        body: JSON.stringify({ situation: inputSituation, level, perspective }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data: GenerateResponse = await res.json();
      setResult(data);
    } catch {
      setError('เกิดข้อผิดพลาด ลองใหม่อีกครั้ง');
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
        }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();
      setResult({
        ...result,
        steps: [...result.steps.slice(0, -1), data.new_final_step],
        sanity_score: data.sanity_score,
      });
      // Don't reset isAnimationComplete — keep ShareCard/SanityMeter visible
    } catch {
      setError('เกิดข้อผิดพลาด ลองใหม่อีกครั้ง');
    } finally {
      setIsEndingLoading(false);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSituation(template);
  };

  const handleAnimationComplete = () => {
    setIsAnimationComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <DarkModeToggle />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300 sm:text-4xl">
            🧠 Overthink Simulator
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            พิมพ์สถานการณ์ แล้วดูว่าสมองจะพาไปไกลแค่ไหน
          </p>
        </header>

        {/* Trigger Templates */}
        <section className="mb-4">
          <TriggerTemplates onSelect={handleTemplateSelect} />
        </section>

        {/* Situation Input */}
        <section className="mb-6">
          <SituationInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            defaultValue={situation}
          />
        </section>

        {/* Level Selector */}
        <section className="mb-4">
          <OverthinkLevelSelector value={level} onChange={setLevel} />
        </section>

        {/* Perspective Selector */}
        <section className="mb-8">
          <PerspectiveSelector value={perspective} onChange={setPerspective} />
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => handleSubmit(situation)}
              className="mt-2 rounded-lg bg-red-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* Thought Chain */}
        {result && (
          <section className="mb-6">
            <ThoughtChain
              steps={result.steps}
              onAnimationComplete={handleAnimationComplete}
            />
          </section>
        )}

        {/* Sanity Meter */}
        {result && (
          <SanityMeter
            score={result.sanity_score}
            visible={isAnimationComplete}
          />
        )}

        {/* Alternate Endings */}
        {result && (
          <AlternateEndings
            onSelect={handleAlternateEnding}
            isLoading={isEndingLoading}
            visible={isAnimationComplete}
          />
        )}

        {/* Share Card */}
        {result && (
          <ShareCard
            situation={situation}
            steps={result.steps}
            sanityScore={result.sanity_score}
            visible={isAnimationComplete}
          />
        )}
      </div>
    </div>
  );
}
