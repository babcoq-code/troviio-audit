"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ScoreRing } from "@/components/ScoreRing";
import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/types";

// ─── Supabase client (côté client) ─────────────────────────
const SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co";
const SUPABASE_KEY = "sb_publishable_MtlnW7iC23FprNIUrISnZg_6IN8erpB";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Catégories connues avec emoji ─────────────────────────
const KNOWN_CATEGORY_EMOJI: Record<string, string> = {
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
  "enceinte-bt": "🔊",
  "cave-a-vin": "🍷",
  "purificateur-air": "💨",
  "robot-cuisine": "🍳",
  trottinette: "🛴",
  "velo-electrique": "🚲",
  matelas: "🛏️",
  imprimante: "🖨️",
  "camera-securite": "📷",
  "thermostat-connecte": "🌡️",
  "accessoire-velo": "🔧",
  "laptop-gamer": "🎮",
  "laptop-etudiant": "📚",
  "climatiseur-portable": "❄️",
  "ventilateur-colonne": "🌀",
  "station-charge-usb-c": "🔌",
  "onduleur-ups": "⚡",
};

const DEFAULT_EMOJI = "🏷️";

// ─── Type catégorie pour le filtre ─────────────────────────
interface CategoryFilter {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  count: number;
}

// ─── Fonction lien affilié ────────────────────────────────
function getAffiliateUrl(product: Product): string {
  const ml = (product as any).merchant_links;
  if (Array.isArray(ml) && ml.length > 0) {
    const first = ml[0];
    const url = first?.affiliate_url || first?.url;
    if (url) {
      if (url.includes("amazon") && !url.includes("tag=")) {
        const sep = url.includes("?") ? "&" : "?";
        return `${url}${sep}tag=troviio-21`;
      }
      return url;
    }
  }
  const asin = (product as any).amazon_asin;
  if (asin) return `https://www.amazon.fr/dp/${asin}?tag=troviio-21`;
  const affiliateUrl = (product as any).affiliate_url;
  if (affiliateUrl) return affiliateUrl;
  return `/produit/${product.slug}`;
}

function hasAmazonLink(product: Product): boolean {
  const url = getAffiliateUrl(product);
  return url.includes("amazon") || url.includes("amzn");
}

