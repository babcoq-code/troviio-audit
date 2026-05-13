"use client";

import Link from "next/link";

export default function RecoExample() {
  return (
    <section id="reco-example" className="px-4 py-16 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg)" }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--coral)" }}>
            Exemple de recommandation
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text)" }}>
            Cas réel : <span style={{ color: "var(--text-muted)" }}>Casque audio pour open space, max 200€</span>
          </h2>
        </div>

        <div className="rounded-2xl border p-6 sm:p-8"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface, #111113)" }}>

          {/* En-tête */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                Troviio recommande
              </p>
              <h3 className="text-xl font-bold" style={{ color: "var(--text)" }}>
                Sony WH-CH720N
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Casque Bluetooth à réduction de bruit</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Troviio Score</p>
                <p className="text-2xl font-black" style={{ color: "var(--coral)" }}>87<span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>/100</span></p>
              </div>
            </div>
          </div>

          {/* Points forts / faibles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(62,214,163,0.08)", border: "1px solid rgba(62,214,163,0.2)" }}>
              <p className="text-xs font-bold mb-2" style={{ color: "var(--mint, #3ED6A3)" }}>✅ Points forts</p>
              <ul className="space-y-1.5 text-sm" style={{ color: "var(--text)" }}>
                <li>Réduction de bruit excellente pour le prix</li>
                <li>Confort longue durée validé</li>
                <li>Autonomie de 50h</li>
              </ul>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,107,95,0.08)", border: "1px solid rgba(255,107,95,0.2)" }}>
              <p className="text-xs font-bold mb-2" style={{ color: "var(--coral)" }}>⚠️ À savoir</p>
              <ul className="space-y-1.5 text-sm" style={{ color: "var(--text)" }}>
                <li>Micro correct mais pas professionnel</li>
                <li>Pas de connexion multipoint</li>
                <li>Design plastique basique</li>
              </ul>
            </div>
          </div>

          {/* Alternatives */}
          <div className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: "rgba(66,87,255,0.06)", border: "1px solid rgba(66,87,255,0.15)" }}>
            <p className="text-xs font-bold mb-2" style={{ color: "#4257FF" }}>🔄 Alternatives</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(62,214,163,0.15)", color: "var(--mint, #3ED6A3)" }}>Budget</span>
                <span style={{ color: "var(--text)" }}>Anker Soundcore Q30</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>79€</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(255,107,95,0.15)", color: "var(--coral)" }}>Premium</span>
                <span style={{ color: "var(--text)" }}>Bose QC Ultra</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>349€</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a href="#hero"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #FF6B5F 0%, #3ED6A3 100%)" }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
              }}>
              🎯 Obtenir MA recommandation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
