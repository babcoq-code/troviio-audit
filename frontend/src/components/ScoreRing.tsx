// ============================================================
// PICKSY — REACT COMPONENTS (TypeScript + Framer Motion)
// Fichier : ScoreRing.tsx + ProductCard.tsx
// Usage : Next.js 15 / React 19
// ============================================================

"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

type ScoreRingSize = "sm" | "md" | "lg";

export interface ScoreRingProps {
  score: number;          // 0-100
  size?: ScoreRingSize;
  label?: string;
  showLabel?: boolean;
  className?: string;
  duration?: number;
  strokeWidth?: number;
}

interface SizeConfig {
  pixels: number;
  strokeWidth: number;
  fontSize: number;
  labelSize: number;
}

const SIZE_CONFIG: Record<ScoreRingSize, SizeConfig> = {
  sm: { pixels: 40, strokeWidth: 4, fontSize: 14, labelSize: 0 },
  md: { pixels: 64, strokeWidth: 6, fontSize: 22, labelSize: 9 },
  lg: { pixels: 120, strokeWidth: 9, fontSize: 36, labelSize: 11 }
};

function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function getScoreColor(score: number): string {
  if (score < 40) return "#FF6B5F";   // Coral — À éviter
  if (score < 60) return "#FFB347";   // Amber — Correct
  if (score < 80) return "#4257FF";   // Blue — Bon choix
  return "#3ED6A3";                   // Mint — Excellent
}

export function ScoreRing({
  score,
  size = "md",
  label = "Picksy",
  showLabel = true,
  className,
  duration = 0.8,
  strokeWidth
}: ScoreRingProps): React.JSX.Element {
  const safeScore = clampScore(score);
  const config = SIZE_CONFIG[size];
  const actualSW = strokeWidth ?? config.strokeWidth;
  const radius = (config.pixels - actualSW) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(safeScore);
  const uniqueId = React.useId();

  const progress = useMotionValue(0);
  const [displayScore, setDisplayScore] = React.useState(0);

  React.useEffect(() => {
    const unsub = useMotionValue(0).on("change", () => {});
    const ctrl = animate(progress, safeScore, {
      duration,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (latest) => setDisplayScore(Math.round(latest))
    });
    return () => ctrl.stop();
  }, [safeScore, duration]);

  const strokeDashoffset = useTransform(progress, (v) =>
    circumference * (1 - clampScore(v) / 100)
  );

  return (
    <div
      className={className}
      style={{ position: "relative", width: config.pixels, height: config.pixels, display: "inline-grid", placeItems: "center" }}
      role="img"
      aria-label={`Score Picksy : ${safeScore}/100`}
    >
      {/* Glow effect */}
      <div style={{
        position: "absolute",
        inset: "15%",
        borderRadius: "9999px",
        background: color,
        opacity: 0.18,
        filter: "blur(12px)",
        animation: "picksy-pulse-glow 2.4s ease-in-out infinite"
      }} />

      <motion.svg
        width={config.pixels}
        height={config.pixels}
        viewBox={`0 0 ${config.pixels} ${config.pixels}`}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id={`grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={config.pixels / 2} cy={config.pixels / 2} r={radius}
          fill="none" stroke="#EFE3D6" strokeWidth={actualSW} opacity="0.7"
        />

        {/* Fill */}
        <motion.circle
          cx={config.pixels / 2} cy={config.pixels / 2} r={radius}
          fill="none"
          stroke={`url(#grad-${uniqueId})`}
          strokeWidth={actualSW}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset,
            rotate: -90,
            transformOrigin: "50% 50%"
          }}
        />

        {/* Inner background */}
        <circle
          cx={config.pixels / 2} cy={config.pixels / 2}
          r={Math.max(0, radius - actualSW - 1)}
          fill="var(--picksy-surface, #FFFFFF)" opacity="0.9"
        />
      </motion.svg>

      {/* Score text */}
      <div style={{
        position: "absolute", inset: 0,
        display: "grid", placeItems: "center",
        textAlign: "center", pointerEvents: "none"
      }}>
        <div>
          <motion.span
            key={safeScore}
            initial={{ y: 4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              display: "block",
              color,
              fontFamily: "'Nunito', 'Inter', sans-serif",
              fontSize: config.fontSize,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1
            }}
          >
            {displayScore}
          </motion.span>
          {showLabel && size !== "sm" && (
            <span style={{
              display: "block",
              color: "#7F7A76",
              fontFamily: "'Inter', sans-serif",
              fontSize: config.labelSize,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginTop: 2
            }}>
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScoreRing;