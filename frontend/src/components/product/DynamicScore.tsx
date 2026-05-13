'use client';

import { useEffect, useState } from 'react';

interface DynamicScoreProps {
  slug: string;
  fallback: number;
  className?: string;
  /** Si true, affiche "XX/100". Sinon juste le nombre */
  format?: 'number' | 'fraction';
  /** Couleur selon le score */
  colorize?: boolean;
}

// Cache en mémoire pour éviter les appels répétés
const scoreCache = new Map<string, number>();

export function DynamicScore({
  slug,
  fallback,
  className = '',
  format = 'fraction',
  colorize = true,
}: DynamicScoreProps) {
  const [score, setScore] = useState<number>(scoreCache.get(slug) ?? fallback);
  const [loading, setLoading] = useState(!scoreCache.has(slug));

  useEffect(() => {
    if (scoreCache.has(slug)) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    fetch(`/api/products/${slug}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        const s = data?.estimated_score;
        if (typeof s === 'number' && s > 0) {
          const computed = Math.round(s * 10); // la DB stocke en /10, on veut /100
          scoreCache.set(slug, computed);
          setScore(computed);
        }
      })
      .catch(() => {
        // Garde le fallback
      })
      .finally(() => setLoading(false));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [slug, fallback]);

  const displayScore = loading ? null : score;

  const getColor = (s: number) => {
    if (!colorize) return 'text-[#8B8FA3]';
    if (s >= 85) return 'text-[#3ED6A3]';
    if (s >= 70) return 'text-[#FF6B5F]';
    return 'text-[#9CA3AF]';
  };

  if (format === 'number') {
    return (
      <span
        className={`${getColor(score)} ${className} ${loading ? 'opacity-50' : ''}`}
        title={`Score Troviio${loading ? ' (chargement...)' : ''}`}
      >
        {displayScore ?? fallback}
      </span>
    );
  }

  return (
    <span
      className={`${getColor(score)} ${className} ${loading ? 'opacity-50' : ''}`}
      title={`Score Troviio${loading ? ' (chargement...)' : ''}`}
    >
      {displayScore ?? fallback}/100
    </span>
  );
}
