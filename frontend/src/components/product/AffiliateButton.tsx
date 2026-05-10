"use client";

import { useState } from "react";

interface AffiliateButtonProps {
  productId: string;
  /** Fallback URL directe si /api/go/ ne marche pas */
  directUrl?: string;
  label?: string;
  className?: string;
  source?: string;
  position?: number;
}

/**
 * AffiliateButton — Tracke le clic via /api/go/{productId} puis redirige.
 * Couleur CORAL #FF6B5F réservée exclusivement aux boutons affiliés.
 */
export default function AffiliateButton({
  productId,
  directUrl,
  label = "Voir sur Amazon →",
  className = "",
  source = "unknown",
  position = 0,
}: AffiliateButtonProps) {
  const [clicking, setClicking] = useState(false);

  const handleClick = () => {
    setClicking(true);
    // Ouvre /api/go/{productId} pour tracking + redirect
    window.open(`/api/go/${productId}?src=${source}&pos=${position}`, "_blank", "noopener");
    setTimeout(() => setClicking(false), 500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={clicking}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${className}`}
      style={{
        background: "linear-gradient(135deg, #FF6B5F, #E5554A)",
        boxShadow: clicking ? "none" : "0 4px 16px rgba(255,107,95,0.3)",
      }}
    >
      {clicking ? "🔗 Redirection..." : label}
    </button>
  );
}

/**
 * Lien direct Amazon (sans tracking via /api/go/) — fallback
 * Utilisé quand le productId n'est pas disponible mais qu'on a une URL directe
 */
export function AffiliateDirectLink({
  href,
  label = "Voir sur Amazon →",
  className = "",
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0 ${className}`}
      style={{
        background: "linear-gradient(135deg, #FF6B5F, #E5554A)",
        boxShadow: "0 4px 16px rgba(255,107,95,0.3)",
      }}
    >
      {label}
    </a>
  );
}

/**
 * DisclosureBadge — Mention légale d'affiliation Amazon.
 * À placer à proximité des liens affiliés.
 */
export function DisclosureBadge() {
  return (
    <p className="text-xs text-[#8B8FA3] leading-relaxed">
      Troviio perçoit une commission sur les achats via ce lien Amazon, sans surcoût pour toi.
      Nos recommandations restent indépendantes.
    </p>
  );
}
