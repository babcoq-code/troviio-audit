"use client";

import * as React from "react";
import Link from "next/link";
import { ScoreBadge } from "@/components/ScoreBadge";

export interface PodiumProduct {
  id: string;
  nom: string;
  imageUrl: string;
  score: number;
  bestPrice: number;
  slug: string;
  pros: string[];
  affiliateUrl?: string;
}

export interface Top3PodiumProps {
  produits: PodiumProduct[];
}

export function Top3Podium({
  produits,
}: Top3PodiumProps): React.JSX.Element {
  // On attend exactement 3 produits classés par ordre de pertinence
  // Index 0 = #1 (centre), Index 1 = #2 (gauche), Index 2 = #3 (droite)
  if (!produits || produits.length < 3) return <></>;

  const [first, second, third] = produits;

  const PodiumCard = ({
    produit,
    rank,
    isCenter,
  }: {
    produit: PodiumProduct;
    rank: number;
    isCenter: boolean;
  }) => (
    <div
      className={`group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
        isCenter
          ? "scale-[1.04] sm:scale-[1.06] border-[#FF6B5F] shadow-lg shadow-[#FF6B5F]/10"
          : "border-white/10 hover:border-white/20"
      }`}
      style={{
        backgroundColor: "var(--bg-surface)",
      }}
    >
      {/* Rank badge */}
      <div
        className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold ${
          isCenter
            ? "bg-[#FF6B5F] text-white shadow-md shadow-[#FF6B5F]/30"
            : rank === 2
            ? "bg-white/10 text-[#9CA3AF]"
            : "bg-white/10 text-[#9CA3AF]"
        }`}
      >
        #{rank}
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        <img
          src={produit.imageUrl}
          alt={produit.nom}
          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        {/* Header: name + score */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-bold leading-tight ${
              isCenter ? "text-base sm:text-lg" : "text-sm sm:text-base"
            }`}
            style={{ color: "var(--text)" }}
          >
            {produit.nom}
          </h3>
          <ScoreBadge score={produit.score} size="sm" className="shrink-0" />
        </div>

        {/* Price */}
        <p
          className="text-lg sm:text-xl font-extrabold"
          style={{ color: "var(--text)" }}
        >
          {produit.bestPrice.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          })}
        </p>

        {/* Pros (max 3) */}
        <ul className="space-y-1.5 flex-1">
          {produit.pros.slice(0, 3).map((pro, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              <span
                className="mt-0.5 shrink-0 w-1 h-1 rounded-full"
                style={{ backgroundColor: "#3ED6A3" }}
              />
              <span>{pro}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={produit.affiliateUrl || "#"}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block w-full text-center rounded-full py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
          style={{
            backgroundColor: "#FF6B5F",
            color: "#fff",
          }}
        >
          Voir le meilleur prix →
        </a>

        {/* Full review link */}
        <Link
          href={`/produit/${produit.slug}`}
          className="block text-center text-xs sm:text-sm underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: "var(--text-muted)" }}
        >
          Voir la fiche complète →
        </Link>
      </div>
    </div>
  );

  return (
    <section
      className="rounded-2xl border p-5 sm:p-6 lg:p-8"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <h2
        className="text-xl sm:text-2xl font-bold text-center mb-2"
        style={{ color: "var(--text)" }}
      >
        🏆 Le Top 3 Troviio
      </h2>
      <p
        className="text-sm text-center mb-8"
        style={{ color: "var(--text-muted)" }}
      >
        Notre sélection des 3 meilleurs produits, basée sur notre analyse
        indépendante
      </p>

      {/* Podium layout: 2nd (left), 1st (center), 3rd (right) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 lg:gap-5 items-start max-w-5xl mx-auto">
        {/* #2 – Left */}
        <div className="relative mt-4 sm:mt-8">
          <PodiumCard produit={second} rank={2} isCenter={false} />
        </div>

        {/* #1 – Center */}
        <div className="relative z-10">
          <PodiumCard produit={first} rank={1} isCenter={true} />
        </div>

        {/* #3 – Right */}
        <div className="relative mt-4 sm:mt-12">
          <PodiumCard produit={third} rank={3} isCenter={false} />
        </div>
      </div>
    </section>
  );
}

export default Top3Podium;
