import Link from "next/link";
import type { Metadata } from "next";
import nextDynamic from "next/dynamic";

const AccessoriesWidgetLoader = nextDynamic(
  () => import("@/components/accessories/AccessoriesWidget"),
  { loading: () => <div className="h-24 animate-pulse rounded-2xl bg-white/5" /> }
);

// Force SSR (not static)
export const dynamic = "force-dynamic";

const API_BASE = process.env.API_BASE_URL || "http://backend:8000";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.troviio.com";

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/products/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: "Produit introuvable — Troviio" };
  const name = product.name || "";
  const brand = product.brand || "";
  const title = `${name} — Avis, Test & Prix 2026 | Troviio`;
  const description = product.description
    ? product.description.substring(0, 155)
    : `Découvrez notre avis complet sur ${name} : test, prix, caractéristiques et verdict Troviio.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: product.image_url ? [{ url: product.image_url, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
    alternates: { canonical: `${BASE_URL}/produit/${slug}` },
  };
}

type PageProps = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold">Produit introuvable</h1>
            <p className="mt-4" style={{ color: "var(--text-muted)" }}>Ce produit n&apos;existe pas ou a été retiré du catalogue.</p>
            <Link href="/" className="mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-white transition"
              style={{ backgroundColor: "var(--coral)" }}>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const prices = product.merchant_links || [];
  const sortedPrices = [...prices].sort((a: any, b: any) => a.price_eur - b.price_eur);
  const bestPrice = sortedPrices[0]?.price_eur ?? product.price_eur;
  const fmt = (v: number) => v != null ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(v) : "";
  const specs = product.specs || {};
  const useCaseScores = product.use_case_scores || {};
  const accessories = specs.accessories || [];

  // Filter out accessories from specs for the accordion table
  const techSpecs = Object.entries(specs).filter(([k]) => k !== "accessories" && k !== "test");

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              brand: { "@type": "Brand", name: product.brand || "" },
              description: (product.description || "").substring(0, 500),
              image: product.image_url || undefined,
              sku: product.slug || undefined,
              mpn: product.amazon_asin || undefined,
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "EUR",
                lowPrice: bestPrice,
                highPrice: sortedPrices.length > 0 ? sortedPrices[sortedPrices.length - 1]?.price_eur : bestPrice,
                offers: sortedPrices.length > 0 ? sortedPrices.map((p: any) => ({
                  "@type": "Offer",
                  url: p.affiliate_url || product.affiliate_url,
                  price: p.price_eur,
                  priceCurrency: "EUR",
                  availability: "https://schema.org/InStock",
                  seller: { "@type": "Organization", name: p.merchant || "Amazon" },
                })) : [],
              },
              ...(product.estimated_score ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: (product.estimated_score / 20).toFixed(1),
                  bestRating: 5,
                  worstRating: 0,
                  ratingCount: Math.max(1, Math.round(product.estimated_score * 3)),
                },
              } : {}),
              review: (product.pros?.length || product.cons?.length) ? [
                ...(product.pros || []).slice(0, 3).map((p: string) => ({
                  "@type": "Review",
                  reviewRating: { "@type": "Rating", ratingValue: "4", bestRating: "5" },
                  name: "Point fort",
                  reviewBody: p,
                  author: { "@type": "Organization", name: "Troviio" },
                })),
                ...(product.cons || []).slice(0, 3).map((c: string) => ({
                  "@type": "Review",
                  reviewRating: { "@type": "Rating", ratingValue: "2", bestRating: "5" },
                  name: "Point faible",
                  reviewBody: c,
                  author: { "@type": "Organization", name: "Troviio" },
                })),
              ] : undefined,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
                { "@type": "ListItem", position: 2, name: product.name, item: `${BASE_URL}/produit/${slug}` },
              ],
            }),
          }}
        />

        {/* Breadcrumb */}
        <nav className="mb-6 text-xs sm:text-sm truncate" style={{ color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--text-muted)" }} className="hover:underline">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="truncate inline-block max-w-[200px] sm:max-w-none align-bottom">{product.name}</span>
        </nav>

        {/* ===== HERO SECTION ===== */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: title + description + stats */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight leading-tight">{product.name}</h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {product.description}
            </p>
            {/* 3 stat cards — stack on mobile, 3-col on sm+ */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Score */}
              <div className="rounded-2xl sm:rounded-3xl border p-4 sm:p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-muted)" }}>Score Troviio</p>
                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold truncate" style={{ color: "var(--mint)" }}>
                  {product.estimated_score?.toFixed(0)}/100
                </p>
              </div>
              {/* Price */}
              <div className="rounded-2xl sm:rounded-3xl border p-4 sm:p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-muted)" }}>Meilleur prix</p>
                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold truncate">{fmt(bestPrice)}</p>
              </div>
              {/* Brand */}
              <div className="rounded-2xl sm:rounded-3xl border p-4 sm:p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
                <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-muted)" }}>Marque</p>
                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold truncate">{product.brand}</p>
              </div>
            </div>
          </div>

          {/* Right: Image + Prices */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="rounded-2xl sm:rounded-3xl border p-4 sm:p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              {product.image_url && product.image_url.trim() && (
                <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
                  <img src={product.image_url.trim()} alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-4 sm:p-6" />
                </div>
              )}
              {/* Merchant links */}
              <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
                {sortedPrices.map((p: any, i: number) => (
                  <a
                    key={`${p.merchant || p.merchant_name}-${i}`}
                    href={p.affiliate_url || p.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex w-full items-center justify-between rounded-xl sm:rounded-2xl border p-3 sm:p-4 transition hover:opacity-80 active:opacity-60"
                    style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
                  >
                    <span className="text-sm sm:text-base font-semibold">{p.merchant || p.merchant_name}</span>
                    {i === 0 && (
                      <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-1"
                        style={{ backgroundColor: "var(--coral)", color: "white" }}>
                        Meilleur prix
                      </span>
                    )}
                    <span className="text-sm sm:text-base font-bold ml-auto" style={{ color: "var(--mint)" }}>
                      {p.price_eur != null ? fmt(p.price_eur) : ""}
                    </span>
                  </a>
                ))}
                {sortedPrices.length === 0 && product.affiliate_url && (
                  <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer nofollow"
                    className="flex w-full items-center justify-center rounded-xl sm:rounded-full py-3 font-bold text-white transition hover:opacity-80"
                    style={{ backgroundColor: "var(--coral)" }}>
                    Voir l&apos;offre → {product.price_eur ? fmt(product.price_eur) : ""}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== VERDICT ===== */}
        <div className="mt-6 sm:mt-10 rounded-2xl sm:rounded-3xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="text-xl sm:text-2xl font-bold">⚡ Notre verdict</h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-7 sm:leading-8" style={{ color: "var(--text-muted)" }}>
            {product.verdict ?? ""}
          </p>
        </div>

        {/* ===== WHY PERFECT ===== */}
        {product.why_perfect && (
          <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="text-xl sm:text-2xl font-bold">🎯 Pourquoi ce produit est parfait</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-7 sm:leading-8" style={{ color: "var(--text-muted)" }}>{product.why_perfect}</p>
          </div>
        )}

        {/* ===== TEST COMPLET ===== */}
        {product.test_summary && (
          <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="text-xl sm:text-2xl font-bold">🧪 Test complet</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-7 sm:leading-8 whitespace-pre-line" style={{ color: "var(--text-muted)" }}>{product.test_summary}</p>
          </div>
        )}

        {/* ===== PROS / CONS ===== */}
        <div className="mt-4 sm:mt-6 grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-2xl sm:rounded-3xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: "var(--mint)" }}>✅ Points forts</h2>
            <ul className="mt-3 sm:mt-4 space-y-2 text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
              {(product.pros ?? []).map((p: string) => <li key={p}>• {p}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl sm:rounded-3xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: "var(--coral)" }}>❌ Points faibles</h2>
            <ul className="mt-3 sm:mt-4 space-y-2 text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
              {(product.cons ?? []).map((c: string) => <li key={c}>• {c}</li>)}
            </ul>
          </div>
        </div>

        {/* ===== USE CASE SCORES ===== */}
        {Object.keys(useCaseScores).length > 0 && (
          <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="text-xl sm:text-2xl font-bold">📊 Scores par profil d&apos;usage</h2>
            <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
              {Object.entries(useCaseScores).sort(([, a]: any, [, b]: any) => (b as number) - (a as number))
                .map(([k, v]: [string, any]) => {
                  const s = Math.max(0, Math.min(100, Number(v)));
                  return (
                    <div key={k} className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
                      <p className="text-xs sm:text-sm font-bold" style={{ color: "var(--text-muted)" }}>
                        {k.replace(/_/g, " ").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </p>
                      <div className="mt-1 sm:mt-2 flex items-end gap-1">
                        <span className="text-2xl sm:text-3xl font-bold">{s.toFixed(0)}</span>
                        <span className="mb-0.5 sm:mb-1 text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>/100</span>
                      </div>
                      <div className="mt-2 sm:mt-3 h-1.5 sm:h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-surface)" }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${s}%`, backgroundColor: s >= 90 ? "var(--mint)" : s >= 75 ? "var(--coral)" : "var(--blue)" }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ===== SPECS ACCORDION ===== */}
        {techSpecs.length > 0 && (
          <SpecsAccordion specs={techSpecs} />
        )}

        {/* ===== ACCESSORIES ===== */}
        <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl border p-5 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <AccessoriesWidgetLoader productId={product.id} productName={product.name} />
        </div>
      </div>
    </main>
  );
}

/* ===== SPECS ACCORDION COMPONENT ===== */
function SpecsAccordion({ specs }: { specs: [string, any][] }) {
  return (
    <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl border" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <details className="group">
        <summary className="flex cursor-pointer items-center justify-between p-5 sm:p-6 list-none select-none">
          <h2 className="text-xl sm:text-2xl font-bold">🔧 Caractéristiques techniques</h2>
          <span className="shrink-0 transition-transform duration-200 group-open:rotate-180 ml-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: "var(--text-muted)" }}>
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </summary>
        <div className="overflow-hidden border-t" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {specs.map(([k, v]) => (
                <tr key={k}>
                  <th scope="row" className="px-3 sm:px-4 py-2.5 sm:py-3 font-bold w-[40%] sm:w-1/3 align-top"
                    style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>
                    {k.replace(/_/g, " ").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </th>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                    {String(v) === "true" ? "Oui" : String(v) === "false" ? "Non" : String(v)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
