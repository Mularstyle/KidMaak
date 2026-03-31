'use client';

import { useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

export default function Turnstile({ onVerify, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !containerRef.current || !siteKey) return;
    if (widgetIdRef.current) return; // already rendered

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: 'auto',
      size: 'flexible',
      callback: (token: string) => onVerify(token),
      'expired-callback': () => onExpire?.(),
    });
  }, [siteKey, onVerify, onExpire]);

  useEffect(() => {
    if (!siteKey) {
      // No site key = skip turnstile (dev mode), auto-verify
      onVerify('dev-mode-skip');
      return;
    }

    // If turnstile script already loaded
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Load the script
    window.onTurnstileLoad = renderWidget;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, renderWidget, onVerify]);

  // Don't render anything if no site key (dev mode)
  if (!siteKey) return null;

  return <div ref={containerRef} className="mt-2" />;
}
