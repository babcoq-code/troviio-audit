import Script from "next/script";

// Umami Analytics — auto-hébergé sur le VPS via picksy-umami-1:3000
// TODO: Remplacer par l'URL publique quand le sous-domaine umami.troviio.com sera créé
// Pour l'instant, le script est chargé depuis le VPS via le port 3001 (exposé)
// ATTENTION: sans HTTPS, certains navigateurs peuvent bloquer le script

const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL || "";
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "";

export function UmamiAnalytics() {
  if (!UMAMI_URL || !UMAMI_ID) return null;

  return (
    <Script
      async
      src={`${UMAMI_URL}/script.js`}
      data-website-id={UMAMI_ID}
      strategy="afterInteractive"
    />
  );
}
