"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ScoreRing } from "@/components/ScoreRing";

interface TopProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image_url: string;
  estimated_score: number;
  category_slug?: string;
  category_name?: string;
}

// Funny Troviio-style taglines mapped by product slug
const TAGLINES: Record<string, string> = {
  "asus-rog-zephyrus-g14-2025": "Le GPU qui fait de l'ombre à ton micro-ondes. Et à tes nuits.",
  "razer-blade-16-2025": "Tellement beau que tu vas le sortir en rendez-vous. Vraiment.",
  "asus-rog-zephyrus-g16-2025": "Gaming, montage, crypto — et accessoirement, il fait les cafés.",
  "hp-omen-max-16-2025": "Les jeux tournent si bien que tu oublies de manger. Prévois des snacks.",
  "lenovo-legion-pro-7i-gen-10": "Le PC qui fait tourner Crysis. Oui, encore celui-là.",
  "jeu-coop-ittakestwo-ps5": "Le seul jeu qui sauve des couples. Et des canap'.",
  "jeu-coop-splitfiction-ps5": "Coop'rative épique — vos doigts vont se parler.",
  "dyson-gen5-detect-absolute": "Aspire tellement fort que ta moquette se souvient de 1998.",
  "tablette-apple-ipadpro-m5-11-b0fwd6": "Tellement fine qu'elle passe sous une porte sans la toucher.",
  "thermomix-tm7": "Chef cuisto, nutritionniste et psy culinaire tout en un.",
  "dreame-x50-ultra-complete": "Nettoie mieux que ta mère. Ne lui dis pas.",
  "lg-g6-oled-65-oled65g6-2026": "Les noirs sont si profonds que tu vas ranger ton ampli.",
  "apple-macbook-air-13-m4": "Tellement rapide qu'il arrive avant toi au café.",
  "sonos-arc-ultra": "Le son qui fait regretter tous tes haut-parleurs d'avant.",
  "samsung-s95h-65-qd-oled-tq65s95hf-2026": "Les couleurs sont plus vives que tes souvenirs de vacances.",
  "bugaboo-fox-5-renew": "La Rolls de la poussette. Ton bébé mérite le meilleur.",
  "artevino-oxygen-oxg1t230npd": "Fait du café meilleur que ta machine à bureau. Et avec le sourire.",
  "sony-wh-1000xm6": "Tellement silencieux que tu vas rater ta correspondance.",
  "manette-nintendo-switch2-procontroller": "Tes pouces te remercieront. Tes adversaires pas du tout.",
  "ninja-foodi-flexdrawer-af500eu": "Friteuse, four, gril — le couteau suisse de ta cuisine.",
  "lg-g5-oled-65-oled65g56ls-2025": "Tellement beau que tes voisins vont s'inviter tous les soirs.",
  "eufy-solocam-s340": "Regarde ton facteur comme si t'étais James Bond.",
  "ventilateur-rowenta-vu5890f0": "Brise tellement silencieuse que tu crois être à la plage.",
  "lg-c6-oled-65-oled65c6-2026": "Le cinéma à la maison sans les miettes sur le fauteuil.",
  "samsung-galaxy-s26-ultra": "Le zoom va voir ce que ton voisin mange ce soir.",
  "iphone-17-pro-max": "Tellement cher que tu le montres à ta mère pour la fierté.",
  "dyson-supersonic-nural": "Sèche tes cheveux plus vite que tes mauvaises idées.",
  "samsung-qn900f-65-8k-2026": "8K pour voir les cernes des acteurs. Effrayant de précision.",
  "dyson-airwrap-i-d": "Tes cheveux vont être plus stylés que ta vie sociale.",
  "roomba-combo-j9plus": "Navigue dans ton salon mieux que toi dans Google Maps.",
  "manette-flydigi-vader4pro": "Tes adversaires vont croire que tu triches. Et t'auras raison.",
};

function getTagline(slug: string): string | null {
  return TAGLINES[slug] || null;
}

