"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Declare gtag on window for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      target: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

/**
 * Google Analytics 4 — track page views + custom events.
 * Uses NEXT_PUBLIC_GA_ID from environment variables.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;

    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    window.gtag("config", GA_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Track a custom Google Analytics 4 event.
 * Usage: trackGAEvent('chat_started', { category: 'chat', label: 'Accessoires' })
 */
export function trackGAEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

/**
 * Track a chat_started event.
 */
export function trackChatStarted(params?: Record<string, unknown>) {
  trackGAEvent("chat_started", {
    category: "chat",
    ...params,
  });
}

/**
 * Track a chat_completed event.
 */
export function trackChatCompleted(params?: Record<string, unknown>) {
  trackGAEvent("chat_completed", {
    category: "chat",
    ...params,
  });
}
