"use client";

/**
 * Troviio Analytics — Tracking d'événements frontend
 *
 * Envoie les événements à l'API backend + Google Analytics (si présent)
 *
 * Utilisation :
 *   trackEvent('chat_started', { category: 'tv' })
 *   trackEvent('affiliate_click', { product_id: 'xxx', position: 'catalogue' })
 *   trackEvent('newsletter_signup', { source: 'home' })
 */

type EventProperties = Record<string, unknown>;

export function trackEvent(eventName: string, properties: EventProperties = {}): void {
  if (typeof window === "undefined") return;

  // Google Analytics / gtag (si présent)
  try {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", eventName, properties);
    }
  } catch {
    // Silently fail
  }

  // Microsoft Clarity (si présent)
  try {
    if (typeof (window as any).clarity === "function") {
      (window as any).clarity("event", eventName, JSON.stringify(properties));
    }
  } catch {
    // Silently fail
  }

  // Backend API — fire-and-forget
  try {
    const payload = {
      event_type: eventName,
      event_data: properties,
      page_url: window.location.pathname,
      session_id: getSessionId(),
    };

    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true, // Important: envoie même si l'utilisateur quitte la page
    }).catch(() => {
      // Silently fail — ne pas casser l'expérience utilisateur
    });
  } catch {
    // Silently fail
  }
}

/**
 * Génère ou récupère un session_id persistant (localStorage)
 */
function getSessionId(): string {
  try {
    const key = "troviio.session_id";
    let sid = window.localStorage.getItem(key);
    if (!sid) {
      sid = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
