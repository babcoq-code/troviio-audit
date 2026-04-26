import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ScoreRing } from "@/components/ScoreRing";
import AffiliateButton, { DisclosureBadge } from "@/components/product/AffiliateButton";
import { fetchProductBySlug } from "@/lib/api";
import { siteConfig } from "@/lib/site";
import type { Product, ProductSpecs } from "@/types";

// ─── Metadata dynamique (SEO) ─────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let product: Product;
  try {
    product = await fetchProductBySlug((await params).slug);
  } catch {
    return { title: "Produit introuvable — Picksy" };
  }

  const title = `${product.name} — Test & Avis 2026 — Picksy`;
  const description =
    product.summary ||
    `Découvre le ${product.name} de ${product.brand}. Score Picksy: ${product.estimated_score ?? "?"}/10. Prix, specs techniques, et avis détaillés.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Helpers ────────────────────────────────────────────────

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return "Prix non disponible";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getScoreColor(score: number | null): string {
  if (score === null) return "#8B8FA3";
  if (score >= 80) return "#3ED6A3";
  if (score >= 60) return "#4257FF";
  if (score >= 40) return "#FFB347";
  return "#FF6B5F";
}

function readableSpecs(specs: ProductSpecs): [string, string][] {
  try {
    return Object.entries(specs || {}).filter(
      ([, v]) => v !== null && v !== undefined && v !== ""
    ) as [string, string][];
  } catch {
    return [];
  }
}

// ─── Page Produit ──────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  let product: Product;
  try {
    product = await fetchProductBySlug((await params).slug);
  } catch {
    notFound();
  }

  const scoreColor = getScoreColor(product.estimated_score);
  const displaySpecs = readableSpecs(product.specs);
  const affiliateItem = {
    affiliateUrl: product.affiliate_url,
    amazonAsin: product.amazon_asin,
    name: product.name,
  };

  return (
    <main className="min-h-screen bg-night text-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-night/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <img src="/logo-dark.svg" alt="Picksy" style={{ height: 34 }} />
          </Link>
          <span className="text-xs text-muted hidden sm:block tracking-wide uppercase">
            Le conseiller maison
          </span>
        </div>
      </header>

      {/* ── Breadcrumb ── */}
      <nav className="max-w-6xl mx-auto px-4 py-4" aria-label="Fil d'Ariane">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li>
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/categorie/${product.category_slug}`}
              className="hover:text-white transition-colors"
            >
              {product.category_name || product.category_slug}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-white font-medium truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ═══ GALLERY / IMAGE ═══ */}
          <section className="relative">
            <div className="sticky top-24">
              <div className="relative aspect-square rounded-2xl bg-surface border border-white/5 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-6xl text-muted">
                    {product.category_emoji || "📦"}
                  </div>
                )}
              </div>

              {/* Badge catégorie */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blueberry/80 text-white text-xs font-bold backdrop-blur-sm">
                <span>{product.category_emoji || "📦"}</span>
                <span>{product.category_name || product.category_slug}</span>
              </div>
            </div>
          </section>

          {/* ═══ PRODUCT INFO ═══ */}
          <section className="space-y-8">
            {/* Brand + Name */}
            <div>
              <p className="text-sm font-semibold text-mint uppercase tracking-wider mb-1">
                {product.brand}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight font-display">
                {product.name}
              </h1>
            </div>

            {/* Score Ring + Price */}
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-1">
                <ScoreRing score={product.estimated_score ?? 0} size="lg" />
                <span className="text-xs text-muted font-medium">Score Picksy</span>
              </div>
              <div className="flex-1 space-y-3 pt-2">
                {/* Prix */}
                <div>
                  <p className="text-sm text-muted mb-1">Prix estimé</p>
                  <p
                    className="text-3xl font-extrabold"
                    style={{ color: scoreColor }}
                  >
                    {formatPrice(product.price_eur)}
                  </p>
                </div>

                {/* Bouton Amazon */}
                <AffiliateButton
                  product={affiliateItem}
                  label="Voir le prix sur Amazon →"
                  className="w-full"
                />

                {/* Disclosure */}
                <DisclosureBadge />

                {/* Mention légale Amazon */}
                <p className="text-[10px] text-muted/60 leading-relaxed italic">
                  En tant que Partenaire Amazon, Picksy réalise un bénéfice sur les
                  achats remplissant les conditions requises.
                </p>
              </div>
            </div>

            {/* Summary */}
            {product.summary && (
              <div className="bg-surface rounded-2xl border border-white/5 p-5">
                <h2 className="text-sm font-bold text-mint uppercase tracking-wider mb-2">
                  En bref
                </h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  {product.summary}
                </p>
              </div>
            )}

            {/* Pros & Cons */}
            {(product.pros?.length > 0 || product.cons?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.pros?.length > 0 && (
                  <div className="bg-surface rounded-2xl border border-white/5 p-5">
                    <h3 className="text-sm font-bold text-mint uppercase tracking-wider mb-3">
                      ✅ Points forts
                    </h3>
                    <ul className="space-y-2">
                      {product.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-white/80 flex gap-2">
                          <span className="text-mint shrink-0">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.cons?.length > 0 && (
                  <div className="bg-surface rounded-2xl border border-white/5 p-5">
                    <h3 className="text-sm font-bold text-coral uppercase tracking-wider mb-3">
                      ⚠️ Points faibles
                    </h3>
                    <ul className="space-y-2">
                      {product.cons.map((con, i) => (
                        <li key={i} className="text-sm text-white/80 flex gap-2">
                          <span className="text-coral shrink-0">−</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Use Case Scores */}
            {product.use_case_scores &&
              Object.keys(product.use_case_scores).length > 0 && (
                <div className="bg-surface rounded-2xl border border-white/5 p-5">
                  <h2 className="text-sm font-bold text-blue-50 uppercase tracking-wider mb-4">
                    📊 Scores par usage
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(product.use_case_scores).map(
                      ([key, value]) => (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-sm text-white/70 w-32 shrink-0 capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-surface-light overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, Math.max(0, (value as number) * 10))}%`,
                                background:
                                  (value as number) >= 8
                                    ? "linear-gradient(135deg, #3ED6A3, #8AF0CC)"
                                    : (value as number) >= 6
                                      ? "linear-gradient(135deg, #4257FF, #8C98FF)"
                                      : (value as number) >= 4
                                        ? "linear-gradient(135deg, #FFB347, #FFD699)"
                                        : "linear-gradient(135deg, #FF6B5F, #FF9A92)",
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold text-white w-8 text-right">
                            {typeof value === "number" ? value.toFixed(1) : value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Specs techniques */}
            {displaySpecs.length > 0 && (
              <div className="bg-surface rounded-2xl border border-white/5 p-5">
                <h2 className="text-sm font-bold text-blue-50 uppercase tracking-wider mb-4">
                  🔧 Spécifications techniques
                </h2>
                <div className="divide-y divide-white/5">
                  {displaySpecs.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2.5 text-sm"
                    >
                      <span className="text-muted capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-white font-medium text-right max-w-[60%]">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best for */}
            {product.best_for && (
              <div className="bg-surface rounded-2xl border border-white/5 p-5">
                <h2 className="text-sm font-bold text-coral uppercase tracking-wider mb-2">
                  🎯 Idéal pour
                </h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  {product.best_for}
                </p>
              </div>
            )}

            {/* CTA final */}
            <div className="bg-surface rounded-2xl border border-white/5 p-6 text-center">
              <p className="text-sm text-muted mb-4">
                Tu veux être sûr de faire le bon choix ?
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #FF6B5F, #FFB020)",
                  boxShadow: "0 8px 32px rgba(255,107,95,0.35)",
                }}
              >
                🎯 Demander une recommandation Picksy
              </Link>
              <p className="text-xs text-muted mt-3">
                Gratuit. Indépendant. Sans inscription.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <Link
              href="/mentions-legales"
              className="hover:text-white transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/affiliation"
              className="hover:text-white transition-colors"
            >
              Affiliation Amazon
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted border-t border-white/5 pt-6">
            <span>© 2026 {siteConfig.name}</span>
            <span className="text-xs">
              Liens affiliés Amazon · Recommandations indépendantes
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
