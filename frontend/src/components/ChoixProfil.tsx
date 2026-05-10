"use client";

import * as React from "react";

export interface ChoixProfilProps {
  produitNom: string;
  acheterSi: string[];
  eviterSi: string[];
}

export function ChoixProfil({
  produitNom,
  acheterSi,
  eviterSi,
}: ChoixProfilProps): React.JSX.Element {
  return (
    <section
      className="rounded-2xl border p-5 sm:p-6 lg:p-8"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <h2
        className="text-xl sm:text-2xl font-bold mb-6"
        style={{ color: "var(--text)" }}
      >
        🎯 Ce produit est-il fait pour vous&nbsp;?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Acheter si */}
        <div
          className="rounded-xl border p-4 sm:p-5"
          style={{
            borderColor: "rgba(16, 185, 129, 0.25)",
            backgroundColor: "rgba(16, 185, 129, 0.06)",
          }}
        >
          <h3
            className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2"
            style={{ color: "#10b981" }}
          >
            ✅ Choisissez le {produitNom} si…
          </h3>
          <ul className="space-y-2.5">
            {acheterSi.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed"
                style={{ color: "var(--text)" }}
              >
                <span
                  className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#10b981" }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Eviter si */}
        <div
          className="rounded-xl border p-4 sm:p-5"
          style={{
            borderColor: "rgba(239, 68, 68, 0.25)",
            backgroundColor: "rgba(239, 68, 68, 0.06)",
          }}
        >
          <h3
            className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2"
            style={{ color: "#ef4444" }}
          >
            ❌ Passez votre chemin si…
          </h3>
          <ul className="space-y-2.5">
            {eviterSi.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed"
                style={{ color: "var(--text)" }}
              >
                <span
                  className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#ef4444" }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ChoixProfil;
