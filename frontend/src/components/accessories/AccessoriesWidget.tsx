'use client';

import { useEffect, useState, useMemo } from 'react';

interface AccessoryData {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  description: string | null;
  scoreQuality: number;
  bestPrice: { price: number; url: string; affiliateUrl: string; merchantName: string } | null;
}

interface ApiResponse {
  product: { id: string; slug: string; name: string; brand: string | null };
  accessories: AccessoryData[];
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}>
      <div className="h-6 w-3/4 rounded bg-white/10 mb-3" />
      <div className="h-10 w-full rounded bg-white/10 mb-2" />
      <div className="h-4 w-1/2 rounded bg-white/10" />
    </div>
  );
}

export default function AccessoriesWidget({ productId, productName }: { productId: string; productName: string }) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/accessories/for-product/${productId}`, { signal: controller.signal })
      .then((r) => r.json())
      .then(setData)
      .catch(() => null)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [productId]);

  const displayed = useMemo(() => data?.accessories.slice(0, 3) || [], [data]);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">🛒 Accessoires recommandés</h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!data || displayed.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">🛒 Accessoires recommandés pour {productName}</h2>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((acc) => {
          const bestPrice = acc.bestPrice;
          const offerUrl = bestPrice?.affiliateUrl || bestPrice?.url || '#';
          return (
            <a
              key={acc.id}
              href={offerUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="rounded-xl sm:rounded-2xl border p-4 transition hover:-translate-y-1 hover:opacity-90 block"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
            >
              <div className="text-xs font-bold uppercase tracking-wide truncate" style={{ color: "var(--coral)" }}>
                {acc.brand || "Accessoire"}
              </div>
              <div className="mt-1 text-sm sm:text-base font-bold leading-tight line-clamp-2">
                {acc.name}
              </div>
              {acc.description && (
                <div className="mt-1 text-xs sm:text-sm leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
                  {acc.description}
                </div>
              )}
              {bestPrice?.affiliateUrl && (
                <div className="mt-2 font-bold text-sm sm:text-base" style={{ color: "var(--mint)" }}>
                  <a
                    href={bestPrice.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#ff6b2b] px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#e55a1f]"
                  >
                    Voir sur {bestPrice.merchantName || "le marchand"} →
                  </a>
                </div>
              )}
              {acc.scoreQuality > 0 && (
                <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  Note qualité: {acc.scoreQuality}/10
                </div>
              )}
              <div className="mt-2 text-xs sm:text-sm font-bold" style={{ color: "var(--coral)" }}>
                Voir l'offre →
              </div>
            </a>
          );
        })}
      </div>
      {data.accessories.length > 3 && (
        <div className="mt-4 text-center">
          <a
            href={`/accessoires/pour/${data.product.slug}`}
            className="inline-flex items-center justify-center rounded-xl sm:rounded-full px-6 py-3 text-sm font-bold text-white transition hover:opacity-80"
            style={{ backgroundColor: "var(--coral)" }}
          >
            Voir les {data.accessories.length} accessoires compatibles →
          </a>
        </div>
      )}
    </div>
  );
}
