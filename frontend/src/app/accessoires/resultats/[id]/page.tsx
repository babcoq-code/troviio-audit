import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { RecommendationResult, RecommendationItem } from "@/types/recommendation";

// ─── Fetch ────────────────────────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://troviio.com";
const API_URL = process.env.PICKSY_API_URL ?? APP_URL;

async function getResult(id: string): Promise<RecommendationResult | null> {
  try {
    const res = await fetch(`${API_URL}/api/results/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 600, tags: [`result-${id}`] },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return (await res.json()) as RecommendationResult;
  } catch {
    return null;
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getResult(id);
  if (!result)
    return {
      title: "Accessoires introuvables | Troviio",
      robots: { index: false, follow: false },
    };
  const productName = result.profile?.product_name || "accessoires";
  return {
    title: `Accessoires pour ${productName} | Troviio`,
    description: `Troviio a trouvé les meilleurs accessoires pour ${productName}.`,
    alternates: {
      canonical: `${APP_URL}/accessoires/resultats/${result.result_id}`,
    },
    openGraph: {
      title: `Accessoires pour ${productName} | Troviio`,
      description: result.profile?.usage_summary || "Accessoires recommandés par IA",
      url: `${APP_URL}/accessoires/resultats/${result.result_id}`,
      type: "website",
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(v: string) {
  const d = new Date(v);
  return isNaN(d.getTime())
    ? ""
    : new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(d);
}

function catEmoji(cat: string): string {
  const map: Record<string, string> = {
    "robot-aspirateur": "🤖",
    "machine-a-cafe": "☕",
    tv: "📺",
    smartphone: "📱",
    "casque-audio": "🎧",
    "velo-electrique": "🚲",
    "lave-linge": "🧺",
    "lave-vaisselle": "🍽️",
    refrigerateur: "❄️",
    "purificateur-air": "💨",
    "barre-de-son": "🔊",
    "friteuse-air": "🍟",
    trottinette: "🛴",
    "ordinateur-portable": "💻",
    imprimante: "🖨️",
    "camera-securite": "📹",
    "thermostat-connecte": "🌡️",
    poussette: "👶",
    "enceinte-bt": "🔈",
    "four-micro-ondes": "♨️",
  };
  return map[cat] || "🛠️";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AccessoriesResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result || result.recommendations.length === 0) notFound();

  const isAccessory = result.profile?.type === "accessories";
  const productName = result.profile?.product_name || "ton appareil";
  const productBrand = result.profile?.product_brand || "";
  const productCategory = result.profile?.product_category || "";
  const usageSummary = result.profile?.usage_summary || "";

  const sorted = [...result.recommendations].sort((a, b) => a.rank - b.rank);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF7ED] via-white to-[#FFF7ED] text-[#0E1020]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_32px_80px_rgba(14,16,32,0.10)] backdrop-blur-xl sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF6B5F] via-[#4257FF] to-[#3ED6A3]" />

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B5F]/20 bg-[#FF6B5F]/10 px-3 py-1.5 text-sm font-semibold text-[#FF6B5F]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF6B5F]" />
                Accessoires recommandés par IA
              </span>

              <h1 className="mt-5 font-sora text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Les accessoires qu&apos;il te faut{" "}
                <span className="text-[#FF6B5F]">
                  pour {productBrand} {productName}
                </span>
              </h1>

              {usageSummary && (
                <blockquote className="mt-4 rounded-2xl border-l-4 border-[#4257FF] bg-[#4257FF]/5 px-4 py-3 text-sm italic leading-7 text-slate-600 break-words [overflow-wrap:anywhere]">
                  &ldquo;{usageSummary}&rdquo;
                </blockquote>
              )}

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Troviio a cherché les accessoires compatibles avec{" "}
                <strong className="text-[#0E1020]">
                  {productBrand} {productName}
                </strong>
                . Filtres, brosses, batteries, protections — tout ce qui peut
                prolonger la vie de ton appareil ou améliorer son usage au
                quotidien. <span role="img" aria-label="tools">🔧</span>
              </p>
            </div>

            <aside className="rounded-3xl bg-[#0E1020] p-5 text-white shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{catEmoji(productCategory)}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    Appareil
                  </p>
                  <p className="mt-1 font-sora text-lg font-bold tracking-tight">
                    {productBrand} {productName}
                  </p>
                </div>
              </div>
              <div className="mt-4 h-px bg-white/10" />
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-white/50">Accessoires trouvés</dt>
                  <dd className="mt-0.5 text-white/90">
                    {sorted.length} recommandations
                  </dd>
                </div>
                <div>
                  <dt className="text-white/50">Générée le</dt>
                  <dd className="mt-0.5 text-white/90">
                    {fmtDate(result.created_at)}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {/* ── GRILLE ACCESSOIRES ── */}
        <section className="mt-12" aria-labelledby="accessories-title">
          <div className="mb-8 text-center">
            <p className="font-sora text-sm font-semibold uppercase tracking-[0.2em] text-[#3ED6A3]">
              {isAccessory ? "La sélection du moment" : "Recommandations"}
            </p>
            <h2
              id="accessories-title"
              className="mt-2 font-sora text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Voici les accessoires qu&apos;on a dénichés pour toi 🔧
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((reco) => {
              const ed = (reco as unknown as Record<string, unknown>)
                .enriched_data as Record<string, unknown> | undefined;
              const amazonUrl =
                (ed?.amazon_search_url as string) ||
                reco.amazon_asin
                  ? `https://www.amazon.fr/s?k=${productBrand}+${productName}+${reco.name}&tag=troviio-21`
                  : null;
              const accessoryCategory = (ed?.category as string) || "autre";
              const estimatedPrice = (ed?.estimated_price as string) || reco.price_range;

              const accessoryIcons: Record<string, string> = {
                filtre: "💨",
                brosse: "🔄",
                batterie: "🔋",
                station: "🏗️",
                sac: "📦",
                chargeur: "⚡",
                cable: "🔌",
                support: "📐",
                protection: "🛡️",
                autre: "🔧",
              };
              const icon = accessoryIcons[accessoryCategory] || "🔧";

              const bgColors = [
                "from-[#FF6B5F]/5 to-[#FF6B5F]/[0.02]",
                "from-[#4257FF]/5 to-[#4257FF]/[0.02]",
                "from-[#3ED6A3]/5 to-[#3ED6A3]/[0.02]",
              ];
              const borderColors = [
                "border-[#FF6B5F]/20 hover:border-[#FF6B5F]/40",
                "border-[#4257FF]/20 hover:border-[#4257FF]/40",
                "border-[#3ED6A3]/20 hover:border-[#3ED6A3]/40",
              ];

              return (
                <article
                  key={`${reco.rank}-${reco.name}`}
                  className={`group relative flex flex-col overflow-hidden rounded-[2rem] border bg-gradient-to-b ${
                    bgColors[reco.rank - 1] || bgColors[0]
                  } ${
                    borderColors[reco.rank - 1] || borderColors[0]
                  } p-6 shadow-[0_16px_54px_rgba(14,16,32,0.08)] transition-all hover:shadow-[0_24px_64px_rgba(14,16,32,0.12)]`}
                >
                  {/* Rang */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-600 shadow-sm">
                      #{reco.rank}
                    </span>
                    <span className="text-2xl">{icon}</span>
                  </div>

                  {/* Prix */}
                  {estimatedPrice && (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-[#FF6B5F]/10 px-3 py-1 text-sm font-bold text-[#FF6B5F]">
                      ~{estimatedPrice}
                    </span>
                  )}

                  {/* Nom */}
                  <h3 className="font-sora text-lg font-bold leading-snug tracking-tight">
                    {reco.name}
                  </h3>

                  {/* Pourquoi */}
                  {reco.why_perfect && (
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 break-words [overflow-wrap:anywhere]">
                      {reco.why_perfect}
                    </p>
                  )}

                  {/* Compatibilité */}
                  {reco.why_caution && (
                    <div className="mt-3 rounded-xl border border-[#4257FF]/15 bg-[#4257FF]/5 px-3 py-2">
                      <p className="text-xs leading-5 text-slate-500 break-words [overflow-wrap:anywhere]">
                        ✅ {reco.why_caution}
                      </p>
                    </div>
                  )}

                  {/* Lien Amazon */}
                  <div className="mt-5">
                    {amazonUrl ? (
                      <a
                        href={amazonUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF6B5F] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,107,95,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e55a4d] focus:outline-none focus:ring-4 focus:ring-[#FF6B5F]/25"
                        aria-label={`Voir ${reco.name} sur Amazon`}
                      >
                        Voir sur Amazon →
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-slate-200 px-5 py-3 text-sm font-bold text-slate-500"
                      >
                        Lien bientôt disponible
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── POURQUOI TROVIIO A CHOISI ÇA ── */}
        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(14,16,32,0.08)] sm:p-8">
          <p className="font-sora text-sm font-semibold uppercase tracking-[0.2em] text-[#FF6B5F]">
            Le cerveau derrière tout ça
          </p>
          <h2 className="mt-2 font-sora text-2xl font-bold tracking-tight sm:text-3xl">
            Comment Troviio a trouvé ces accessoires 🦁
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Appareil</p>
              <p className="mt-1 font-sora text-2xl font-bold">
                {productBrand} {productName}
              </p>
              <div className="mt-4 h-px bg-slate-200" />
              <p className="mt-4 text-sm font-semibold text-slate-500">Catégorie</p>
              <p className="mt-1 font-sora text-xl font-bold capitalize">
                {catEmoji(productCategory)} {productCategory.replace(/-/g, " ")}
              </p>
            </div>

            <div className="text-sm leading-8 text-slate-700">
              <p>
                Troviio a analysé les caractéristiques de ton appareil et cherché
                les accessoires compatibles sur le marché. Filtres, brosses,
                batteries, protections, stations — chaque accessoire a été vérifié
                mentalement pour s&apos;assurer qu&apos;il est bien compatible avec
                ton modèle exact.
              </p>
              <p className="mt-4">
                {isAccessory
                  ? "Les prix sont une estimation basée sur les prix constatés sur Amazon. Ils peuvent varier selon les vendeurs et les promotions."
                  : "Les recommandations sont basées sur ton profil et tes critères."}
              </p>
              <p className="mt-4 rounded-xl border border-[#4257FF]/20 bg-[#4257FF]/5 px-4 py-3 text-xs text-slate-600">
                ⚡ <strong>EU AI Act — Article 50.</strong> Ces recommandations
                ont été générées par un système d&apos;IA. Les prix et
                disponibilités peuvent varier. Vérifiez les informations sur
                Amazon avant achat.
              </p>
            </div>
          </div>
        </section>

        {/* ── FOOTER DISCLOSURE ── */}
        <footer className="mt-10 pb-6 text-center text-xs leading-7 text-slate-500">
          <p>
            Troviio participe au Programme Partenaires d&apos;Amazon EU. En tant
            que Partenaire Amazon, Troviio réalise un bénéfice sur les achats
            remplissant les conditions requises. Les liens de cette page peuvent
            être des liens d&apos;affiliation. Cela ne vous coûte rien de plus et
            nous permet de rester gratuit.
          </p>
        </footer>
      </div>
    </main>
  );
}
