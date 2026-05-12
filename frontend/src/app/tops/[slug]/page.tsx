import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

// Static slugs that have dedicated pages
const STATIC_SLUGS = [
  "meilleur-aspirateur-robot",
  "meilleur-aspirateur-balai",
  "meilleur-robot-cuisine",
  "meilleur-casque-audio",
  "meilleur-bureau-electrique",
  "meilleur-clavier-gaming",
  "meilleure-friteuse-air",
  "meilleure-machine-a-cafe",
  "meilleure-montre-connectee",
  "meilleure-station-accueil-usbc",
  "meilleure-tv",
  "meilleure-voiture-electrique",
  "aspirateur-robot",
  "aspirateur-balai",
  "robot-cuisine",
  "casque-audio",
  "bureau-electrique",
  "clavier-gaming",
  "friteuse-air",
  "machine-a-cafe",
  "montre-connectee",
  "station-accueil-usbc",
  "tv",
  "voiture-electrique",
];

// Map short slugs to their full "meilleur-" equivalents
const SLUG_REDIRECT_MAP: Record<string, string> = {
  "aspirateur-robot": "meilleur-aspirateur-robot",
  "aspirateur-balai": "meilleur-aspirateur-balai",
  "robot-cuisine": "meilleur-robot-cuisine",
  "casque-audio": "meilleur-casque-audio",
  "bureau-electrique": "meilleur-bureau-electrique",
  "clavier-gaming": "meilleur-clavier-gaming",
  "friteuse-air": "meilleure-friteuse-air",
  "machine-a-cafe": "meilleure-machine-a-cafe",
  "montre-connectee": "meilleure-montre-connectee",
  "station-accueil-usbc": "meilleure-station-accueil-usbc",
  "tv": "meilleure-tv",
  "voiture-electrique": "meilleure-voiture-electrique",
};

export async function generateStaticParams() {
  return STATIC_SLUGS.map((slug) => ({ slug }));
}

interface TopsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TopsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug
    .replace(/^meilleur-/, "")
    .replace(/^meilleure-/, "")
    .replace(/-/g, " ");
  const title = `Top 3 ${categoryName} 2026 — Troviio`;
  return {
    title,
    description: `Le classement des 3 meilleurs produits ${categoryName} de 2026, sélectionnés et notés par l'IA Troviio.`,
    alternates: { canonical: `https://troviio.com/tops/${slug}` },
  };
}

export default async function TopsSlugPage({ params }: TopsPageProps) {
  const { slug } = await params;

  // If this is a short slug, redirect to the full "meilleur-" version
  if (SLUG_REDIRECT_MAP[slug]) {
    // We can't use redirect() in a server component without issues,
    // so we'll fetch from the full slug instead
    // Actually, let's just notFound and the redirect in next.config will handle it
    notFound();
  }

  // Fetch top products from Supabase for this category
  let products: any[] = [];
  let categoryName = slug.replace(/-/g, " ").replace(/^meilleur /, "").replace(/^meilleure /, "");
  categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://troviio.com";
    const res = await fetch(`${baseUrl}/api/products/by-category/${slug}?limit=3&sort=estimated_score`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      products = Array.isArray(data) ? data.slice(0, 3) : [];
    }
  } catch (e) {
    console.error("Failed to fetch tops products:", e);
  }

  if (products.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-[#FF6B5F] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/tops" className="hover:text-[#FF6B5F] transition-colors">Top 3</Link>
          <span>/</span>
          <span className="font-medium" style={{ color: "var(--text)" }}>Top 3 : {categoryName}</span>
        </nav>

        <div className="max-w-3xl mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "#3ED6A3" }}>
            🏆 Top 3 Troviio
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">
            Top 3 {categoryName} 2026
          </h1>
          <p className="mt-6 text-lg leading-8" style={{ color: "var(--text-muted)" }}>
            Les 3 meilleurs produits {categoryName.toLowerCase()} sélectionnés par l&apos;IA Troviio.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {products.map((product: any, idx: number) => {
            const medals = ["🥇", "🥈", "🥉"];
            const labels = ["Numéro 1", "Numéro 2", "Numéro 3"];
            const colors = ["#3ED6A3", "#4257FF", "#FFB347"];
            return (
              <div
                key={product.slug || idx}
                className="rounded-2xl border p-6"
                style={{
                  borderColor: idx === 0 ? `${colors[0]}30` : "var(--border)",
                  backgroundColor: idx === 0 ? "rgba(62,214,163,0.06)" : "var(--bg-surface)",
                }}
              >
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-widest"
                  style={{ color: colors[idx] || "var(--text-muted)" }}
                >
                  {medals[idx] || `#${idx + 1}`} {labels[idx] || `Position ${idx + 1}`}
                </p>
                <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-24 h-24 object-contain rounded-xl shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold font-sora">{product.name}</h2>
                    {product.brand && (
                      <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                        {product.brand}
                      </p>
                    )}
                    {product.estimated_score && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold" style={{ backgroundColor: "rgba(62,214,163,0.15)", color: "#3ED6A3" }}>
                        Score Troviio : {product.estimated_score}/100
                      </div>
                    )}
                    {product.price_eur && (
                      <p className="mt-2 text-lg font-bold" style={{ color: "var(--text)" }}>
                        {product.price_eur.toLocaleString("fr-FR")} €
                      </p>
                    )}
                    <div className="mt-4">
                      <a
                        href={product.affiliate_url || `/produit/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
                        style={{
                          background: "linear-gradient(135deg, #FF6B5F, #E5554A)",
                          boxShadow: "0 4px 16px rgba(255,107,95,0.3)",
                        }}
                      >
                        Voir le prix sur Amazon →
                      </a>
                    </div>
                  </div>
                </div>
                {product.pros && product.pros.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {product.pros.slice(0, 3).map((p: string, i: number) => (
                      <p key={i} className="text-sm flex items-start gap-2" style={{ color: "#3ED6A3" }}>
                        <span>✓</span> {p}
                      </p>
                    ))}
                  </div>
                )}
                {product.cons && product.cons.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {product.cons.slice(0, 2).map((c: string, i: number) => (
                      <p key={i} className="text-sm flex items-start gap-2" style={{ color: "#FF6B5F" }}>
                        <span>✗</span> {c}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="text-lg font-bold mb-4">Autres comparatifs</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/catalogue" className="rounded-full px-4 py-2 text-xs font-medium transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }}>
              Tout le catalogue
            </Link>
            <Link href="/" className="rounded-full px-4 py-2 text-xs font-medium transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }}>
              Accueil Troviio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
