import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable (404) — Troviio",
  robots: { index: false, follow: true },
};

const featured = [
  { emoji: "🤖", name: "Aspirateur robot", href: "/c/aspirateur-robot" },
  { emoji: "☕", name: "Machine à café", href: "/c/machine-a-cafe" },
  { emoji: "📱", name: "Smartphone", href: "/c/smartphone" },
  { emoji: "🎧", name: "Casque audio", href: "/c/casque-audio" },
  { emoji: "📺", name: "TV OLED", href: "/c/tv" },
  { emoji: "🛏️", name: "Matelas", href: "/c/matelas" },
  { emoji: "🚲", name: "Vélo électrique", href: "/c/velo-electrique" },
  { emoji: "⚔️", name: "Duels populaires", href: "/duels" },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="text-7xl sm:text-8xl font-black tracking-tighter text-white/5 select-none" style={{ fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl sm:text-6xl">🔍</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
          Page non trouvée
        </h1>

        <p className="mt-4 text-base leading-relaxed text-[#8B8FA3] max-w-md">
          Cette page n&apos;existe pas ou a été déplacée. Mais on peut 
          encore trouver ce que tu cherches ensemble.
        </p>

        {/* Barre de recherche visuelle */}
        <div className="mt-8 w-full max-w-sm">
          <Link
            href="/catalogue"
            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#1A1D2E] px-5 py-4 text-left text-sm text-[#8B8FA3] transition-colors hover:border-[#4257FF]/30 hover:text-white"
          >
            <span className="text-lg">🔎</span>
            <span>Parcourir tout le catalogue</span>
            <span className="ml-auto text-xs text-[#5A5D6E]">390 produits</span>
          </Link>
        </div>

        {/* Catégories populaires */}
        <div className="mt-10 w-full">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5A5D6E] mb-4">
            OU PARCOURIR PAR CATÉGORIE
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {featured.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#8B8FA3] transition-all hover:border-[#4257FF]/30 hover:text-white hover:bg-[#4257FF]/10"
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA duel aléatoire */}
        <div className="mt-10 w-full">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5A5D6E] mb-3">
            UN DUEL POUR TE RASSURER ?
          </p>
          <Link
            href="/duels"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4257FF] to-[#8A7CFF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#4257FF]/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            ⚔️ Voir tous les duels
          </Link>
        </div>

        {/* Lien retour */}
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 text-sm text-[#8B8FA3] transition-colors hover:text-white"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
