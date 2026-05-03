"use client";

import { useState } from "react";
import Link from "next/link";
import ScoreRing from "@/components/ScoreRing";

const EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

interface TopProduct {
  slug: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  estimated_score: number | null;
  price_eur: number | null;
  best_merchant: string | null;
  affiliate_url: string | null;
  pros: string[];
  cons: string[];
  why_perfect: string | null;
  rank_label: string | null;
}

interface TopCategory {
  slug: string;
  name: string;
  products: TopProduct[];
  count_products: number;
}

const CATEGORY_EMOJI: Record<string, string> = {
  smartphone: "📱",
  "machine-a-cafe": "☕",
  "aspirateur-balai": "🧹",
  "friteuse-air": "🍟",
  "casque-audio": "🎧",
  "aspirateur-robot": "🤖",
  "barre-de-son": "🔊",
  refrigerateur: "🧊",
  "lave-linge": "🌀",
  "lave-vaisselle": "🍽️",
  "four-micro-ondes": "🔥",
  poussette: "👶",
  "ordinateur-portable": "💻",
  tv: "📺",
  "enceinte-bt": "🔈",
  "cave-a-vin": "🍷",
  purificateur: "💨",
  "robot-cuisine": "🍳",
  trottinette: "🛴",
  "velo-electrique": "🚲",
  matelas: "🛏️",
  imprimante: "🖨️",
  "camera-securite": "📷",
  "thermostat-connecte": "🌡️",
};

export default function TopsClient({ categories }: { categories: TopCategory[] }) {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const displayed = selectedCat
    ? categories.filter((c) => c.slug === selectedCat)
    : categories;

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-gradient-to-b from-[#151B4F]/60 to-[var(--bg)] pt-28">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: "var(--text)" }}>
            🏆 Le Top 3 Troviio
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Les meilleurs produits dans chaque catégorie, sélectionnés et notés par notre IA.
            <br />
            Pas de sponsor, que des tests.
          </p>

          {/* Filtres rapides */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCat(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition border ${
                !selectedCat
                  ? "border-[var(--coral)] text-[var(--coral)]"
                  : "border-[var(--border)] text-[var(--text-muted)]"
              }`}
            >
              Tout voir
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCat(cat.slug)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition border ${
                  selectedCat === cat.slug
                    ? "border-[var(--coral)] text-[var(--coral)]"
                    : "border-[var(--border)] text-[var(--text-muted)]"
                }`}
              >
                {CATEGORY_EMOJI[cat.slug] || "🏷️"} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 space-y-12 sm:px-6 lg:px-8">
        {displayed.length === 0 && (
          <p className="text-center py-20" style={{ color: "var(--text-muted)" }}>
            Aucune catégorie disponible pour le moment.
          </p>
        )}

        {displayed.map((cat) => (
          <section key={cat.slug} className="scroll-mt-28" id={cat.slug}>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text)" }}>
                {CATEGORY_EMOJI[cat.slug] || "🏷️"} {cat.name}
              </h2>
              <span
                className="rounded-full px-3 py-1 text-xs ring-1"
                style={{
                  color: "var(--text-muted)",
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                }}
              >
                Top {cat.count_products}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {cat.products.map((product, idx) => (
                <PodiumCard key={product.slug} product={product} rank={idx + 1} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer CTA */}
      <section className="border-t border-[var(--border)] py-16 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
            Tu ne trouves pas ton produit ?
          </h2>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>
            Pose la question à notre IA, elle te trouvera le meilleur rapport qualité-prix.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition"
            style={{ background: "var(--grad-coral)" }}
          >
            💬 Demander à Troviio
          </Link>
        </div>
      </section>
    </main>
  );
}

// ── Podium Card ───────────────────────────────────────

function PodiumCard({ product, rank }: { product: TopProduct; rank: number }) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
      {/* Rang */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
        <span className="text-xl">{medal}</span>
        <span className="text-xs font-bold text-white/80">N°{rank}</span>
      </div>

      {/* Image */}
      <Link href={`/produit/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--bg)]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-6 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">{medal}</div>
        )}

        {product.estimated_score != null && (
          <div className="absolute bottom-3 right-3">
            <ScoreRing score={product.estimated_score} size={48} />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {product.brand && (
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 text-lg font-bold leading-tight" style={{ color: "var(--text)" }}>
          <Link href={`/produit/${product.slug}`} className="hover:text-[var(--mint)] transition">
            {product.name}
          </Link>
        </h3>

        {product.price_eur != null && (
          <div className="mt-3 rounded-2xl px-4 py-2 ring-1" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Meilleur prix </span>
            <span className="text-xl font-bold ml-1" style={{ color: "var(--text)" }}>
              {EUR.format(product.price_eur)}
            </span>
            {product.best_merchant && (
              <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>via {product.best_merchant}</span>
            )}
          </div>
        )}

        <div className="mt-4 space-y-2 text-sm leading-relaxed flex-1">
          {product.pros.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: "var(--mint)" }}>✅ Points forts</p>
              <ul className="space-y-1">
                {product.pros.slice(0, 2).map((p, i) => (
                  <li key={i} className="flex gap-2" style={{ color: "var(--text-muted)" }}>
                    <span className="shrink-0" style={{ color: "var(--mint)" }}>+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.cons.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-1 mt-2" style={{ color: "var(--coral)" }}>⚠️ Points faibles</p>
              <ul className="space-y-1">
                {product.cons.slice(0, 1).map((c, i) => (
                  <li key={i} className="flex gap-2" style={{ color: "var(--text-muted)" }}>
                    <span className="shrink-0" style={{ color: "var(--coral)" }}>−</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {product.affiliate_url ? (
          <a
            href={product.affiliate_url}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white transition active:scale-95"
            style={{ background: "var(--grad-coral)" }}
          >
            Voir l&apos;offre →
          </a>
        ) : (
          <Link
            href={`/produit/${product.slug}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Voir la fiche →
          </Link>
        )}
      </div>
    </article>
  );
}
