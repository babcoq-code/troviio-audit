"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface QuickProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image_url: string;
  estimated_score: number;
  category_name?: string;
}

// Fixtures when API fails — memorable head-to-heads
const FIXTURES: [string, string][] = [
  ["samsung-galaxy-s26-ultra", "iphone-17-pro-max"],
  ["thermomix-tm7", "ninja-foodi-smartlid-ol550eu"],
  ["dyson-gen5-detect-absolute", "roborock-s8-maxv-ultra"],
  ["lg-g6-oled-65-oled65g6-2026", "samsung-s95h-65-qd-oled-tq65s95hf-2026"],
  ["apple-macbook-air-13-m4", "asus-rog-zephyrus-g14-2025"],
  ["sony-wh-1000xm6", "bose-quietcomfort-ultra"],
  ["apple-watch-ultra-2", "samsung-galaxy-watch-8"],
  ["hyundai-ioniq-6", "tesla-model-y-juniper"],
];

const VERDICTS: [string, string][] = [
  ["💀 Largue l'autre façon Nessie largue ses concurrents.", "😬 Celui-ci aurait pu, mais pas assez de RGB."],
  ["👑 Quand même. C'est le roi.", "🥈 Une belle médaille d'argent, c'est honorable."],
  ["⚡ Plus rapide, plus fort, mieux. Point.", "🚶 Pas assez de jus pour suivre."],
  ["🔥 Tellement supérieur que c'en est gênant.", "❄️ L'autre est un peu froid sur ce coup."],
  ["🎯 C'est le choix du pro. Tu peux y aller.", "🤷 Pas nul, mais pas le meilleur non plus."],
  ["🏆 Et le vainqueur est... *roulements de tambour*", "📉 L'autre ferait mieux de retourner en SAV."],
  ["⭐ Le public a choisi. Et le public a raison.", "🫤 Mouais. Bof. Passons."],
  ["🧠 Intelligence artificielle > intelligence naturelle.", "🤖 Même un robot aurait fait un meilleur choix."],
];

function randomVerdict(): [string, string] {
  return VERDICTS[Math.floor(Math.random() * VERDICTS.length)];
}

