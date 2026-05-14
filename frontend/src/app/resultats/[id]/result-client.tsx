"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "@/hooks/useHistory";
import type { RecommendationResult } from "@/types/recommendation";
import HistorySidebar from "@/components/HistorySidebar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function budgetLabel(budget: number | null, recommendations: { price_eur: number | null }[]): string {
  if (budget) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(budget);
  }
  const prices = recommendations
    .map((r) => r.price_eur)
    .filter((p): p is number => p !== null && p !== undefined);
  if (prices.length === 0) return "Non spécifié";
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  if (avg < 200) return "~ Économique";
  if (avg < 600) return "~ Bon rapport qualité/prix";
  return "~ Premium";
}

// ─── HistorySaver (sauvegarde silencieuse dans l'historique) ─────────────────

function HistorySaver({ result }: { result: RecommendationResult }) {
  const { save } = useHistory();

  useEffect(() => {
    const topProducts = result.recommendations
      .filter((r) => r.rank <= 3)
      .map((r) => `${r.brand} ${r.name}`);

    save({
      id: result.result_id,
      category: result.profile.categorie
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      label: result.profile.categorie,
      created_at: result.created_at,
      topProducts,
      budget: budgetLabel(result.profile.budget_max, result.recommendations),
    });
  }, [result, save]);

  return null;
}

// ─── HistorySidebarWrapper ────────────────────────────────────────────────────

function HistorySidebarWrapper() {
  const { history, loaded, remove, clear } = useHistory();
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  if (!loaded || history.results.length === 0) return null;

  return (
    <>
      <div className="fixed right-4 top-24 z-40 hidden lg:block">
        <HistorySidebar
          items={history.results}
          onRemove={remove}
          onClear={clear}
          position="sidebar"
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
        />
      </div>
      <div className="lg:hidden">
        <HistorySidebar
          items={history.results}
          onRemove={remove}
          onClear={clear}
          position="bottom-bar"
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
        />
      </div>
    </>
  );
}

// ─── ResultClientComponents ──────────────────────────────────────────────────

export function ResultClientComponents({
  resultId,
  result,
}: {
  resultId: string;
  result?: RecommendationResult;
}) {
  return (
    <>
      {result && <HistorySaver result={result} />}
      <HistorySidebarWrapper />

      {/* Bouton retour en haut */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md" style={{border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)'}}
        >
          ← Retour à l'accueil
        </Link>
      </div>

        <section className="rounded-[2rem] bg-[#0E1020] p-6 text-white shadow-[0_24px_80px_rgba(14,16,32,0.20)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-sora text-2xl font-bold tracking-tight">
              Tu veux partager ou affiner ta recherche ?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-white/70">
              Envoie ce lien à un proche ou relance le chat Troviio pour préciser ton budget,
              tes usages ou tes préférences.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <ShareButton resultId={resultId} />
            <WhatsAppShareButton resultId={resultId} />
            <EmailRecoButton resultId={resultId} />
            <RefineSearchButton />
          </div>
        </div>

        <FeedbackButtons resultId={resultId} />
      </section>
    </>
  );
}

function ShareButton({ resultId }: { resultId: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function handleShare() {
    const url = `${window.location.origin}/resultats/${resultId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Ma recommandation Troviio", url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setStatus("copied");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setStatus("copied");
      } catch {
        setStatus("error");
      }
    }
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0E1020] transition hover:-translate-y-0.5 hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/20"
    >
      {status === "copied"
        ? "✓ Lien copié !"
        : status === "error"
        ? "Copie impossible"
        : "🔗 Partager ma reco"}
    </button>
  );
}

function WhatsAppShareButton({ resultId }: { resultId: string }) {
  function handleWhatsApp() {
    const url = encodeURIComponent(`${window.location.origin}/resultats/${resultId}`);
    const text = encodeURIComponent("J'ai trouvé 3 produits parfaits grâce à Troviio, regarde :");
    window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
  }

  return (
    <button
      type="button"
      onClick={handleWhatsApp}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
    >
      WhatsApp 📲
    </button>
  );
}

// ─── Feedback post-recommandation ─────────────────────────────────────────────

type FeedbackOption = "matches" | "too_expensive" | "not_suitable";

function FeedbackButtons({ resultId }: { resultId: string }) {
  const [selected, setSelected] = useState<FeedbackOption | null>(null);
  const [sent, setSent] = useState(false);

  const handleFeedback = async (value: FeedbackOption) => {
    if (sent || selected) return;
    setSelected(value);
    try {
      const { trackEvent } = await import("@/lib/analytics");
      trackEvent("recommendation_feedback", { result_id: resultId, feedback: value });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch {
      setSent(false);
    }
  };

  const buttons: { value: FeedbackOption; emoji: string; label: string }[] = [
    { value: "matches", emoji: "✅", label: "Ça correspond" },
    { value: "too_expensive", emoji: "💰", label: "Trop cher" },
    { value: "not_suitable", emoji: "🔄", label: "Pas adapté" },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <p className="text-sm font-semibold text-white/80 mb-3">
        Cette recommandation te correspond ?
      </p>
      <div className="flex flex-wrap gap-2">
        {buttons.map(({ value, emoji, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleFeedback(value)}
            disabled={sent}
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
              selected === value
                ? "bg-[#FF6B5F] text-white shadow-md"
                : "border border-white/15 text-white/70 hover:bg-white/10 hover:text-white",
              sent ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          >
            {emoji} {label}
          </button>
        ))}
        {sent && (
          <span className="inline-flex items-center text-xs text-[#3ED6A3] animate-fade-in ml-2">
            ✓ Merci de ton avis !
          </span>
        )}
      </div>
    </div>
  );
}

function RefineSearchButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
    >
      🔍 Affiner ma recherche
    </Link>
  );
}

// ─── Email de la recommandation ──────────────────────────────────────────────

function EmailRecoButton({ resultId }: { resultId: string }) {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("idle");
    try {
      const res = await fetch("/api/email/reco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, result_id: resultId }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <div className="relative">
      {status === "sent" ? (
        <div className="inline-flex items-center gap-2 rounded-full bg-[#3ED6A3]/20 px-4 py-2.5 text-sm font-medium text-[#3ED6A3]">
          ✓ Reco envoyée !
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-32 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 outline-none transition focus:border-[#FF6B5F]/50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!email || !email.includes("@")}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#0E1020] transition hover:bg-white/90 disabled:opacity-40"
          >
            ✉️ Envoyer
          </button>
        </div>
      )}
      {status === "error" && (
        <p className="absolute -bottom-5 left-0 text-[10px] text-[#FF6B5F]">
          Erreur d&apos;envoi
        </p>
      )}
    </div>
  );
}
