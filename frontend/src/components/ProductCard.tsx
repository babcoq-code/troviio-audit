// @ts-nocheck
"use client";

import { ScoreRing } from "./ScoreRing";
import ScoreBadge from "./ScoreBadge";
import AffiliateButton from "./product/AffiliateButton";

interface Props {
  product: any;
  rank?: number;
  isHero?: boolean;
}

export default function ProductCard({ product, rank, isHero }: Props) {
  const discount = (product as any).original_price_eur && product.price_eur
    ? Math.round((1 - product.price_eur / (product as any).original_price_eur) * 100)
    : 0;

  const reasons = product.pros?.slice(0, 3) || [];
  const score = (product as any).troviio_score || (product as any).estimated_score || 75;

  return (
    <article
      className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1
        ${
          isHero
            ? "bg-gradient-to-b from-[#FF6B5F]/[0.08] to-transparent border-[#FF6B5F]/30 md:scale-[1.02] shadow-2xl shadow-[#FF6B5F]/10"
            : "bg-white/[0.03] border-white/10 hover:border-white/20"
        }`}
    >
      {/* Badge Choix Troviio */}
      {isHero && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B5F] text-white text-xs font-semibold">
          ★ Choix Troviio
        </div>
      )}

      {/* Rank */}
      {rank !== undefined && (
        <div
          className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
            ${isHero ? "bg-white text-[#0E1020]" : "bg-white/10 text-white"}`}
        >
          #{rank}
        </div>
      )}

      {/* Image */}
      <div className="aspect-[4/3] bg-white/[0.02] flex items-center justify-center p-6">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="text-4xl text-white/20">📦</div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-white/40">
              {product.brand || product.category_name || ""}
            </p>
            <h3 className="text-base font-semibold text-white leading-tight mt-0.5 line-clamp-2">
              {product.name}
            </h3>
          </div>
          <ScoreRing score={score} size="sm" />
        </header>

        {/* 3 raisons personnalisées */}
        {reasons.length > 0 && (
          <ul className="space-y-1.5">
            {reasons.map((r: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-white/75"
              >
                <span className="text-[#3ED6A3] shrink-0">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Prix + promo */}
        <div className="flex items-baseline gap-2 pt-2">
          <span className="text-2xl font-bold text-white">
            {product.price_eur ? `${product.price_eur}€` : ""}
          </span>
          {discount > 0 && (
            <span className="text-xs font-semibold text-[#3ED6A3] bg-[#3ED6A3]/10 px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          {(product as any).price_min_eur && (product as any).price_min_eur !== product.price_eur && (
            <span className="text-xs text-white/40 line-through">
              {(product as any).price_min_eur}€
            </span>
          )}
        </div>

        {/* Stock hint */}
        {product.merchant_links && Array.isArray(product.merchant_links) && product.merchant_links.length > 0 && (
          <p className="text-xs text-[#FF6B5F]/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B5F] animate-pulse" />
            En stock sur {product.merchant_links.length} marchand
            {product.merchant_links.length > 1 ? "s" : ""}
          </p>
        )}

        {/* Affiliate button */}
        <AffiliateButton
          product={product as any}
          position={"catalogue" as any}
        />

        {/* Marchands alternatifs */}
        {product.merchant_links && Array.isArray(product.merchant_links) && product.merchant_links.length > 1 && (
          <details className="group">
            <summary className="cursor-pointer text-xs text-white/40 hover:text-white/70 list-none flex items-center gap-1">
              <span className="group-open:rotate-90 transition-transform">▸</span>
              Comparer {product.merchant_links.length - 1} autre
              marchand{product.merchant_links.length > 2 ? "s" : ""}
            </summary>
            <ul className="mt-2 space-y-1">
              {product.merchant_links.slice(1).map((m: any, i: number) => (
                <li key={i}>
                  <a
                    href={m.url || m.affiliate_url || "#"}
                    target="_blank"
                    rel="sponsored noopener"
                    className="flex justify-between text-xs text-white/60 hover:text-white px-2 py-1.5 rounded hover:bg-white/5 transition"
                  >
                    <span>{m.merchant || m.name}</span>
                    <span className="font-medium">
                      {m.price_eur ? `${m.price_eur}€` : ""}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* IA vérifiée badge */}
        <span className="block text-right text-[10px] font-bold text-[#3ED6A3] uppercase tracking-wider">
          ● IA vérifiée
        </span>
      </div>
    </article>
  );
}
