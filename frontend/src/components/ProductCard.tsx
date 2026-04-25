"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ScoreRing } from "./ScoreRing";

export type ProductCategory =
  | "robot_aspirateur"
  | "tv_oled"
  | "machine_cafe"
  | "electromenager"
  | "generic";

export interface ProductCriterion {
  key: string;
  label: string;
  score: number; // 0-100
}

export interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  imageUrl: string;
  score: number;           // 0-100
  criteria: ProductCriterion[];
  amazonPrice?: string;
  amazonUrl?: string;
  isLoading?: boolean;
  className?: string;
  onAnalyze?: (id: string) => void;
}

const CATEGORY_META: Record<ProductCategory, { label: string; icon: string; gradient: string }> = {
  robot_aspirateur: {
    label: "Robot Aspirateur",
    icon: "🤖",
    gradient: "linear-gradient(135deg, #4257FF 0%, #3ED6A3 100%)"
  },
  tv_oled: {
    label: "TV OLED",
    icon: "📺",
    gradient: "linear-gradient(135deg, #161827 0%, #4257FF 100%)"
  },
  machine_cafe: {
    label: "Machine à Café",
    icon: "☕",
    gradient: "linear-gradient(135deg, #FF6B5F 0%, #FFB020 100%)"
  },
  electromenager: {
    label: "Électroménager",
    icon: "⚡",
    gradient: "linear-gradient(135deg, #4257FF 0%, #8C98FF 100%)"
  },
  generic: {
    label: "Maison",
    icon: "🏡",
    gradient: "linear-gradient(135deg, #FF6B5F 0%, #3ED6A3 100%)"
  }
};

function getProgressColor(score: number): string {
  if (score < 60) return "#FF6B5F";
  if (score <= 75) return "#FFB347";
  return "#3ED6A3";
}

function ProductCardSkeleton(): React.JSX.Element {
  return (
    <article style={{
      overflow: "hidden",
      borderRadius: 24,
      border: "1px solid #EFE3D6",
      background: "#FFFFFF"
    }}>
      <div style={{
        width: "100%", aspectRatio: "4/3",
        background: "linear-gradient(90deg, #FFE8C9 0%, #FFF7ED 50%, #FFE8C9 100%)",
        backgroundSize: "200% 100%",
        animation: "picksy-shimmer 1.5s ease-in-out infinite"
      }} />
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        {[80, 60, 40].map((w, i) => (
          <div key={i} style={{
            height: i === 0 ? 22 : 14,
            width: `${w}%`,
            borderRadius: 6,
            background: "linear-gradient(90deg, #FFE8C9 0%, #FFF7ED 50%, #FFE8C9 100%)",
            backgroundSize: "200% 100%",
            animation: "picksy-shimmer 1.5s ease-in-out infinite"
          }} />
        ))}
      </div>
    </article>
  );
}

export function ProductCard({
  id, name, brand, category, imageUrl, score,
  criteria, amazonPrice, amazonUrl, isLoading = false,
  className, onAnalyze
}: ProductCardProps): React.JSX.Element {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.generic;
  const topCriteria = [...criteria].slice(0, 3);

  if (isLoading) return <ProductCardSkeleton />;

  return (
    <motion.article
      className={className}
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -6, scale: 1.018,
        boxShadow: "0 24px 64px -16px rgba(22,24,39,0.18), 0 0 34px rgba(255,107,95,0.26)"
      }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      style={{
        position: "relative", overflow: "hidden",
        borderRadius: 24,
        border: "1px solid #EFE3D6",
        background: "radial-gradient(circle at top left, rgba(255,107,95,0.08), transparent 40%), #FFFFFF",
        boxShadow: "0 12px 32px -8px rgba(22,24,39,0.12)"
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "#FFF7ED" }}>
        <Image src={imageUrl} alt={`${name} par ${brand}`} fill style={{ objectFit: "cover" }} />
        {/* Category Badge */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 32, padding: "0 12px",
          borderRadius: 9999,
          background: meta.gradient,
          color: "#FFFFFF",
          fontFamily: "'Inter', sans-serif",
          fontSize: 12, fontWeight: 800,
          boxShadow: "0 4px 12px rgba(22,24,39,0.2)"
        }}>
          <span>{meta.icon}</span>
          <span>{meta.label}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 16, display: "grid", gap: 14 }}>
        {/* Header: Name + Score */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start" }}>
          <div>
            <h3 style={{
              margin: 0,
              fontFamily: "'Sora', sans-serif",
              fontSize: 18, fontWeight: 700,
              color: "#161827", lineHeight: "24px",
              letterSpacing: "-0.02em"
            }}>{name}</h3>
            <p style={{
              margin: "4px 0 0",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13, fontWeight: 600,
              color: "#7F7A76"
            }}>{brand}</p>
          </div>
          <ScoreRing score={score} size="md" />
        </div>

        {/* Criteria */}
        <div style={{ display: "grid", gap: 10 }}>
          {topCriteria.map((criterion) => {
            const c = Math.min(100, Math.max(0, Math.round(criterion.score)));
            const pc = getProgressColor(c);
            return (
              <div key={criterion.key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#5C5A57" }}>
                    {criterion.label}
                  </span>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 800, color: pc }}>
                    {c}
                  </span>
                </div>
                <div style={{ height: 7, borderRadius: 9999, background: "#FFF7ED", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c}%` }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                    style={{ height: "100%", borderRadius: 9999, background: pc, boxShadow: `0 0 12px ${pc}` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Price + IA label */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {amazonPrice && amazonUrl ? (
            <a href={amazonUrl} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              textDecoration: "none",
              fontFamily: "'Nunito', sans-serif",
              fontSize: 18, fontWeight: 800, color: "#161827"
            }}>
              {amazonPrice}
              <span style={{ color: "#FF6B5F", fontSize: 14 }}>↗</span>
            </a>
          ) : (
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#AFA79F", fontWeight: 600 }}>
              Prix à confirmer
            </span>
          )}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontFamily: "'Inter', sans-serif",
            fontSize: 11, fontWeight: 800,
            color: "#3ED6A3",
            letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}>
            <span>●</span> IA vérifiée
          </span>
        </div>

        {/* CTA */}
        <motion.button
          type="button"
          onClick={() => onAnalyze?.(id)}
          whileTap={{ scale: 0.98 }}
          whileHover={{ boxShadow: "0 14px 30px rgba(255,107,95,0.38)" }}
          transition={{ duration: 0.15 }}
          style={{
            width: "100%", minHeight: 48,
            border: 0, borderRadius: 9999,
            background: "linear-gradient(135deg, #FF6B5F 0%, #FFB067 100%)",
            color: "#FFFFFF", cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            fontSize: 15, fontWeight: 700,
            letterSpacing: "-0.01em",
            boxShadow: "0 6px 20px rgba(255,107,95,0.28)"
          }}
        >
          Voir l'analyse IA ✨
        </motion.button>
      </div>
    </motion.article>
  );
}

export default ProductCard;