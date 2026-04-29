"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

export default function TopsPage() {
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tops")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0E1020] pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-[#1A1D2E] p-8">
                <div className="h-8 w-48 rounded bg-white/10 mb-6" />
                <div className="grid gap-6 md:grid-cols-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-72 rounded-2xl bg-white/5" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0E1020] pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-6xl mb-4">🏆</p>
          <h1 className="text-2xl font-bold text-white mb-2">Oups, le podium est en retard</h1>
          <p className="text-[#8B8FA3]">Recharge dans quelques instants.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0E1020]">
      {/* Hero */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#151B4F]/60 to-[#0E1020] pt-28">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            🏆 Le Top 3 Troviio
          </h1>
          <p className="text-lg text-[#C9CCDA] max-w-2xl mx-auto">
            Les meilleurs produits dans chaque catégorie, sélectionnés et notés par notre IA.
            <br />Pas de sponsor, que des tests.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 space-y-12 sm:px-6 lg:px-8">
        {categories.length === 0 && (
          <p className="text-center text-[#8B8FA3] py-20">
            Aucune catégorie disponible pour le moment.
          </p>
        )}

        {categories.map((cat) => (
          <section key={cat.slug} className="scroll-mt-28" id={cat.slug}>
            {/* Titre catégorie */}
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {cat.name}
              </h2>
              <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-[#8B8FA3] ring-1 ring-white/10">
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
      <section className="border-t border-white/10 py-16 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Tu ne trouves pas ton produit ?
          </h2>
          <p className="text-[#C9CCDA] mb-6">
            Pose la question à notre IA, elle te trouvera le meilleur rapport qualité-prix.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4257FF] to-[#3ED6A3] px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition"
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
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1A1D2E] shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
      {/* Rang */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
        <span className="text-xl">{medal}</span>
        <span className="text-xs font-bold text-white/80">N°{rank}</span>
      </div>

      {/* Image */}
      <Link href={`/produit/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#0E1020]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-6 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">{medal}</div>
        )}

        {/* Score overlay */}
        {product.estimated_score != null && (
          <div className="absolute bottom-3 right-3">
            <ScoreRing score={product.estimated_score} size={48} />
          </div>
        )}
      </Link>

      {/* Infos */}
      <div className="flex flex-1 flex-col p-5">
        {product.brand && (
          <p className="text-xs font-bold uppercase tracking-wider text-[#8B8FA3]">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 text-lg font-bold text-white leading-tight">
          <Link href={`/produit/${product.slug}`} className="hover:text-[#3ED6A3] transition">
            {product.name}
          </Link>
        </h3>

        {/* Prix */}
        {product.price_eur != null && (
          <div className="mt-3 rounded-2xl bg-white/5 px-4 py-2 ring-1 ring-white/10">
            <span className="text-xs text-[#8B8FA3]">Meilleur prix </span>
            <span className="text-xl font-bold text-white ml-1">
              {EUR.format(product.price_eur)}
            </span>
            {product.best_merchant && (
              <span className="text-xs text-[#8B8FA3] ml-2">via {product.best_merchant}</span>
            )}
          </div>
        )}

        {/* Pros / Cons */}
        <div className="mt-4 space-y-2 text-sm leading-relaxed flex-1">
          {product.pros.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#3ED6A3] mb-1">✅ Points forts</p>
              <ul className="space-y-1">
                {product.pros.slice(0, 2).map((p, i) => (
                  <li key={i} className="text-[#C9CCDA] flex gap-2">
                    <span className="text-[#3ED6A3] shrink-0">+</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.cons.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#FF6B5F] mb-1 mt-2">⚠️ Points faibles</p>
              <ul className="space-y-1">
                {product.cons.slice(0, 1).map((c, i) => (
                  <li key={i} className="text-[#C9CCDA] flex gap-2">
                    <span className="text-[#FF6B5F] shrink-0">−</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CTA */}
        {product.affiliate_url ? (
          <a
            href={product.affiliate_url}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4257FF] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5870FF] active:scale-95"
          >
            Voir l&apos;offre →
          </a>
        ) : (
          <Link
            href={`/produit/${product.slug}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Voir la fiche →
          </Link>
        )}
      </div>
    </article>
  );
}
