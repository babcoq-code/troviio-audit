import Link from "next/link";
import type { Metadata } from "next";
import nextDynamic from "next/dynamic";

const AccessoriesWidgetLoader = nextDynamic(
  () => import("@/components/accessories/AccessoriesWidget"),
  { loading: () => <div className="h-24 animate-pulse rounded-2xl bg-white/5" /> }
);

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://troviio.com";

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/proxy/produit/${slug}`,
      { cache: "no-store", signal: AbortSignal.timeout(15000) }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (e: any) {
    console.error("FETCH_PRODUCT_ERROR", slug, e?.message || e);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: "Produit introuvable — Troviio" };
  const name = product.name || "";
  const title = `${name} — Avis, Test & Prix 2026`;
  const description = product.description
    ? product.description.substring(0, 155)
    : `Découvrez notre avis complet sur ${name} : test, prix, caractéristiques et verdict Troviio.`;
  return {
    title,
    description,
    openGraph: {
      title, description,
      url: `${BASE_URL}/produit/${slug}`,
      siteName: "Troviio",
      locale: "fr_FR",
      type: "article",
      images: product.image_url ? [{ url: product.image_url, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: product.image_url ? [product.image_url] : undefined },
    alternates: { canonical: `${BASE_URL}/produit/${slug}` },
  };
}

type PageProps = { params: Promise<{ slug: string }> };

function fmtPrice(v: number | null): string {
  if (v == null) return "";
  // v is in euros
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(v);
}

// ─── Badge component ────────────────────────────────
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-[Sora] uppercase tracking-wider"
      style={{
        color,
        backgroundColor: `${color}1a`,
        border: `1px solid ${color}44`,
      }}
    >
      {label}
    </span>
  );
}

// ─── Score badge conic ──────────────────────────────
function ScoreBadge({ score, size = 60, fontSize = 20 }: { score: number; size?: number; fontSize?: number }) {
  const c = score >= 80 ? "#3ED6A3" : score >= 60 ? "#FFB020" : "#FF6B5F";
  return (
    <div
      className="inline-grid place-items-center rounded-full shrink-0 cursor-default hover:scale-105 transition-transform"
      style={{
        width: size, height: size,
        fontFamily: "'Nunito', sans-serif", fontWeight: 900,
        fontSize,
        background: `radial-gradient(circle at center, #181B2E 58%, transparent 60%), conic-gradient(${c} ${score}%, rgba(255,255,255,.08) 0)`,
      }}
    >
      {score}
    </div>
  );
}

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
            <p className="mt-4" style={{ color: "var(--text-muted)" }}>Ce produit n'existe pas ou a été retiré du catalogue.</p>
            <Link href="/" className="mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-white transition"
              style={{ backgroundColor: "#ff6b2b" }}>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const prices = product.merchant_links || [];
  const sortedPrices = [...prices].sort((a: any, b: any) => (a.price_eur ?? 999999) - (b.price_eur ?? 999999));
  const bestPrice = sortedPrices[0]?.price_eur ?? product.price_eur;
  const specs = product.specs || {};
  const useCaseScores = product.use_case_scores || {};
  const techSpecs = Object.entries(specs).filter(([k]) => k !== "accessories" && k !== "test");

  // Merchant logos
  const merchantLogo = (m: string) => {
    const s = m.toLowerCase();
    if (s.includes("amazon")) return { logo: "a.", color: "#FF9900" };
    // Fnac/Darty removed
    return { logo: m[0], color: "#8B8FA3" };
  };

  // Pills from specs (first 4)
  const specPills = techSpecs.slice(0, 4);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "Product",
            name: product.name,
            brand: { "@type": "Brand", name: product.brand || "" },
            description: (product.description || "").substring(0, 500),
            image: product.image_url || undefined,
            sku: product.slug || undefined,
            mpn: product.amazon_asin || undefined,
            offers: {
              "@type": "AggregateOffer", priceCurrency: "EUR",
              lowPrice: bestPrice, highPrice: sortedPrices.length > 0 ? sortedPrices[sortedPrices.length - 1]?.price_eur || bestPrice : bestPrice,
              offerCount: sortedPrices.length || 1,
            },
            ...(product.estimated_score ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: (product.estimated_score / 20).toFixed(1),
                bestRating: 5, worstRating: 0,
                ratingCount: Math.max(1, Math.round(product.estimated_score * 3)),
              },
            } : {}),
          }),
        }} />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-[var(--text)] transition-colors">Accueil</Link>
          <span style={{ color: "#3a3a45" }}>›</span>
          {product.category_slug && product.category_name && (
            <>
              <Link href={`/categorie/${product.category_slug}`} className="hover:text-[var(--text)] transition-colors">{product.category_name}</Link>
              <span style={{ color: "#3a3a45" }}>›</span>
            </>
          )}
          <span style={{ color: "var(--text)" }}>{product.name}</span>
        </nav>

        {/* ===== HERO ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">

          {/* LEFT: Gallery + Title + Pills */}
          <div>
            {/* Badges row */}
            <div className="flex gap-2 flex-wrap mb-4">
              {product.estimated_score && product.estimated_score >= 80 && (
                <Badge label="🏆 Choix Troviio" color="#3ED6A3" />
              )}
              {product.amazon_asin && (
                <Badge label="🔥 Bestseller" color="#ff6b2b" />
              )}
            </div>

            {/* Product image */}
            {product.image_url && product.image_url.trim() && (
              <div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6"
                style={{
                  background: "linear-gradient(135deg, #1a1d2e, #111113)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(255,107,43,.08), transparent 60%)" }}
                />
                <img
                  src={product.image_url.trim()}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-8 transition duration-300 hover:scale-105"
                />
              </div>
            )}

            <h1
              className="text-3xl sm:text-4xl font-black leading-tight"
              style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.04em" }}
            >
              {product.name}
            </h1>
            {product.brand && (
              <p className="mt-1 text-base" style={{ color: "var(--text-muted)" }}>
                {product.brand}
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-4 flex-wrap mt-4">
              {product.estimated_score != null && (
                <div className="flex items-center gap-2">
                  <ScoreBadge score={Math.round(product.estimated_score)} size={52} fontSize={16} />
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>sur 100</span>
                </div>
              )}
              <span className="update-badge" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "5px 10px", borderRadius: "8px",
                background: "rgba(62,214,163,.08)",
                border: "1px solid rgba(62,214,163,.2)",
                color: "#3ED6A3", fontSize: "12px", fontWeight: 700,
              }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#3ED6A3", boxShadow: "0 0 8px #3ED6A3",
                  display: "inline-block",
                }} />
                Testé régulièrement
              </span>
            </div>

            {/* Spec pills */}
            {specPills.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-5">
                {specPills.map(([k, v]) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                    style={{
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  >
                    <span>{k.charAt(0).toUpperCase()}</span>
                    <span>{String(v)}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="mt-6 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {product.description}
              </p>
            )}
          </div>

          {/* RIGHT: Sticky sidebar */}
          <div className="lg:sticky lg:top-24">
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "#181B2E",
                border: "1px solid var(--border)",
              }}
            >
              {/* Marchands */}
              <div className="space-y-2.5">
                {sortedPrices.map((p: any, i: number) => {
                  const ml = merchantLogo(p.merchant || p.merchant_name || "");
                  return (
                    <a
                      key={`${p.merchant || i}`}
                      href={p.affiliate_url || p.url || "#"}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 rounded-xl transition-all merchant-row"
                      style={{
                        backgroundColor: "var(--bg)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl grid place-items-center text-xs font-black font-[Sora] shrink-0"
                          style={{ backgroundColor: "var(--bg)", color: ml.color }}
                        >
                          {ml.logo}
                        </div>
                        <div className="font-semibold text-sm">{p.merchant || p.merchant_name}</div>
                      </div>
                      <span
                        className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors"
                        style={{
                          color: "#fff",
                          backgroundColor: "#ff6b2b",
                        }}
                      >
                        Voir →
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Verdict IA sidebar */}
              {product.verdict && (
                <div
                  className="mt-4 p-4 rounded-xl text-sm leading-relaxed"
                  style={{
                    background: "linear-gradient(135deg, rgba(66,87,255,.1), rgba(62,214,163,.05))",
                    border: "1px solid rgba(66,87,255,.25)",
                  }}
                >
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#4257FF" }}>
                    🤖 Verdict IA Troviio
                  </p>
                  <p style={{ color: "var(--text-muted)" }}>{product.verdict}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== PROS / CONS + Pour qui ? ===== */}
        <div className="mt-12">
          <h2 className="text-2xl font-black mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
            🎯 Pour qui est-il fait ?
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid rgba(62,214,163,.2)",
              }}
            >
              <h3 className="font-bold text-base mb-4" style={{ color: "#3ED6A3" }}>
                ✅ Idéal pour
              </h3>
              {(product.pros ?? []).length > 0 ? (
                <ul className="space-y-3">
                  {(product.pros ?? []).slice(0, 4).map((p: string) => (
                    <li key={p} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: "#3ED6A3" }} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{product.why_perfect || "Produit recommandé par notre IA."}</p>
              )}
            </div>
            <div
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid rgba(255,107,95,.2)",
              }}
            >
              <h3 className="font-bold text-base mb-4" style={{ color: "#FF6B5F" }}>
                ⚠️ Moins adapté si
              </h3>
              {(product.cons ?? []).length > 0 ? (
                <ul className="space-y-3">
                  {(product.cons ?? []).slice(0, 4).map((c: string) => (
                    <li key={c} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: "#FF6B5F" }} />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Prix premium pour certains budgets.</p>
              )}
            </div>
          </div>
        </div>

        {/* ===== SCORES IA ===== */}
        {Object.keys(useCaseScores).length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
              📊 Analyse IA
            </h2>
            <div className="space-y-4">
              {Object.entries(useCaseScores).sort(([, a]: any, [, b]: any) => (b as number) - (a as number))
                .map(([k, v]: [string, any]) => {
                  const s = Math.max(0, Math.min(100, Number(v)));
                  const c = s >= 80 ? "#3ED6A3" : s >= 60 ? "#FFB020" : "#FF6B5F";
                  return (
                    <div key={k}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                          {k.replace(/_/g, " ").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                        <span className="text-sm font-black" style={{ fontFamily: "'Nunito', sans-serif", color: c }}>{s.toFixed(0)}/100</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,.06)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${s}%`, background: `linear-gradient(90deg, ${c}, ${c}dd)` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ===== TEST SUMMARY ===== */}
        {product.test_summary && (
          <div className="mt-12">
            <h2 className="text-2xl font-black mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
              🧪 Test Troviio
            </h2>
            <div
              className="rounded-2xl p-6 leading-relaxed whitespace-pre-line text-sm"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              {product.test_summary}
            </div>
          </div>
        )}

        {/* ===== CTA TEST TROVIIO ===== */}
        {sortedPrices.length > 0 && (
          <div className="mt-8 flex justify-center">
            <a
              href={sortedPrices[0].affiliate_url || sortedPrices[0].url || "#"}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #FF6B5F, #FFB067)",
                boxShadow: "0 10px 30px -10px rgba(255,107,95,0.5)",
              }}
            >
              🛒 Voir le prix sur {sortedPrices[0].merchant || "Amazon"}
              <span className="text-sm opacity-80">→</span>
            </a>
          </div>
        )}

        {/* ===== SPECS ===== */}
        {techSpecs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
              📊 Caractéristiques
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {(() => {
                const half = Math.ceil(techSpecs.length / 2);
                return [techSpecs.slice(0, half), techSpecs.slice(half)].map((group, gi) => (
                  <div
                    key={gi}
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                      {group.map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center py-2.5 text-sm">
                          <span style={{ color: "var(--text-muted)" }}>
                            {k.replace(/_/g, " ").replace(/-/g, " ")}
                          </span>
                          <span className="font-semibold text-right">
                            {String(v) === "true" ? "Oui" : String(v) === "false" ? "Non" : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* ===== ACCESSORIES ===== */}
        <div className="mt-12">
          <AccessoriesWidgetLoader productId={product.id} productName={product.name} />
        </div>
      </div>

      {/* ===== CTA STICKY MOBILE ===== */}
      {sortedPrices.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-4 border-t pb-[calc(1rem+env(safe-area-inset-bottom))]"
          style={{
            backgroundColor: "rgba(10,10,11,0.97)",
            borderColor: "var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <a
            href={sortedPrices[0].affiliate_url || sortedPrices[0].url || "#"}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-full text-base font-bold text-white transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #FF6B5F, #FFB067)",
              boxShadow: "0 10px 30px -10px rgba(255,107,95,0.5)",
            }}
          >
            🛒 Voir le prix sur {sortedPrices[0].merchant || "Amazon"}
            <span className="text-sm opacity-80">→</span>
          </a>
        </div>
      )}
    </main>
  );
}
