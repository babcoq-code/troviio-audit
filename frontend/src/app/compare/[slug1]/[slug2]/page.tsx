import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const API_BASE = process.env.API_BASE_URL || "http://backend:8000";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.troviio.com";

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/products/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

type PageProps = { params: Promise<{ slug1: string; slug2: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug1, slug2 } = await params;
  const [p1, p2] = await Promise.all([fetchProduct(slug1), fetchProduct(slug2)]);
  const n1 = p1?.name || slug1;
  const n2 = p2?.name || slug2;
  const title = `${n1} vs ${n2} — Comparatif 2026 | Troviio`;
  const metaDesc = `Comparez ${n1} et ${n2} : prix, performances, avis et verdict Troviio. Lequel choisir ?`;
  return {
    title,
    description: metaDesc,
    alternates: { canonical: `${BASE_URL}/compare/${slug1}/${slug2}` },
    openGraph: { title, description: metaDesc, type: "article" },
  };
}

function SpecRow({ label, v1, v2 }: { label: string; v1: string; v2: string }) {
  const same = v1 === v2 && v1 !== "-";
  return (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>
      <td className="px-4 py-3 text-sm font-medium w-1/4" style={{ color: "var(--text-muted)" }}>{label}</td>
      <td className={`px-4 py-3 text-sm ${same ? "text-center" : ""}`} style={{ color: same ? "var(--mint)" : "var(--text)" }}>
        {same ? "✅ Identique" : v1}
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: "var(--text)" }}>{v2}</td>
    </tr>
  );
}

export default async function ComparePage({ params }: PageProps) {
  const { slug1, slug2 } = await params;
  const [p1, p2] = await Promise.all([fetchProduct(slug1), fetchProduct(slug2)]);

  if (!p1 || !p2) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg)" }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold">Produit introuvable</h1>
          <Link href="/" className="mt-4 inline-block text-sm underline" style={{ color: "var(--coral)" }}>Retour à l'accueil</Link>
        </div>
      </main>
    );
  }

  const fmt = (v: number) => v != null ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(v) : "N/C";
  const allKeys = [...new Set([...Object.keys(p1.specs || {}), ...Object.keys(p2.specs || {})])];
  const s1 = p1.estimated_score || 0;
  const s2 = p2.estimated_score || 0;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${p1.name} vs ${p2.name}`,
          description: `Comparatif détaillé entre ${p1.name} et ${p2.name}`,
          brand: { "@type": "Brand", name: p1.brand },
        })
      }} />
      
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--text-muted)" }}>Accueil</Link>
            <span className="mx-2">›</span>
            <span>Comparatif : {p1.name} vs {p2.name}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold">
            {p1.name} <span style={{ color: "var(--coral)" }}>vs</span> {p2.name}
          </h1>
          <p className="mt-2" style={{ color: "var(--text-muted)" }}>
            Lequel choisir ? Notre IA compare tout : prix, performances, avis et rapport qualité-prix.
          </p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="rounded-3xl border p-6 text-center" style={{ borderColor: s1 >= s2 ? "var(--mint)" : "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            {s1 >= s2 && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--mint)", color: "#000" }}>🏆 Gagnant</span>}
            <img src={p1.image_url} alt={p1.name} className="h-24 mx-auto my-3 object-contain" />
            <h2 className="font-bold text-lg">{p1.name}</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{p1.brand}</p>
            <p className="text-3xl font-bold mt-2" style={{ color: "var(--mint)" }}>{s1.toFixed(1)}/10</p>
            <p className="text-xl font-bold mt-1">{fmt(p1.price_eur)}</p>
            <Link href={`/produit/${slug1}`} className="mt-3 inline-block px-5 py-2 rounded-full text-sm font-bold text-white" style={{ backgroundColor: "var(--coral)" }}>Voir la fiche →</Link>
          </div>
          <div className="rounded-3xl border p-6 text-center" style={{ borderColor: s2 >= s1 ? "var(--mint)" : "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            {s2 >= s1 && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--mint)", color: "#000" }}>🏆 Gagnant</span>}
            <img src={p2.image_url} alt={p2.name} className="h-24 mx-auto my-3 object-contain" />
            <h2 className="font-bold text-lg">{p2.name}</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{p2.brand}</p>
            <p className="text-3xl font-bold mt-2" style={{ color: "s1 >= s2 ? 'var(--mint)' : 'var(--coral)'" }}>{s2.toFixed(1)}/10</p>
            <p className="text-xl font-bold mt-1">{fmt(p2.price_eur)}</p>
            <Link href={`/produit/${slug2}`} className="mt-3 inline-block px-5 py-2 rounded-full text-sm font-bold text-white" style={{ backgroundColor: "var(--coral)" }}>Voir la fiche →</Link>
          </div>
        </div>

        {/* Verdict */}
        <div className="rounded-3xl border p-6 mb-10" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="text-2xl font-bold mb-3">⚖️ Notre verdict</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2" style={{ color: "var(--mint)" }}>Pourquoi choisir {p1.name} ?</h3>
              <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>{p1.verdict || p1.why_perfect || p1.description}</p>
              {(p1.pros || []).slice(0, 3).map((pro: string) => (
                <p key={pro} className="text-sm mt-1" style={{ color: "var(--mint)" }}>✅ {pro}</p>
              ))}
            </div>
            <div>
              <h3 className="font-bold mb-2" style={{ color: "var(--coral)" }}>Pourquoi choisir {p2.name} ?</h3>
              <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>{p2.verdict || p2.why_perfect || p2.description}</p>
              {(p2.pros || []).slice(0, 3).map((pro: string) => (
                <p key={pro} className="text-sm mt-1" style={{ color: "var(--mint)" }}>✅ {pro}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Specs comparison table */}
        {allKeys.length > 0 && (
          <div className="rounded-3xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="px-4 py-3 font-bold" style={{ backgroundColor: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
              📊 Comparatif technique
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "var(--bg)", borderBottom: "2px solid var(--border)" }}>
                  <th className="px-4 py-3 text-left text-sm font-bold w-1/4">Caractéristique</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">{p1.name}</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">{p2.name}</th>
                </tr>
              </thead>
              <tbody>
                {allKeys.map((key) => {
                  const v1 = p1.specs?.[key] ?? "-";
                  const v2 = p2.specs?.[key] ?? "-";
                  const label = key.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
                  return <SpecRow key={key} label={label} v1={String(v1)} v2={String(v2)} />;
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-lg mb-4">Tu hésites encore ?</p>
          <Link href="/#chat-hero" className="inline-block px-8 py-3 rounded-full font-bold text-white transition" style={{ backgroundColor: "var(--coral)" }}>
            🎯 Demande à l'IA de trancher
          </Link>
        </div>
      </div>
    </main>
  );
}