export default function QuickMatch() {
  const [pair, setPair] = useState<QuickProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<string>("");
  const [loserVerdict, setLoserVerdict] = useState<string>("");
  const [fading, setFading] = useState(false);

  const pickNewPair = useCallback(async () => {
    const API_BASE = "/api";
    try {
      setWinner(null);
      setFading(false);
      setLoading(true);
      const res = await fetch(`${API_BASE}/products?limit=200`);
      if (!res.ok) throw new Error("API failed");
      const all: QuickProduct[] = await res.json();

      // Filter to products with scores and images
      const valid = all.filter((p) => p.estimated_score > 0 && p.image_url);

      // Group by category_name (products in the same category)
      const grouped: Record<string, QuickProduct[]> = {};
      for (const p of valid) {
        // Normalize "" to "unknown" — some products may lack category_name
        const key = p.category_name || "unknown";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(p);
      }

      // Find categories with at least 2 products
      const viable = Object.entries(grouped).filter(([, prods]) => prods.length >= 2);
      if (viable.length === 0) throw new Error("No category with 2+ products");

      // Pick a random viable category, then 2 random products from it
      const [, catProducts] = viable[Math.floor(Math.random() * viable.length)];
      const shuffled = [...catProducts].sort(() => Math.random() - 0.5);
      setPair(shuffled.slice(0, 2));
    } catch {
      // Fallback: use fixtures — fetch by slug
      const [s1, s2] = FIXTURES[Math.floor(Math.random() * FIXTURES.length)];
      try {
        const [r1, r2] = await Promise.all([
          fetch(`${API_BASE}/products?slug=${s1}`).then((r) => r.json()),
          fetch(`${API_BASE}/products?slug=${s2}`).then((r) => r.json()),
        ]);
        const fallbackPair = [
          (Array.isArray(r1) ? r1[0] : r1),
          (Array.isArray(r2) ? r2[0] : r2),
        ].filter(Boolean);
        if (fallbackPair.length === 2) {
          setPair(fallbackPair);
        } else {
          setPair([]);
        }
      } catch {
        setPair([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    pickNewPair();
  }, [pickNewPair]);

  const handlePick = (slug: string) => {
    const v = randomVerdict();
    setWinner(slug);
    setVerdict(v[0]);
    setLoserVerdict(v[1]);
  };

  const handleNext = () => {
    setFading(true);
    setTimeout(() => pickNewPair(), 300);
  };

  if (loading) {
    return (
      <section className="mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-[#4257FF] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (pair.length < 2) return null;

  const [a, b] = pair;

  return (
    <section className="mt-16">
      <div className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}>
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--coral)" }}>
            ⚔️ QUICK MATCH
          </p>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl" style={{ color: "var(--text)" }}>
            Quel produit l&apos;emporte ?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-5" style={{ color: "var(--text-muted)" }}>
            L&apos;IA Troviio tranche. Clique sur celui que tu penses être le meilleur.
          </p>
        </div>

        {/* Duel arena */}
        <div className="relative">
          {/* VS badge */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-black tracking-tighter shadow-lg"
              style={{
                background: "linear-gradient(135deg, #FF6B5F, #FFB067)",
                color: "#fff",
                fontFamily: "'Sora', sans-serif",
              }}
            >
              VS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {/* Product A */}
            <button
              onClick={() => !winner && handlePick(a.slug)}
              disabled={!!winner}
              className={`group relative flex flex-col items-center rounded-2xl border-2 p-4 sm:p-6 transition-all duration-300 ${
                winner
                  ? winner === a.slug
                    ? "border-[#3ED6A3]/50 scale-105"
                    : "border-[#FF6B5F]/20 opacity-60 scale-95"
                  : "border-transparent hover:border-[#4257FF]/40 hover:scale-[1.02] cursor-pointer"
              }`}
              style={{
                backgroundColor: winner === a.slug ? "rgba(62, 214, 163, 0.08)" : "var(--bg-surface)",
              }}
            >
              {/* Image */}
              <div className="mb-3 flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-[#1A1D2E] sm:h-32">
                {a.image_url ? (
                  <img
                    src={a.image_url}
                    alt={a.name}
                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-4xl opacity-30">❓</span>
                )}
              </div>

              {/* Info */}
              <div className="w-full text-center">
                {a.category_name && (
                  <span className="mb-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#8B8FA3]">
                    {a.category_name}
                  </span>
                )}
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FF6B5F]">{a.brand}</p>
                <h3 className="mt-0.5 text-xs font-bold leading-snug line-clamp-2" style={{ color: "var(--text)" }}>
                  {a.name}
                </h3>
                {a.estimated_score > 0 && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <span className="text-lg font-black" style={{ color: a.estimated_score >= 80 ? "#3ED6A3" : a.estimated_score >= 60 ? "#FFB020" : "#FF6B5F", fontFamily: "'Nunito', sans-serif" }}>
                      {a.estimated_score}
                    </span>
                    <span className="text-[10px] opacity-60">/100</span>
                  </div>
                )}
              </div>

              {/* Winner / Loser badge */}
              {winner && (
                <span
                  className={`absolute -top-2 -right-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg sm:-top-3 sm:-right-3 sm:px-3 sm:py-1.5 sm:text-xs ${
                    winner === a.slug
                      ? "bg-[#3ED6A3] text-[#0E1020]"
                      : "bg-[#FF6B5F]/20 text-[#FF6B5F]"
                  }`}
                >
                  {winner === a.slug ? "🏆 GAGNANT" : "💀 BATTU"}
                </span>
              )}
            </button>

            {/* Product B */}
            <button
              onClick={() => !winner && handlePick(b.slug)}
              disabled={!!winner}
              className={`group relative flex flex-col items-center rounded-2xl border-2 p-4 sm:p-6 transition-all duration-300 ${
                winner
                  ? winner === b.slug
                    ? "border-[#3ED6A3]/50 scale-105"
                    : "border-[#FF6B5F]/20 opacity-60 scale-95"
                  : "border-transparent hover:border-[#4257FF]/40 hover:scale-[1.02] cursor-pointer"
              }`}
              style={{
                backgroundColor: winner === b.slug ? "rgba(62, 214, 163, 0.08)" : "var(--bg-surface)",
              }}
            >
              {/* Image */}
              <div className="mb-3 flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-[#1A1D2E] sm:h-32">
                {b.image_url ? (
                  <img
                    src={b.image_url}
                    alt={b.name}
                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-4xl opacity-30">❓</span>
                )}
              </div>

              {/* Info */}
              <div className="w-full text-center">
                {b.category_name && (
                  <span className="mb-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#8B8FA3]">
                    {b.category_name}
                  </span>
                )}
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FF6B5F]">{b.brand}</p>
                <h3 className="mt-0.5 text-xs font-bold leading-snug line-clamp-2" style={{ color: "var(--text)" }}>
                  {b.name}
                </h3>
                {b.estimated_score > 0 && (
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <span className="text-lg font-black" style={{ color: b.estimated_score >= 80 ? "#3ED6A3" : b.estimated_score >= 60 ? "#FFB020" : "#FF6B5F", fontFamily: "'Nunito', sans-serif" }}>
                      {b.estimated_score}
                    </span>
                    <span className="text-[10px] opacity-60">/100</span>
                  </div>
                )}
              </div>

              {/* Winner / Loser badge */}
              {winner && (
                <span
                  className={`absolute -top-2 -right-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg sm:-top-3 sm:-right-3 sm:px-3 sm:py-1.5 sm:text-xs ${
                    winner === b.slug
                      ? "bg-[#3ED6A3] text-[#0E1020]"
                      : "bg-[#FF6B5F]/20 text-[#FF6B5F]"
                  }`}
                >
                  {winner === b.slug ? "🏆 GAGNANT" : "💀 BATTU"}
                </span>
              )}
            </button>
          </div>

          {/* Verdict bar */}
          {winner && (
            <div
              className="mx-auto mt-6 max-w-xl animate-slide-up rounded-xl border p-4 text-center"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "rgba(62, 214, 163, 0.05)",
              }}
            >
              <p className="text-sm font-bold leading-relaxed" style={{ color: "var(--text)" }}>
                {winner === a.slug ? verdict : loserVerdict}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {!winner ? (
            <p className="text-[10px] italic" style={{ color: "var(--text-muted)" }}>
              Clique sur un produit pour voir le verdict Troviio 👆
            </p>
          ) : (
            <>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #4257FF, #FF6B5F)",
                }}
              >
                🎲 Match suivant
              </button>
              <Link
                href={`/duel/${a.slug}-vs-${b.slug}`}
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold transition-all hover:-translate-y-0.5"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                Duel complet →
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
