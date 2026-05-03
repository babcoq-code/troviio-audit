"use client";

import * as React from "react";

export interface TroviioScoreProps {
  score: number;
  explanation?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showExplanation?: boolean;
}

const SIZE_CONFIG = {
  sm: { pixels: 72, strokeWidth: 5, fontSize: 22, ringFontSize: 9 },
  md: { pixels: 100, strokeWidth: 7, fontSize: 32, ringFontSize: 11 },
  lg: { pixels: 140, strokeWidth: 9, fontSize: 44, ringFontSize: 13 },
};

function getScoreTier(score: number): { label: string; color: string; emoji: string } {
  if (score >= 90) return { label: "Coup de foudre", color: "#FF6B5F", emoji: "🔥" };
  if (score >= 75) return { label: "Âme sœur", color: "#4257FF", emoji: "💙" };
  if (score >= 60) return { label: "Belle rencontre", color: "#3ED6A3", emoji: "💚" };
  if (score >= 40) return { label: "Ça peut le faire", color: "#FFB347", emoji: "🧡" };
  return { label: "À voir", color: "#FF6B5F", emoji: "🤔" };
}

export function TroviioScore({
  score,
  explanation,
  size = "md",
  className = "",
  showExplanation = true,
}: TroviioScoreProps): React.JSX.Element {
  const safeScore = Math.min(100, Math.max(0, Math.round(isNaN(score) ? 0 : score)));
  const config = SIZE_CONFIG[size];
  const tier = getScoreTier(safeScore);
  const radius = (config.pixels - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;
  const gradientId = `troviio-grad-${safeScore}-${size}`;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {/* Cercle */}
      <div
        role="img"
        aria-label={`Troviio Score : ${safeScore}/100 — ${tier.label}`}
        style={{
          position: "relative",
          width: config.pixels,
          height: config.pixels,
          display: "inline-grid",
          placeItems: "center",
        }}
      >
        <svg
          width={config.pixels}
          height={config.pixels}
          viewBox={`0 0 ${config.pixels} ${config.pixels}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={tier.color} />
              <stop offset="100%" stopColor={tier.color} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Cercle de fond */}
          <circle
            cx={config.pixels / 2}
            cy={config.pixels / 2}
            r={radius}
            fill="none"
            stroke={tier.color}
            strokeWidth={config.strokeWidth}
            opacity="0.12"
          />
          {/* Cercle de progression */}
          <circle
            cx={config.pixels / 2}
            cy={config.pixels / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)", transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        </svg>
        {/* Score au centre */}
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <span
            style={{
              color: tier.color,
              fontFamily: "'Sora', 'Inter', sans-serif",
              fontSize: config.fontSize,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {safeScore}
          </span>
        </div>
      </div>

      {/* Label du tier */}
      <span
        className="mt-1.5 font-sora text-xs font-bold tracking-tight"
        style={{ color: tier.color }}
      >
        {tier.emoji} {tier.label}
      </span>

      {/* Explication */}
      {showExplanation && explanation && (
        <p
          className="mt-2 text-center text-xs leading-relaxed"
          style={{ color: "var(--text-muted)", maxWidth: 200 }}
        >
          {explanation}
        </p>
      )}
    </div>
  );
}

export default TroviioScore;
