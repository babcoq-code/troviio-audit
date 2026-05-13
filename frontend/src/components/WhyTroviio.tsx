"use client";

import Link from "next/link";

export default function WhyTroviio() {
  const points = [
    {
      emoji: "🎯",
      title: "Pas un Top 10 générique",
      desc: "On te recommande UN seul produit — celui qui correspond à TON usage, pas le mieux commissionné.",
    },
    {
      emoji: "📊",
      title: "Sources citées, données vérifiées",
      desc: "Chaque note est justifiée par des tests, des avis vérifiés et des fiches techniques officielles.",
    },
    {
      emoji: "🔗",
      title: "Liens marchands transparents",
      desc: "On touche une commission si tu achètes via nos liens, mais ça ne change jamais notre recommandation.",
    },
    {
      emoji: "🔒",
      title: "Zéro revente de données",
      desc: "Pas besoin de compte. Pas de tracking tiers. Tes recherches restent sur ton navigateur.",
    },
    {
      emoji: "🤖",
      title: "Indépendance absolue",
      desc: "Aucune marque ne paie pour être recommandée. Si un produit est mauvais, on le dit.",
    },
    {
      emoji: "💬",
      title: "T'as pas besoin de savoir prompter",
      desc: "Parle normalement. L'IA traduit tes mots en critères objectifs. ",
    },
  ];

  return (
    <section id="why-troviio" className="px-4 py-16 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg-surface, #111113)" }}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--coral)" }}>
            Pourquoi Troviio
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text)" }}>
            On ne compare pas les produits.<br />
            <span style={{ color: "var(--text-muted)" }}>On te trouve le tien.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {points.map((p, i) => (
            <div key={i} className="rounded-xl p-5 border transition-all hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
              <div className="text-2xl mb-3">{p.emoji}</div>
              <h3 className="font-bold text-sm mb-1.5" style={{ color: "var(--text)" }}>{p.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/methode"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: "var(--coral)" }}>
            📖 Voir notre méthode complète →
          </Link>
        </div>
      </div>
    </section>
  );
}