// ─── Page Catalogue ────────────────────────────────────────
export default function CataloguePage() {
  const [allProducts, setAllProducts] = useState<(Product & { category_slug?: string; category_name?: string })[]>([]);
  const [categories, setCategories] = useState<CategoryFilter[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";
        const res = await fetch(`${API_BASE}/products/?limit=300`, { cache: "no-store" });
        const products: any[] = res.ok ? await res.json() : [];

        console.log("FETCHED", products.length, "products");
        const { data: catData, error: catErr } = await sb
          .from("categories")
          .select("id, name, slug");
        if (catErr) console.error("SUPABASE_CAT_ERR", catErr);
        console.log("CATEGORIES", catData?.length, "loaded");

        const counts: Record<string, number> = {};
        const catById: Record<string, CategoryFilter> = {};
        for (const c of catData || []) {
          catById[c.id] = { id: c.id, name: c.name, slug: c.slug, emoji: KNOWN_CATEGORY_EMOJI[c.slug] || DEFAULT_EMOJI, count: 0 };
        }
        for (const p of products) {
          const cid = p.category_id as string;
          counts[cid] = (counts[cid] || 0) + 1;
          if (catById[cid]) {
            p.category_slug = catById[cid].slug;
            p.category_name = catById[cid].name;
          }
        }

        const loaded: CategoryFilter[] = Object.values(catById)
          .map((c) => ({ ...c, count: counts[c.id] || 0 }))
          .filter((c) => c.count > 0)
          .sort((a, b) => b.count - a.count);

        setCategories(loaded);
        setAllProducts(products);
      } catch (e) {
        console.error("Erreur chargement catalogue", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Produits filtrés par catégorie
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return allProducts;
    return allProducts.filter(
      (p) => (p as any).category_slug === activeCategory
    );
  }, [allProducts, activeCategory]);

  // Tri par score descendant
  const sorted = useMemo(
    () => [...filteredProducts].sort((a, b) => (b.estimated_score ?? 0) - (a.estimated_score ?? 0)),
    [filteredProducts]
  );

  const activeCatName =
    activeCategory === "all"
      ? "Catalogue"
      : categories.find((c) => c.slug === activeCategory)?.name || activeCategory;

  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pb-8 pt-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4257FF]/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FF6B5F]/5 blur-[100px] rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight font-display">
              📋 Le catalogue Troviio
            </h1>
            <p className="text-base text-[#8B8FA3] mt-3 max-w-xl mx-auto">
              Tous nos produits analysés, notés et comparés. Filtre par catégorie pour trouver le meilleur.
            </p>
          </div>
        </div>
      </section>

      {/* ── Filtres catégories ── */}
      <section className="max-w-7xl mx-auto px-4 pb-6">
        <div className="flex justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          <div className="flex gap-2 rounded-full border border-white/10 bg-[#1A1D2E]/80 p-1.5 shadow-2xl shadow-black/20 backdrop-blur flex-wrap justify-center">
            {/* Tout */}
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#3ED6A3] ${
                activeCategory === "all"
                  ? "text-[#0E1020]"
                  : "text-[#8B8FA3] hover:text-white"
              }`}
            >
              <span className="relative z-10">🌐 Tout ({allProducts.length})</span>
              {activeCategory === "all" && (
                <span className="absolute inset-0 z-0 rounded-full bg-white" />
              )}
            </button>

            {/* Catégories */}
            {!loading &&
              categories.map((cat) => {
                const isActive = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#3ED6A3] ${
                      isActive
                        ? "text-[#0E1020]"
                        : "text-[#8B8FA3] hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">
                      {cat.emoji} {cat.name} ({cat.count})
                    </span>
                    {isActive && (
                      <span className="absolute inset-0 z-0 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── Info filtre actif ── */}
      <section className="max-w-7xl mx-auto px-4 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#8B8FA3]">
            {activeCategory === "all"
              ? `Tous les produits (${sorted.length})`
              : `${activeCatName} — ${sorted.length} produits`}
          </p>
          <span className="text-xs text-[#8B8FA3] uppercase tracking-wide">
            Trié par score IA
          </span>
        </div>
      </section>

      {/* ── Grille produits ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#4257FF] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#8B8FA3]">Chargement du catalogue...</p>
            </div>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-bold mb-2">Aucun produit trouvé</h2>
            <p className="text-[#8B8FA3] text-sm mb-6">
              Aucun produit dans cette catégorie pour le moment.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #4257FF, #8A7CFF)",
                boxShadow: "0 4px 16px rgba(66,87,255,0.3)",
              }}
            >
              ← Voir tout le catalogue
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sorted.map((product) => (
                <ProductCardItem key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <p className="text-sm text-[#8B8FA3]">
                {sorted.length} produit{sorted.length > 1 ? "s" : ""} affiché{sorted.length > 1 ? "s" : ""}
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

// ─── Product Card ──────────────────────────────────────────
function ProductCardItem({ product }: { product: any }) {
  const score = product.estimated_score ?? 0;
  const emoji =
    KNOWN_CATEGORY_EMOJI[product.category_slug] || DEFAULT_EMOJI;
  const hasAmazon = hasAmazonLink(product);
  const affiliateUrl = getAffiliateUrl(product);

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group block bg-[#161827] rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-[#4257FF]/30 hover:shadow-lg hover:shadow-[#4257FF]/5 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-[#1A1D2E] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl text-[#8B8FA3]">
            {emoji}
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4257FF] text-white text-xs font-bold shadow-lg">
          <span>{emoji}</span>
          <span className="capitalize">{product.category_name || product.category_slug}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-base text-white truncate group-hover:text-[#FF6B5F] transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-[#8B8FA3] font-medium">{product.brand}</p>
          </div>
          <ScoreRing score={score} size="sm" />
        </div>

        {/* Specs */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(product.specs)
              .slice(0, 3)
              .map(([key, value]: [string, any]) => (
                <span
                  key={key}
                  className="px-2 py-0.5 rounded-md bg-[#1A1D2E] text-xs text-[#8B8FA3]"
                >
                  {key}: {String(value) === "true" ? "Oui" : String(value) === "false" ? "Non" : String(value)}
                </span>
              ))}
          </div>
        )}

        {/* Bouton lien Amazon / fiche produit — PAS DE PRIX FIXE */}

        <div className="pt-1">
          {hasAmazon ? (
            <a
              href={affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block w-full text-center bg-gradient-to-r from-[#FF6B5F] to-[#E5554A] text-white py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110 shadow-lg shadow-[#FF6B5F]/20"
            >
              Voir sur Amazon →
            </a>
          ) : (
            <span
              className="block w-full text-center bg-[#1A1D2E] text-[#8B8FA3] py-2.5 rounded-xl text-xs font-medium border border-white/5"
            >
              Voir la fiche →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
