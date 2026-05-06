"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ScoreRing from "@/components/ScoreRing";

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
  "aspirateur-laveur": "🧹",
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
  "montre-connectee": "⌚",
  "voiture-electrique": "🚗",
};

export default function TopsClient() {
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const f = async () => {
    try {
      const res = await fetch("/api/products/?limit=300");
      if (res.ok) {
        const products = await res.json();
        const catMap = new Map<string, { name: string; slug: string; products: any[] }>();
        for (const p of products) {
          const cs = p.category_slug || "autre";
          const cn = p.category_name || cs;
          if (!catMap.has(cs)) catMap.set(cs, { name: cn, slug: cs, products: [] });
          catMap.get(cs)!.products.push(p);
        }
        const g: TopCategory[] = [];
        catMap.forEach((cat) => {
          const sorted = cat.products.filter((p: any) => p.estimated_score).sort((a: any, b: any) => (b.estimated_score || 0) - (a.estimated_score || 0));
          g.push({ slug: cat.slug, name: cat.name, products: sorted.slice(0, 3), count_products: cat.products.length });
        });
        g.sort((a, b) => b.count_products - a.count_products);
        setCategories(g);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { f(); }, []);
  
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
        <section className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#4257FF] border-t-transparent rounded-full animate-spin" />
        </section>
      </main>
    );
  }

  const displayed = selectedCat
    ? categories.filter((c) => c.slug === selectedCat)
    : categories;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* ── HERO ── */}
      <section
        className="border-b pt-20 pb-14 text-center"
        style={{
          borderColor: "var(--border)",
          background: "linear-gradient(180deg, rgba(255,107,43,.06) 0%, transparent 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-[Sora] mb-5"
            style={{
              color: "#ff6b2b",
              backgroundColor: "rgba(255,107,43,.1)",
              border: "1px solid rgba(255,107,43,.2)",
            }}
          >
            🏆 CLASSEMENT 2026
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight max-w-3xl mx-auto"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.05em" }}
          >
            Le Top 3 Troviio
          </h1>
          <p
            className="text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Les meilleurs produits dans chaque catégorie, classés par leur score Troviio.
            Pas de sponsor, que des tests IA.
          </p>

          {/* Badges meta */}
          <div className="flex items-center justify-center gap-5 mt-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3ED6A3", boxShadow: "0 0 8px #3ED6A3" }} />
              <span>Mis à jour régulièrement</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <span>🤖</span>
              <span>Analysé par IA Troviio</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <span>📊</span>
              <span>Plus de 300 produits</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTRES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap justify-center">
          <button
            onClick={() => setSelectedCat(null)}
            className="cat-chip"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 16px",
              borderRadius: "12px",
              border: !selectedCat ? "1px solid #ff6b2b" : "1px solid var(--border)",
              color: !selectedCat ? "#ffd2c0" : "var(--text-muted)",
              fontSize: "14px",
              fontWeight: 600,
              background: !selectedCat ? "rgba(255,107,43,.12)" : "transparent",
              cursor: "pointer",
              transition: "all .2s ease",
              whiteSpace: "nowrap",
            }}
          >
            🌐 Tout voir
          </button>
          {categories.map((cat) => {
            const isActive = selectedCat === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCat(cat.slug)}
                className="cat-chip"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 16px",
                  borderRadius: "12px",
                  border: isActive ? "1px solid #ff6b2b" : "1px solid var(--border)",
                  color: isActive ? "#ffd2c0" : "var(--text-muted)",
                  fontSize: "14px",
                  fontWeight: 600,
                  background: isActive ? "rgba(255,107,43,.12)" : "transparent",
                  cursor: "pointer",
                  transition: "all .2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {CATEGORY_EMOJI[cat.slug] || "🏷️"} {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── CONTENU ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {displayed.length === 0 && (
          <p className="text-center py-20" style={{ color: "var(--text-muted)" }}>
            Aucune catégorie disponible pour le moment.
          </p>
        )}

        {displayed.map((cat) => (
          <section key={cat.slug} className="scroll-mt-28" id={cat.slug}>
            {/* Titre catégorie */}
            <div className="flex items-center gap-3 mb-8">
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ fontFamily: "'Sora', sans-serif", color: "var(--text)" }}
              >
                {CATEGORY_EMOJI[cat.slug] || "🏷️"} {cat.name}
              </h2>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                Top 3
              </span>
            </div>

            {/* Grille podium */}
            <div className="grid gap-6 md:grid-cols-3">
              {cat.products.map((product, idx) => (
                <PodiumCard key={product.slug} product={product} rank={idx + 1} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ── CTA ── */}
      <section
        className="border-t py-16 text-center mt-8"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Sora', sans-serif", color: "var(--text)" }}>
            Tu ne trouves pas ton produit ?
          </h2>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>
            Pose la question à notre IA, elle te trouvera le meilleur rapport qualité-prix.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition"
            style={{
              background: "linear-gradient(135deg, #ff6b2b, #FF6B5F)",
              boxShadow: "0 4px 20px rgba(255,107,43,.3)",
            }}
          >
            💬 Demander à Troviio
          </Link>
        </div>
      </section>
    </main>
  );
}

// ── Podium Card v2.0 ────────────────────────────────

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_COLORS = ["#FFB020", "#b0b8c8", "#cd7f32"];
const RANK_BG_COLORS = [
  "rgba(255,176,32,.3)",
  "rgba(255,255,255,.12)",
  "rgba(205,127,50,.25)",
];

function PodiumCard({ product, rank }: { product: TopProduct; rank: number }) {
  const medal = MEDALS[rank - 1] || `#${rank}`;
  const score = product.estimated_score ?? 0;
  const scoreColor = score >= 80 ? "#3ED6A3" : score >= 60 ? "#FFB020" : "#FF6B5F";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1"
      style={{
        backgroundColor: "#181B2E",
        border: `1px solid ${RANK_BG_COLORS[rank - 1] || "var(--border)"}`,
        boxShadow: rank === 1 ? "0 8px 32px rgba(255,176,32,.15)" : "none",
      }}
    >
      {/* Bandeau rang */}
      <div
        className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-sm"
        style={{
          backgroundColor: "rgba(0,0,0,.5)",
          color: RANK_COLORS[rank - 1] || "var(--text-muted)",
        }}
      >
        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"} N°{rank}
      </div>

      {/* Image */}
      <Link href={`/produit/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-6 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">{medal}</div>
        )}

        {/* Score badge */}
        {product.estimated_score != null && (
          <div className="absolute bottom-3 right-3">
            <ScoreRing score={product.estimated_score} size={48} />
          </div>
        )}
      </Link>

      {/* Infos */}
      <div className="flex flex-1 flex-col p-5">
        {product.brand && (
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 text-lg font-bold leading-tight" style={{ fontFamily: "'Sora', sans-serif", color: "var(--text)" }}>
          <Link href={`/produit/${product.slug}`} className="hover:text-[#3ED6A3] transition-colors">
            {product.name}
          </Link>
        </h3>

        {/* Why perfect / description */}
        {product.why_perfect && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {product.why_perfect}
          </p>
        )}

        {/* Pros/Cons */}
        <div className="mt-3 space-y-1.5 text-sm flex-1">
          {product.pros.slice(0, 2).map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="shrink-0 text-[#3ED6A3]">✓</span>
              <span style={{ color: "var(--text-muted)" }}>{p}</span>
            </div>
          ))}
          {product.cons.slice(0, 1).map((c, i) => (
            <div key={`c${i}`} className="flex items-start gap-2">
              <span className="shrink-0 text-[#FF6B5F]">✗</span>
              <span style={{ color: "var(--text-muted)" }}>{c}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={product.affiliate_url || `/produit/${product.slug}`}
          target={product.affiliate_url ? "_blank" : undefined}
          rel={product.affiliate_url ? "nofollow sponsored noopener noreferrer" : undefined}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all active:scale-95 hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #ff6b2b, #FF6B5F)",
            boxShadow: "0 4px 16px rgba(255,107,43,.25)",
          }}
        >
          Voir l'offre →
        </a>
      </div>
    </article>
  );
}