export default function Top3Home() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const API_BASE = "/api";

        const topRes = await fetch(`${API_BASE}/products?limit=20&sort=estimated_score&order=desc.nullslast&is_active=eq.true&amazon_asin=not.is.null`);
        let topData: TopProduct[] = [];
        if (topRes.ok) {
          const all = await topRes.json() || [];

          // Sélectionne les meilleurs produits avec UN par catégorie maximum
          // pour garantir un Top 5 diversifié
          const seenCategories = new Set<string>();
          const diversified: TopProduct[] = [];

          for (const p of all) {
            const catKey = p.category_id || p.category_slug || "unknown";
            if (!seenCategories.has(catKey) && p.estimated_score > 0) {
              seenCategories.add(catKey);
              diversified.push(p);
            }
            if (diversified.length >= 5) break;
          }

          topData = diversified.length >= 3 ? diversified : all.slice(0, 5);
          setProducts(topData);
        }
      } catch (e) {
        console.error("Erreur Top3Home", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const medals = ["🥇", "🥈", "🥉"];
  const chocolateMedal = "🍫";

  if (loading) {
    return (
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28" style={{ backgroundColor: "var(--bg)" }}>
        <div className="mx-auto max-w-6xl text-center">
          <div className="w-8 h-8 border-2 border-[#4257FF] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--coral)" }}>
            🏆 LE TOP 5 TROVIIO
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl" style={{ color: "var(--text)" }}>
            Les 5 meilleurs produits du moment
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6" style={{ color: "var(--text-muted)" }}>
            Classés par leur score Troviio — le vrai match entre tes besoins et ce que le produit propose.
          </p>
        </div>

        {/* Podium — Top 3 */}
        {products.length > 0 && (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
            {products.slice(0, 3).map((p, i) => {
              const score = p.estimated_score ?? 85;
              const hasImage = !!p.image_url;

              return (
                <Link
                  key={p.id}
                  href={`/produit/${p.slug}`}
                  className="group relative flex flex-col rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 sm:p-7"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
                >
                  <div className="absolute -top-3 -left-3 text-4xl drop-shadow-lg">{medals[i]}</div>

                  <div className="mb-4 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-[#1A1D2E]">
                    {hasImage ? (
                      <img src={p.image_url} alt={p.name} className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="text-5xl opacity-30">{medals[i]}</span>
                    )}
                  </div>

                  {p.category_name && (
                    <span className="mb-2 inline-block self-start rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#8B8FA3]">
                      {p.category_name}
                    </span>
                  )}

                  <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B5F]">{p.brand}</p>
                  <h3 className="mt-1 text-base font-bold leading-snug transition-colors group-hover:text-[#FF6B5F] line-clamp-2" style={{ color: "var(--text)" }}>
                    {p.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2">
                    <ScoreRing score={score} size="sm" />
                    <span className="text-sm font-bold text-[#FF6B5F]">{score}/100</span>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <span
                      className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg, #4257FF, #8A7CFF)" }}
                    >
                      Voir la fiche →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Compact rows for positions 4 & 5 */}
        {products.length > 3 && (
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              {products.slice(3, 5).map((p, idx) => {
                const rank = idx + 4; // 4th or 5th
                const score = p.estimated_score ?? 70;
                const tagline = getTagline(p.slug);

                return (
                  <Link
                    key={p.id}
                    href={`/produit/${p.slug}`}
                    className="group flex items-center gap-3 px-5 py-4 transition-all hover:bg-white/5"
                    style={{ borderBottom: idx === 0 ? "1px solid var(--border)" : "none" }}
                  >
                    {/* Rank badge */}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: "rgba(255,107,95,0.15)", color: "#FF6B5F" }}>
                      {rank}
                    </span>

                    {/* Chocolate medal */}
                    <span className="text-xl shrink-0" title={`Médaille en chocolat pour la ${rank}e place`}>{chocolateMedal}</span>

                    {/* Name + brand */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold transition-colors group-hover:text-[#FF6B5F]" style={{ color: "var(--text)" }}>
                        {p.brand} — {p.name}
                      </p>
                      {tagline && (
                        <p className="mt-0.5 truncate text-xs italic" style={{ color: "var(--text-muted)" }}>
                          {tagline}
                        </p>
                      )}
                    </div>

                    {/* Score */}
                    <div className="flex shrink-0 items-center gap-2">
                      <ScoreRing score={score} size="sm" />
                      <span className="text-sm font-bold text-[#FF6B5F]">{score}/100</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Voir tout le catalogue 📋
          </Link>
        </div>

        {/* ── DUELS SECTION ── */}
        <section className="mt-20">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text)" }}>
              ⚔️ Les derniers duels
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm" style={{ color: "var(--text-muted)" }}>
              Deux produits, un vainqueur. On tranche, toi tu choisis.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {[
              { slug: "samsung-galaxy-s26-ultra-vs-iphone-17-pro-max", title: "Samsung S26 Ultra vs iPhone 17 Pro Max", desc: "Pilule bleue ou rouge ? Neo n'aurait pas hésité." },
              { slug: "thermomix-tm7-vs-kitchenaid-artisan", title: "Thermomix TM7 vs KitchenAid Artisan", desc: "Le chef numérique contre le classique. Ratatouille vs grand-mère." },
              { slug: "hypnia-bien-etre-supreme-vs-emma-original", title: "Hypnia vs Emma Original", desc: "Le duel des matelas qui va enfin faire dormir ton dos." },
              { slug: "giant-explore-eplus1-vs-riese-muller-charger4", title: "Giant E+ 1 vs Riese & Muller Charger4", desc: "Vélo électrique : l'aventure ou le confort ?" },
              { slug: "bugaboo-fox5-vs-uppababy-vista-v3", title: "Bugaboo Fox 5 vs Uppababy Vista V3", desc: "Fast & Furious version parents. La famille avant tout." },
            ].map((duel) => (
              <Link
                key={duel.slug}
                href={`/duel/${duel.slug}`}
                className="group flex items-center gap-4 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:border-[#FF6B5F]/30"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              >
                <span className="text-xl shrink-0">⚔️</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white group-hover:text-[#FF6B5F] transition-colors truncate">
                    {duel.title}
                  </p>
                  <p className="text-xs text-[#8B8FA3] mt-0.5">
                    {duel.desc}
                  </p>
                </div>
                <span className="text-sm text-[#FF6B5F] shrink-0 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/duels"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              Voir tous les duels ⚔️
            </Link>
          </div>
        </section>

      </div>
    </section>
  );
}
