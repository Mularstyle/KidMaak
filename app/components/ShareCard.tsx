"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";

interface ShareCardProps {
  situation: string;
  steps: string[];
  sanityScore: number;
  visible: boolean;
}

function buildShareText(situation: string, steps: string[], sanityScore: number): string {
  const lines = [`"${situation}"`];
  steps.forEach((step) => lines.push(`> ${step}`));
  lines.push(`sanity: ${Math.round(sanityScore)}%`);
  lines.push("");
  lines.push("#คิดมาก #KidMaak");
  return lines.join("\n");
}

export default function ShareCard({ situation, steps, sanityScore, visible }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyFallback, setCopyFallback] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const clamped = Math.max(0, Math.min(100, Math.round(sanityScore)));
  const shareText = buildShareText(situation, steps, clamped);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setError(null);
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = "overthink.png";
      link.href = dataUrl;
      link.click();
    } catch {
      setError("ไม่สามารถสร้างภาพได้ ลองใหม่อีกครั้ง");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    setError(null);
    setCopyFallback(null);
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFallback(shareText);
    }
  };

  return (
    <div className="w-full mt-8 animate-fade-in">
      {/* Action buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 py-2 text-xs font-mono uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
        >
          {isDownloading ? "..." : "↓ download"}
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 py-2 text-xs font-mono uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {copied ? "✓ copied" : "⎘ copy text"}
        </button>
      </div>

      {error && <p className="text-xs text-red-500 text-center mb-3">{error}</p>}

      {copyFallback && (
        <div className="mb-4 p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg">
          <p className="text-xs text-neutral-500 mb-2">คัดลอกข้อความด้านล่าง:</p>
          <textarea
            readOnly value={copyFallback} rows={6}
            className="w-full text-xs bg-transparent border border-neutral-200 dark:border-neutral-800 rounded p-2 resize-none font-mono"
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {/* Share Card — captured by html-to-image */}
      <div
        ref={cardRef}
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="px-6 py-8 sm:px-8 sm:py-10" style={{ maxWidth: 480, margin: "0 auto" }}>
          {/* Title */}
          <p
            className="text-center mb-6 uppercase tracking-[0.25em]"
            style={{ fontSize: 10, color: "#ef4444", fontFamily: "monospace" }}
          >
            คิดมาก KidMaak
          </p>

          {/* Situation */}
          <p
            className="text-center mb-6"
            style={{ fontSize: 16, color: "#ffffff", fontFamily: "monospace", lineHeight: 1.6 }}
          >
            &ldquo;{situation}&rdquo;
          </p>

          {/* Divider */}
          <div className="mb-5" style={{ borderTop: "1px solid #262626" }} />

          {/* Steps */}
          <div className="space-y-2 mb-6">
            {steps.map((step, i) => (
              <p
                key={i}
                style={{ fontSize: 13, color: "#a3a3a3", fontFamily: "monospace", lineHeight: 1.5 }}
              >
                <span style={{ color: "#ef4444", marginRight: 6 }}>&gt;</span>
                {step}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="mb-5" style={{ borderTop: "1px solid #262626" }} />

          {/* Sanity */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: 10, color: "#525252", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                sanity
              </span>
              <span style={{ fontSize: 13, color: clamped < 30 ? "#ef4444" : "#a3a3a3", fontFamily: "monospace", fontWeight: "bold" }}>
                {clamped}%
              </span>
            </div>
            <div style={{ width: "100%", height: 4, backgroundColor: "#1a1a1a", borderRadius: 2 }}>
              <div
                style={{
                  width: `${clamped}%`,
                  height: "100%",
                  backgroundColor: clamped < 30 ? "#ef4444" : clamped < 60 ? "#f87171" : "#525252",
                  borderRadius: 2,
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <p
            className="text-center"
            style={{ fontSize: 10, color: "#404040", fontFamily: "monospace" }}
          >
            #คิดมาก
          </p>
        </div>
      </div>
    </div>
  );
}
