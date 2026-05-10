"use client";

import * as React from "react";

type ScoreBadgeSize = "sm" | "md" | "lg";

export interface ScoreBadgeProps {
  score: number;
  size?: ScoreBadgeSize;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "#10b981";
  if (score >= 75) return "#3b82f6";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

const SIZE_MAP: Record<ScoreBadgeSize, { px: number; font: number; borderW: number }> = {
  sm: { px: 40, font: 12, borderW: 3 },
  md: { px: 56, font: 16, borderW: 4 },
  lg: { px: 72, font: 20, borderW: 5 },
};

export function ScoreBadge({
  score,
  size = "md",
  className = "",
}: ScoreBadgeProps): React.JSX.Element {
  const safeScore = Math.min(100, Math.max(0, Math.round(isNaN(score) ? 0 : score)));
  const config = SIZE_MAP[size];
  const color = getScoreColor(safeScore);
  const tooltipText = "Score Troviio : pertinence pour VOTRE situation";

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-extrabold leading-none ${className}`}
      style={{
        width: config.px,
        height: config.px,
        border: `${config.borderW}px solid ${color}`,
        color,
        fontSize: config.font,
        fontFamily: "'Inter', 'Nunito', sans-serif",
        backgroundColor: "transparent",
      }}
      role="img"
      aria-label={`Score Troviio : ${safeScore}/100`}
      title={tooltipText}
    >
      <span>{safeScore}</span>
    </div>
  );
}

export default ScoreBadge;
