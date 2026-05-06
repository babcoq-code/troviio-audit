import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { RecommendationResult, RecommendationItem } from "@/types/recommendation";
import { ResultClientComponents } from "./result-client";
import TroviioScore from "@/components/TroviioScore";
import { ResultAccessories } from "@/components/result-accessories";

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
  if (!result) return { title: "Recommandation introuvable | Troviio", robots: { index: false, follow: false } };
  const best = result.recommendations.find((r) => r.rank === 1);
  return {
    title: `Meilleures ${result.profile.categorie || "recommandations"} pour ton profil | Troviio`,
    description: best
      ? `Troviio recommande ${best.brand} ${best.name} – score ${best.score}/10 pour ton profil.`
      : `Tes recommandations personnalisées Troviio pour ${result.profile.categorie}.`,
    alternates: { canonical: `${APP_URL}/resultats/${result.result_id}` },
    openGraph: {
      title: `Recommandations ${result.profile.categorie} | Troviio`,
      description: result.profile.resume,
      url: `${APP_URL}/resultats/${result.result_id}`,
      type: "website",
      ...(best?.image_url && {
        images: [{ url: best.image_url, alt: `${best.brand} ${best.name}` }],
      }),
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtEur(v: number | null) {
  if (!v) return null;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
}

function rankBadge(score: number, rank: number): string {
  if (rank === 1) return "Le choix du patron (et de ta moitié).";
  if (rank === 2) return "Presque parfait, presque premier.";
  return "Le dark horse. Sous-estimé, mais costaud.";
}

function budgetLabel(budget: number | null, _recommendations: RecommendationItem[]): string {
  if (budget) return fmtEur(budget) ?? `${budget}€`;
  return "Non spécifié";
}

function fmtDate(v: string) {
  const d = new Date(v);
  return isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(d);
}

function podiumOrder(recs: RecommendationItem[]): RecommendationItem[] {
  const sorted = [...recs].sort((a, b) => a.rank - b.rank);
  const [first, second, third] = [
    sorted.find((r) => r.rank === 1),
    sorted.find((r) => r.rank === 2),
    sorted.find((r) => r.rank === 3),
  ];
  return [first, second, third].filter(Boolean) as RecommendationItem[];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result || result.recommendations.length === 0) notFound();

  const sorted = [...result.recommendations].sort((a, b) => a.rank - b.rank);
  const podium = podiumOrder(result.recommendations);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden rounded-[2.5rem] border p-6 shadow-lg backdrop-blur-xl sm:p-10"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF6B5F] via-[#4257FF] to-[#3ED6A3]" />

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B5F]/20 bg-[#FF6B5F]/10 px-3 py-1.5 text-sm font-semibold text-[#FF6B5F]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF6B5F]" />
                {result.profile.type === "accessories" ? "Accessoires recommandés par IA" : "Match IA · analyse personnalisée"}
              </span>

              <h1 className="mt-5 font-sora text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                3 résultats sur{" "}
                <span className="text-[#FF6B5F]">plusieurs centaines d'offres</span>
                <br />— pour ton profil.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 sm:text-lg" style={{ color: "var(--text-muted)" }}>
                <strong className="capitalize" style={{ color: "var(--text)" }}>{result.profile.categorie}</strong>
                {result.profile.budget_max ? ` · budget ${fmtEur(result.profile.budget_max)}` : ""}
                {result.profile.criteres?.length ? ` · ${result.profile.criteres.slice(0,2).join(", ")}` : ""}
                <br />
                On a pris tout ça en compte. Voici ce qu'on a gardé.
              </p>

              {result.profile.resume && result.profile.type !== "accessories" && (
                <blockquote className="mt-4 rounded-2xl border-l-4 border-[#4257FF] px-4 py-3 text-sm italic leading-7 break-words [overflow-wrap:anywhere]"
                  style={{ backgroundColor: "rgba(66,87,255,0.08)", color: "var(--text-muted)" }}>
                  "{result.profile.resume}"
                </blockquote>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {result.profile.criteres.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-[#4257FF]/10 px-3 py-1.5 text-sm font-semibold text-[#4257FF]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

              <aside className="rounded-3xl bg-[#0E1020] p-5 text-white shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Budget max</p>
              <p className="mt-2 font-sora text-4xl font-bold tracking-tight">
                {budgetLabel(result.profile.budget_max, result.recommendations)}
              </p>
              <div className="mt-4 h-px bg-white/10" />
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-white/50">Générée le</dt>
                  <dd className="mt-0.5 text-white/90">{fmtDate(result.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-white/50">ID de ta reco</dt>
                  <dd className="mt-0.5 font-mono text-xs text-white/70">{result.result_id}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {/* ── PODIUM ── */}
        <section className="mt-12" aria-labelledby="podium-title">
          <div className="mb-8 text-center">
            <p className="font-sora text-sm font-semibold uppercase tracking-[0.2em] text-[#3ED6A3]">
              Podium — version sans flatterie
            </p>
            <h2 id="podium-title" className="mt-2 font-sora text-3xl font-bold tracking-tight sm:text-4xl">
              Les 3 meilleurs choix pour ton profil (et accessoirement ta vie)
            </h2>
          </div>

          <div className="grid items-end gap-4 md:grid-cols-3">
            {podium.map((reco, i) => {
              const isFirst = reco.rank === 1;
              const medal = reco.rank === 1 ? "🥇" : reco.rank === 2 ? "🥈" : "🥉";
              const topColor =
                reco.rank === 1 ? "bg-[#FF6B5F]" : reco.rank === 2 ? "bg-[#3ED6A3]" : "bg-[#4257FF]";
              const delay = ["0ms", "150ms", "300ms"][i];
              const affiliateUrl = reco.affiliate_url
                ? (() => {
                    try {
                      const u = new URL(reco.affiliate_url);
                      u.searchParams.set("tag", "troviio-21");
                      return u.toString();
                    } catch {
                      return reco.affiliate_url;
                    }
                  })()
                : reco.amazon_asin
                ? `https://www.amazon.fr/dp/${reco.amazon_asin}?tag=troviio-21`
                : null;

              return (
                <article
                  key={`${reco.rank}-${reco.name}`}
                  className={[
                    "group relative flex flex-col overflow-hidden rounded-[2rem] border bg-[var(--bg-surface)] shadow-[0_20px_60px_rgba(14,16,32,0.10)] animate-slide-up",
                    isFirst
                      ? "border-[#FF6B5F]/30 md:min-h-[520px] md:scale-[1.04] md:shadow-[0_32px_80px_rgba(255,107,95,0.18)]"
                      : "border-[var(--border)] md:min-h-[460px]",
                  ].join(" ")}
                  style={{ animationDelay: delay, animationFillMode: "both" }}
                >
                  <div className={`h-1.5 w-full ${topColor}`} />

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-3xl">{medal}</span>
                        <p className="mt-2 text-xs font-bold uppercase tracking-widest" style={{color: 'var(--text-muted)'}}>
                          #{reco.rank}
                        </p>
                        <h3 className="mt-1 font-sora text-lg font-bold leading-snug tracking-tight">
                          {rankBadge(reco.score, reco.rank)}
                        </h3>
                      </div>
                      <TroviioScore score={reco.troviio_score ?? reco.score * 10} size={isFirst ? "lg" : "md"} showExplanation={false} />
                    </div>

                    <div className="mt-4 flex flex-1 items-center justify-center rounded-2xl p-4" style={{backgroundColor: 'var(--bg-surface)'}}>
                      {reco.image_url ? (
                        <img
                          src={reco.image_url}
                          alt={`${reco.brand} ${reco.name}`}
                          className="max-h-44 w-full object-contain transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-36 w-full items-center justify-center rounded-xl border border-dashed" style={{borderColor: 'var(--border)', color: 'var(--text-muted)'}}>
                          Image bientôt disponible
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-semibold" style={{color: 'var(--text-muted)'}}>{reco.brand}</p>
                      <h4 className="mt-1 font-sora text-xl font-bold tracking-tight">{reco.name}</h4>
                    </div>

                    <div className="mt-4">
                      {affiliateUrl ? (
                        <a
                          href={affiliateUrl}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          className={[
                            "inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 focus:outline-none focus:ring-4",
                            isFirst
                              ? "bg-[#FF6B5F] shadow-[#FF6B5F]/30 hover:bg-[#e55a4d] focus:ring-[#FF6B5F]/25"
                              : "bg-[#FF6B5F] shadow-[#FF6B5F]/30 hover:bg-[#e55a4d] focus:ring-[#FF6B5F]/25",
                          ].join(" ")}
                          aria-label={`Voir le prix de ${reco.brand} ${reco.name} sur Amazon`}
                        >
                          Voir le prix sur Amazon
                        </a>
                      ) : (
                        <button
                          disabled
                          className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full" style={{backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)'}}
                        >
                          Lien bientôt disponible
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── FICHES DÉTAILLÉES ── */}
        <section className="mt-16" aria-labelledby="detail-title">
          <p className="font-sora text-sm font-semibold uppercase tracking-[0.2em] text-[#4257FF]">
            Analyse sans filtre
          </p>
          <h2 id="detail-title" className="mt-2 font-sora text-3xl font-bold tracking-tight sm:text-4xl">
            Pourquoi ça — et pas le voisin ? Voici le détail.
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {sorted.map((reco) => {
              const affiliateUrl = reco.affiliate_url
                ? (() => {
                    try {
                      const u = new URL(reco.affiliate_url);
                      u.searchParams.set("tag", "troviio-21");
                      return u.toString();
                    } catch {
                      return reco.affiliate_url;
                    }
                  })()
                : reco.amazon_asin
                ? `https://www.amazon.fr/dp/${reco.amazon_asin}?tag=troviio-21`
                : null;

              const specEntries = Object.entries(reco.specs ?? {}).slice(0, 6);

              return (
                <article
                  key={`detail-${reco.rank}-${reco.name}`}
                  className="flex h-full flex-col rounded-[2rem] border p-5 shadow-[0_16px_54px_rgba(14,16,32,0.08)]" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)'}}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest" style={{backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)'}}>
                        #{reco.rank} · {reco.rank_label}
                      </span>
                      <p className="mt-4 text-sm font-semibold" style={{color: 'var(--text-muted)'}}>{reco.brand}</p>
                      <h3 className="mt-1 font-sora text-2xl font-bold tracking-tight">{reco.name}</h3>
                    </div>
                    <TroviioScore score={reco.troviio_score ?? reco.score * 10} explanation={reco.troviio_explanation} size="sm" showExplanation={false} />
                  </div>

                  {/* Image du produit */}
                  {reco.image_url && (
                    <div className="mt-4 flex items-center justify-center rounded-2xl bg-[var(--bg)] p-4">
                      <img
                        src={reco.image_url}
                        alt={`${reco.brand} ${reco.name}`}
                        className="max-h-40 w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Pourquoi c'est parfait pour toi */}
                  <div className="mt-4 rounded-2xl border border-[#3ED6A3]/20 bg-[#3ED6A3]/8 p-4">
                    <p className="font-sora text-xs font-bold uppercase tracking-widest text-[#3ED6A3]">
                      Pourquoi ça va matcher avec ta vie
                    </p>
                    <p className="mt-2 text-sm leading-7 break-words [overflow-wrap:anywhere]" style={{color: 'var(--text)'}}>{reco.why_perfect}</p>
                  </div>

                  {/* Troviio Score — l'explication personnalisée */}
                  {reco.troviio_explanation && (
                    <div className="mt-3 rounded-2xl border border-[#4257FF]/15 bg-[#4257FF]/5 p-3">
                      <p className="text-xs leading-6 italic" style={{color: 'var(--text-muted)'}}>
                        💙 {reco.troviio_explanation}
                      </p>
                    </div>
                  )}

                  {/* Attention si... */}
                  {reco.why_caution && (
                    <div className="mt-4 rounded-2xl border border-[#FF6B5F]/15 bg-[#FF6B5F]/5 p-4">
                      <p className="font-sora text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">
                        ⚠️ Petit point de vigilance
                      </p>
                      <p className="mt-2 text-sm leading-7 break-words [overflow-wrap:anywhere]" style={{color: 'var(--text)'}}>{reco.why_caution}</p>
                    </div>
                  )}

                  {/* Pros / Cons */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-sora text-xs font-bold text-slate-500 uppercase tracking-wider">Points forts</p>
                      <ul className="mt-2 space-y-2">
                        {reco.pros.map((p) => (
                          <li key={p} className="flex gap-2 text-sm leading-6 break-words [overflow-wrap:anywhere]" style={{color: 'var(--text)'}}>
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#3ED6A3]" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-sora text-xs font-bold text-slate-500 uppercase tracking-wider">Le(s) petit(s) défaut(s) qu'on assume</p>
                      <ul className="mt-2 space-y-2">
                        {reco.cons.map((c) => (
                          <li key={c} className="flex gap-2 text-sm leading-6 break-words [overflow-wrap:anywhere]" style={{color: 'var(--text)'}}>
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#FF6B5F]" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Specs */}
                  {specEntries.length > 0 && (
                    <div className="mt-4 rounded-2xl p-4" style={{backgroundColor: 'var(--bg-surface)'}}>
                      <p className="font-sora text-xs font-bold uppercase tracking-wider" style={{color: 'var(--text-muted)'}}>
                        Spécifications clés
                      </p>
                      <dl className="mt-3 space-y-2">
                        {specEntries.map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4 text-sm">
                            <dt className="capitalize" style={{color: 'var(--text-muted)'}}>{k.replace(/_/g, " ")}</dt>
                            <dd className="font-semibold" style={{color: 'var(--text)'}}>
              {(() => {
                if (String(v) === "true") return "Oui";
                if (String(v) === "false") return "Non";
                if (typeof v === "string" || typeof v === "number") return String(v);
                if (typeof v === "object" && v !== null) {
                  const boolEntries = Object.entries(v).filter(([_, val]) => val === true || val === false);
                  if (boolEntries.length === Object.keys(v).length) {
                    return (
                      <span className="flex flex-wrap gap-1.5">
                        {Object.entries(v).map(([sk, sv]) => (
                          <span key={sk}
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${sv ? "bg-[#3ED6A3]/15 text-[#3ED6A3]" : "bg-[#FF6B5F]/10 text-[#FF6B5F]/70"}`}
                          >
                            {sv ? "✓ " : "✗ "}{sk.charAt(0).toUpperCase() + sk.slice(1).replace(/_/g, " ")}
                          </span>
                        ))}
                      </span>
                    );
                  }
                  return Object.entries(v).map(([sk, sv]) => `${sk}: ${sv}`).join(" · ");
                }
                return String(v);
              })()}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {/* 🧪 Test Troviio — le verdict humoristique */}
                  {(() => {
                    const ed = (reco as unknown as Record<string, unknown>).enriched_data as Record<string, unknown> | undefined;
                    const testSummary = (ed?.test_summary as string) || null;
                    if (!testSummary) return null;
                    // Nettoyer le markdown basique si présent
                    const clean = testSummary
                      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                      .replace(/\n/g, '<br/>');
                    return (
                      <div className="mt-4 rounded-2xl border border-[#FF6B5F]/15 bg-[#FFF7ED] p-4">
                        <p className="font-sora text-xs font-bold uppercase tracking-widest text-[#FF6B5F] mb-2">
                          🧪 Test Troviio
                        </p>
                        <div
                          className="text-sm leading-7 break-words [overflow-wrap:anywhere] text-[#0E1020] troviio-test-summary"
                          dangerouslySetInnerHTML={{ __html: clean }}
                        />
                      </div>
                    );
                  })()}

                  <div className="mt-auto pt-5">
                    {affiliateUrl ? (
                      <a
                        href={affiliateUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full bg-[#FF6B5F] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,107,95,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e55a4d] focus:outline-none focus:ring-4 focus:ring-[#FF6B5F]/25"
                        aria-label={`Voir le prix de ${reco.brand} ${reco.name} sur Amazon`}
                      >
                        Voir le prix sur Amazon
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full px-5 py-3 text-sm font-bold" style={{backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)'}}
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

        {/* ── CLASSEMENT PAR USAGE ── */}
        <UsageComparisonSection recommendations={sorted} />

        {/* ── ACCESSOIRES RECOMMANDÉS ── */}
        <ResultAccessories resultId={result.result_id} />

        {/* ── POURQUOI TROVIIO A CHOISI ÇA ── */}
        <section className="mt-12 rounded-[2rem] border p-6 shadow-[0_18px_60px_rgba(14,16,32,0.08)] sm:p-8" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)'}}>
          <p className="font-sora text-sm font-semibold uppercase tracking-[0.2em] text-[#FF6B5F]">
            Le cerveau derrière tout ça
          </p>
          <h2 className="mt-2 font-sora text-2xl font-bold tracking-tight sm:text-3xl">
            Comment Troviio a sorti ses griffes pour toi 🦁
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl p-5" style={{backgroundColor: 'var(--bg-surface)'}}>
              <p className="text-sm font-semibold" style={{color: 'var(--text-muted)'}}>Tes critères prioritaires</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.profile.criteres.map((c) => (
                  <span key={c} className="rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm" style={{backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)'}}>
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold" style={{color: 'var(--text-muted)'}}>Budget maximum</p>
              <p className="mt-1 font-sora text-2xl font-bold">
                {budgetLabel(result.profile.budget_max, result.recommendations)}
              </p>
            </div>

            <div className="text-sm leading-8" style={{color: 'var(--text)'}}>
              <p>
                Troviio a filtré les produits compatibles avec ton budget, puis a pondéré les scores
                selon les critères que tu as indiqués pendant le chat. Les produits retenus maximisent
                l'équilibre entre performance réelle, adéquation à tes usages et valeur pour le prix.
              </p>
              <p className="mt-4">
                En cas d'égalité, Troviio privilégie <strong>la fiabilité des avis utilisateurs</strong> et
                la qualité des données disponibles sur chaque modèle. Les produits avec des données
                insuffisantes sont automatiquement écartés.
              </p>
              <p className="mt-4 rounded-xl border border-[#4257FF]/20 bg-[#4257FF]/5 px-4 py-3 text-xs" style={{color: 'var(--text-muted)'}}>
                ⚡ <strong>EU AI Act — Article 50.</strong> Cette recommandation a été générée par un système d'IA.
                Les prix et disponibilités peuvent varier. Vérifiez les informations sur Amazon avant achat.
              </p>
              <p className="mt-3">
                <a href="/methode" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B5F] hover:underline">
                  💘 En savoir plus sur le Troviio Score et notre méthode →
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ── ACTION PANEL + HISTORIQUE ── */}
        <ResultClientComponents resultId={result.result_id} result={result} />

        {/* ── FOOTER DISCLOSURE ── */}
        <footer className="mt-10 pb-6 text-center text-xs leading-7" style={{color: 'var(--text-muted)'}}>
          <p>
            Troviio participe au Programme Partenaires d'Amazon EU. En tant que Partenaire Amazon, Troviio réalise
            un bénéfice sur les achats remplissant les conditions requises. Les liens de cette page peuvent être
            des liens d'affiliation. Cela ne vous coûte rien de plus et nous permet de rester gratuit.
          </p>
        </footer>

      </div>
    </main>
  );
}

// ─── Composant Serveur : Tableau des usages ───────────────────────────────────

/**
 * Récupère toutes les clés use_case_scores uniques des recommandations,
 * et les affiche dans l'ordre d'apparition avec les labels originaux.
 * Pas de mapping casse-gueule — on garde les clés telles quelles.
 */
function UsageComparisonSection({ recommendations }: { recommendations: RecommendationItem[] }) {
  // Collecter toutes les clés uniques dans l'ordre d'apparition
  const allUseCaseKeys = new Map<string, string>();
  for (const r of recommendations) {
    if (r.use_case_scores) {
      for (const key of Object.keys(r.use_case_scores)) {
        if (!allUseCaseKeys.has(key)) {
          // Label lisible : première lettre en majuscule, remplacer _ par espaces
          const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
          allUseCaseKeys.set(key, label);
        }
      }
    }
  }

  const useCaseEntries = Array.from(allUseCaseKeys.entries());

  // Ne filtrer que les clés ayant au moins un score > 0
  const activeEntries = useCaseEntries.filter(([key]) =>
    recommendations.some((r) => {
      const v = r.use_case_scores?.[key];
      return typeof v === "number" ? v > 0 : typeof v === "string" ? parseFloat(v) > 0 : false;
    })
  );

  if (activeEntries.length === 0) return null;

  return (
    <section className="mt-12 rounded-[2rem] border p-6 shadow-[0_18px_60px_rgba(14,16,32,0.08)] sm:p-8" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)'}}>
      <p className="font-sora text-sm font-semibold uppercase tracking-[0.2em] text-[#4257FF]">
        Classement par usage
      </p>
      <h2 className="mt-2 font-sora text-2xl font-bold tracking-tight sm:text-3xl">
        Compare les scores selon tes usages
      </h2>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-0 border-separate border-spacing-y-1 text-left">
          <thead>
            <tr>
              <th className="rounded-l-xl px-3 py-3 text-xs font-bold sm:px-4 sm:text-sm" style={{backgroundColor: 'var(--bg)', color: 'var(--text)'}}>Usage</th>
              {recommendations.map((r) => (
                <th key={r.rank} className="px-3 py-3 text-xs font-bold last:rounded-r-xl sm:px-4 sm:text-sm" style={{backgroundColor: 'var(--bg)', color: 'var(--text)'}}>
                  #{r.rank} {r.brand}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeEntries.map(([useCase, label]) => {
              const scores = recommendations.map((r) => {
                const s: unknown = r.use_case_scores?.[useCase] ?? 0;
                if (typeof s === "string") {
                  const m = s.match(/([\d.]+)\/([\d.]+)/);
                  return m ? (parseFloat(m[1]) / parseFloat(m[2])) * 10 : parseFloat(s) || 0;
                }
                return typeof s === "number" ? s : 0;
              });
              const maxScore = Math.max(...scores, 0.001);

              return (
                <tr key={useCase}>
                  <td className="px-4 py-3 text-sm font-bold whitespace-nowrap" style={{color: 'var(--text)'}}>
                    {label}
                  </td>
                  {recommendations.map((r) => {
                    const score = r.use_case_scores?.[useCase] ?? 0;
                    const numericScore = typeof score === "string"
                      ? (() => {
                          const m = (score as string).match(/([\d.]+)\/([\d.]+)/);
                          return m ? (parseFloat(m[1]) / parseFloat(m[2])) * 10 : parseFloat(score) || 0;
                        })()
                      : (typeof score === "number" ? score : 0);
                    const pct = (numericScore / 10) * 100;
                    const isBest = numericScore === maxScore && numericScore > 0;

                    return (
                      <td key={r.rank} className="border-t px-4 py-3" style={{borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)'}}>
                        <div className="flex min-w-24 items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full" style={{backgroundColor: 'var(--bg)'}}>
                            <div
                              className={`h-full rounded-full ${isBest ? "bg-gradient-to-r from-[#3ED6A3] to-[#4257FF]" : ""}`}
                              style={{ width: `${pct}%`, backgroundColor: isBest ? undefined : 'var(--border)' }}
                            />
                          </div>
                          <span className={`w-8 shrink-0 text-right font-sora text-sm font-bold ${isBest ? "text-[#3ED6A3]" : ""}`} style={{color: isBest ? undefined : 'var(--text-muted)'}}>
                            {numericScore.toFixed(1)}
                            {isBest && " 🏆"}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-6" style={{color: 'var(--text-muted)'}}>
        Scores sur 10. 🏆 = meilleur score dans cet usage parmi les 3 recommandations.
      </p>
    </section>
  );
}
