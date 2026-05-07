"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ScoreRing } from "@/components/ScoreRing";

interface TestProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image_url: string;
  estimated_score: number;
  category_id?: string;
  category_slug?: string;
  category_name?: string;
  test_summary?: string;
}

// Fun one-liners for each product (non-top-5 picks)
const TAGLINES: Record<string, string> = {
  "asus-rog-zephyrus-g14-2025": "Fait tourner Cryos en silence. Et ton portefeuille aussi.",
  "razer-blade-16-2025": "Le MacBook du gaming. Cher, mais ta mère sera fière.",
  "asus-rog-zephyrus-g16-2025": "Gaming, montage, crypto — et accessoirement, il fait les cafés.",
  "hp-omen-max-16-2025": "Les jeux tournent si bien que tu oublies de manger.",
  "lenovo-legion-pro-7i-gen-10": "Le PC qui fait tourner Crysis. Oui, encore celui-là.",
  "thermomix-tm7": "Le chef, le psy, le comptable — tout en un.",
  "ninja-foodi-flexdrawer-af500eu": "Friteuse, four, gril — le couteau suisse du chip.",
  "dyson-gen5-detect-absolute": "Aspire tellement fort que ta moquette flippe.",
  "apple-macbook-air-13-m4": "Tellement rapide qu'il arrive au café avant toi.",
  "lg-g6-oled-65-oled65g6-2026": "Les noirs si profonds que tu ranges l'ampli.",
  "sonos-arc-ultra": "Le son qui te fait regretter tous tes ex-haut-parleurs.",
  "samsung-s95h-65-qd-oled-tq65s95hf-2026": "Plus vif que tes souvenirs de vacances. Promis.",
  "dreame-x50-ultra-complete": "Nettoie mieux que ta mère. Chut, on dit rien.",
  "bugaboo-fox-5-renew": "La Rolls des poussettes. Le bébé est au chaud.",
  "sony-wh-1000xm6": "Tellement silencieux que tu vas rater le métro.",
  "artevino-oxygen-oxg1t230npd": "Meilleur café que ta machine au bureau. Et en souriant.",
  "manette-nintendo-switch2-procontroller": "Tes pouces remercient. Tes adversaires, pas.",
  "lg-g5-oled-65-oled65g56ls-2025": "Tes voisins vont squatter ton salon tous les soirs.",
  "eufy-solocam-s340": "Mate ton facteur façon James Bond.",
  "ventilateur-rowenta-vu5890f0": "Brise de plage sans les miettes de sable.",
  "samsung-galaxy-s26-ultra": "Le zoom voit ce que ton voisin mange ce soir.",
  "iphone-17-pro-max": "Cher. Très cher. Mais t'as l'air riche.",
  "dyson-supersonic-nural": "Sèche tes cheveux plus vite que tes ex. Enfin presque.",
  "dyson-airwrap-i-d": "Tes cheveux plus stylés que ta vie sociale.",
  "roomba-combo-j9plus": "Meilleur GPS que toi dans ta rue. Triste mais vrai.",
  "manette-flydigi-vader4pro": "Tes potes vont te traiter de tricheur. Et t'auras raison.",
  "samsung-qn900f-65-8k-2026": "8K pour voir les cernes des acteurs. Flippant.",
  "jeu-coop-ittakestwo-ps5": "Le seul jeu qui sauve des couples. Et des canap's.",
  "jeu-coop-splitfiction-ps5": "Coop'rative épique — vos doigts vont causer.",
  "tablette-apple-ipadpro-m5-11-b0fwd6": "Plus fine que tes excuses pour pas faire de sport.",
  "garmin-fenix-8": "Survit à ta batterie de téléphone. Et à ta volonté.",
  "mova-p50-pro-ultra": "Nettoie pendant que tu scrolles. Bientôt il vote.",
  "lg-c6-oled-65-oled65c6-2026": "Le cinéma à la maison. Popcorn inclus.",
};

const EMOJIS = ["🤯", "🔥", "💀", "👽", "🤖", "⚡", "🎯", "🚀", "💪", "🧠", "🦾", "🎭", "✨", "🛸", "📡"];

function randomEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

export default function RecentTests() {
  const [products, setProducts] = useState<TestProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const API_BASE = "/api";
        // Fetch last 50 scored products with test summaries, sorted by name as proxy for "recently added"
        const res = await fetch(`${API_BASE}/products?limit=50&sort=estimated_score&order=desc.nullslast&is_active=eq.true`);
        if (!res.ok) return;
        const all: TestProduct[] = await res.json();
        
        // Only keep those with a test_summary (has been "tested" by Troviio)
        const tested = all.filter(p => p.test_summary && p.estimated_score > 0);
        
        // Group by category, pick the best from each
        const seenCategories = new Set<string>();
        const diversified: TestProduct[] = [];
        for (const p of tested) {
          const catKey = p.category_slug || p.category_id || "unknown";
          if (!seenCategories.has(catKey)) {
            seenCategories.add(catKey);
            diversified.push(p);
          }
          if (diversified.length >= 5) break;
        }
        setProducts(diversified);
      } catch (e) {
        console.error("Erreur RecentTests", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-2 border-[#4257FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--coral)" }}>
            🧪 LES DERNIERS TESTS
          </p>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl" style={{ color: "var(--text)" }}>
            Les produits qu&apos;on a passés au crible
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-5" style={{ color: "var(--text-muted)" }}>
            Chaque produit a sa note Troviio et son mot rigolo. Clique pour découvrir le verdict.
          </p>
        </div>

        {/* Grid of 5 products — one per category */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {products.map((p) => {
            const score = p.estimated_score ?? 75;
            const emoji = randomEmoji();
            const tagline = TAGLINES[p.slug] || "On l'a testé pour toi. Non, vraiment.";

            return (
              <Link
                key={p.id}
                href={`/produit/${p.slug}`}
                className="group relative flex flex-col rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B5F]/30"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              >
                {/* Emoji badge */}
                <span className="absolute -top-2 -right-2 text-xl drop-shadow-lg z-10">{emoji}</span>

                {/* Mini image */}
                <div className="mb-3 flex h-20 items-center justify-center overflow-hidden rounded-lg bg-[#1A1D2E]">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <span className="text-3xl opacity-30">{emoji}</span>
                  )}
                </div>

                {/* Category tag */}
                {p.category_name && (
                  <span className="mb-1 self-start rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#8B8FA3]">
                    {p.category_name}
                  </span>
                )}

                {/* Brand + Name */}
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FF6B5F]">{p.brand}</p>
                <h3 className="mt-0.5 text-xs font-bold leading-snug line-clamp-2 transition-colors group-hover:text-[#FF6B5F]" style={{ color: "var(--text)" }}>
                  {p.name}
                </h3>

                {/* Tagline */}
                <p className="mt-1.5 text-[10px] italic leading-tight line-clamp-2" style={{ color: "var(--text-muted)" }}>
                  &ldquo;{tagline}&rdquo;
                </p>

                {/* Score row */}
                <div className="mt-auto flex items-center gap-2 pt-3">
                  <ScoreRing score={score} size="sm" />
                  <span className="text-xs font-bold text-[#FF6B5F]">{score}/100</span>
                  <span className="ml-auto text-[10px] transition-transform group-hover:translate-x-1" style={{ color: "var(--text-muted)" }}>
                    Voir →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
