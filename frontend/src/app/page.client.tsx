"use client";

import { useCallback, useState } from "react";
import { useHistory } from "@/hooks/useHistory";
import HistorySidebar from "@/components/HistorySidebar";
import StarterPrompts from "@/components/StarterPrompts";
import ChatHero from "@/components/ChatHero";
import CategoryGrid from "@/components/CategoryGrid";
import Top3Home from "@/components/Top3Home";
import QuickMatch from "@/components/QuickMatch";
import RecentTests from "@/components/RecentTests";
import SearchOmnibox from "@/components/SearchOmnibox";
import NewsletterSignup from "@/components/NewsletterSignup";
import TrustCounter from "@/components/TrustCounter";
import HowItWorks from "@/components/HowItWorks";
import WhyTroviio from "@/components/WhyTroviio";
import RecoExample from "@/components/RecoExample";

export default function HomePageClient() {
  const { history, loaded, remove, clear } = useHistory();
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  return (
    <>
      {/* Section 1 — HERO : Promesse → Action */}
      <section id="hero" className="relative isolate flex min-h-[90vh] w-full items-center justify-center overflow-hidden px-4 pt-24 pb-12 sm:px-6 lg:px-8"
        style={{ backgroundColor: "var(--bg)" }}>
        <div className="pointer-events-none absolute inset-0 -z-10 troviio-hero-radial" />
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" style={{ backgroundColor: "var(--coral)", opacity: 0.13 }} />
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(to right, transparent, var(--coral), transparent)", opacity: 0.35 }} />
        </div>

        <div className="mx-auto w-full max-w-4xl flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-xl"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text)" }}>
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#22C55E", boxShadow: "0 0 12px rgba(34,197,94,0.9)" }} />
            IA d&apos;aide à l&apos;achat · Gratuit · Sans inscription
          </div>

          {/* Tagline */}
          <h1 className="text-balance text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Sora', sans-serif", lineHeight: 0.92, color: "var(--text)" }}>
            Pas le meilleur.<br />
            <span style={{ color: "var(--coral)" }}>Le tien.</span>
          </h1>

          {/* Sous-titre */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-7" style={{ color: "var(--text-muted)" }}>
            Décrivez votre besoin, votre budget et vos contraintes.
            Troviio pose les bonnes questions, analyse 1000+ avis vérifiés
            et vous donne <strong>une recommandation claire</strong> en 2 minutes.
          </p>

          {/* Champ principal — délégué à ChatHero */}
          <ChatHero />

          {/* Trust pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>✅ Sans inscription</span>
            <span>🔍 Résultat clair</span>
            <span>🔒 Données privées</span>
          </div>

          {/* Lien secondaire — Voir un exemple */}
          <p className="mt-4 text-center">
            <a href="#reco-example" className="text-sm font-semibold underline underline-offset-4 decoration-dotted transition-colors"
              style={{ color: "var(--coral)" }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("reco-example")?.scrollIntoView({ behavior: "smooth" });
              }}>
              Voir un exemple de recommandation →
            </a>
          </p>

          {/* Recherche directe */}
          <div className="mt-6 w-full max-w-lg">
            <SearchOmnibox />
          </div>
        </div>
      </section>

      {/* Section 2 — PROMPTS GUIDÉS */}
      <StarterPrompts />

      {/* Section 3 — COMMENT ÇA MARCHE */}
      <HowItWorks />

      {/* Section 4 — TOP 5 HOME */}
      <Top3Home />

      {/* Section 5 — QUICK MATCH */}
      <QuickMatch />

      {/* Section 6 — EXEMPLE DE RECOMMANDATION */}
      <RecoExample />

      {/* Section 7 — CATÉGORIES POPULAIRES */}
      <CategoryGrid />

      {/* Section 8 — POURQUOI TROVIIO */}
      <WhyTroviio />

      {/* Section 9 — NEWSLETTER */}
      <NewsletterSignup />

      {/* Section 10 — RECENT TESTS */}
      <RecentTests />

      {/* Section 11 — TRUST COUNTER */}
      <TrustCounter />

      {/* Historique des recherches */}
      {loaded && history.results.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <HistorySidebar
            items={history.results}
            onRemove={remove}
            onClear={clear}
            position="cards"
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
          />
        </div>
      )}
    </>
  );
}
