"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";

interface ShareCardProps {
  situation: string;
  steps: string[];
  sanityScore: number;
  visible: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

function buildShareText(situation: string, steps: string[], sanityScore: number): string {
  const lines = [`🧠 ${situation}`];
  steps.forEach((step, i) => {
    lines.push(`↓`);
    lines.push(`Step ${i + 1}: ${step}`);
  });
  lines.push(`↓`);
  lines.push(`Sanity: ${Math.round(sanityScore)}%`);
  lines.push("");
  lines.push("— Overthink Simulator 🌀");
  return lines.join("\n");
}

export default function ShareCard({ situation, steps, sanityScore, visible }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [copyFallback, setCopyFallback] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!visible) return null;

  const clampedScore = Math.max(0, Math.min(100, Math.round(sanityScore)));
  const shareText = buildShareText(situation, steps, clampedScore);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setImageError(null);
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "overthink-card.png";
      link.href = dataUrl;
      link.click();
    } catch {
      setImageError("ไม่สามารถสร้างภาพได้ ลองใหม่อีกครั้ง");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    setImageError(null);
    setCopyFallback(null);
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      setCopyFallback(shareText);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-6 animate-[fadeIn_0.5s_ease-in-out]">
      {/* Action buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>📥</span>
          )}
          <span>Download image</span>
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors duration-200"
        >
          <span>📋</span>
          <span>Copy for social</span>
        </button>
      </div>

      {/* Inline error for image generation */}
      {imageError && (
        <p className="text-sm text-red-500 text-center mb-3">{imageError}</p>
      )}

      {/* Fallback text for clipboard fail */}
      {copyFallback && (
        <div className="mb-4 p-3 rounded-xl border border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-2">
            ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาคัดลอกข้อความด้านล่าง:
          </p>
          <textarea
            readOnly
            value={copyFallback}
            rows={6}
            className="w-full text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 resize-none"
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {/* Card preview (captured by html-to-image) */}
      <div
        ref={cardRef}
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <p className="text-white/70 text-xs font-medium tracking-wider uppercase">
              Overthink Simulator 🌀
            </p>
          </div>

          {/* Situation */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 mb-3">
            <p className="text-white text-sm font-medium">🧠 {situation}</p>
          </div>

          {/* Steps */}
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-white/50 text-lg py-0.5 select-none">↓</div>
              <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5">
                <p className="text-white text-xs">
                  <span className="text-white/70 font-semibold">Step {i + 1}:</span>{" "}
                  {step}
                </p>
              </div>
            </div>
          ))}

          {/* Sanity Score */}
          <div className="text-white/50 text-lg text-center py-0.5 select-none">↓</div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
            <p className={`text-lg font-bold ${getScoreColor(clampedScore)}`}>
              Sanity: {clampedScore}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
