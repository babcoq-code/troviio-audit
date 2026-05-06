'use client';

import { useEffect, useMemo, useState } from 'react';
import { AccessoriesChat } from './AccessoriesChat';
import type { Accessory } from '@/lib/types/accessories';

interface AccessoriesForProductResponse {
  product: { id: string; slug: string; name: string; brand: string | null; model: string | null };
  accessories: Accessory[];
  dangerousCopyWarnings: { categorySlug: string; categoryName: string; warning: string }[];
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-white/10 bg-[var(--bg-surface)]">
      <div className="aspect-[4/3] bg-white/5" />
      <div className="space-y-4 p-5">
        <div className="h-5 w-32 rounded-full bg-white/10" />
        <div className="h-6 w-4/5 rounded bg-white/10" />
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-12 rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

export function AccessoriesTroviioWidget({
  productId, productSlug, productName,
}: {
  productId: string; productSlug: string; productName: string;
}) {
  const [data, setData] = useState<AccessoriesForProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const displayed = useMemo(() => data?.accessories.slice(0, 3) || [], [data]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/accessories/for-product/${productId}`, { signal: controller.signal })
      .then((r) => r.json()).then(setData).catch(() => null).finally(() => setLoading(false));
    return () => controller.abort();
  }, [productId]);

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-[var(--bg-surface)] p-6 shadow-xl">
        <div className="mb-6 h-8 w-80 animate-pulse rounded bg-white/10" />
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    );
  }

  if (!data || displayed.length === 0) return null;

  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--bg-surface)] p-6 shadow-xl">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#3ED6A3]">
            Accessoires recommandés
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Les meilleurs accessoires pour {productName}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C9CCDA]">
            Troviio sélectionne les accessoires certifiés et compatibles pour optimiser
            votre appareil. Chaque accessoire est noté et testé.
          </p>
        </div>
        <a
          href={`https://www.amazon.fr/s?k=${encodeURIComponent(productName + " accessoire")}&tag=troviio-21`}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          Voir tous les accessoires sur Amazon →
        </a>
      </div>

      {/* Avertissements copies dangereuses */}
      {(data.dangerousCopyWarnings?.length ?? 0) > 0 && (
        <div className="mb-6 rounded-3xl border border-[#FF6B5F]/25 bg-[#FF6B5F]/8 p-5">
          <h3 className="text-lg font-bold text-white">⚠️ Méfiez-vous des copies</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.dangerousCopyWarnings.map((w) => (
              <span
                key={w.categorySlug}
                title={w.warning}
                className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-[#FF6B5F] ring-1 ring-[#FF6B5F]/30"
              >
                {w.categoryName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grille d'accessoires */}
      <div className="grid gap-5 md:grid-cols-3">
        {displayed.map((acc) => (
          <AccessoryTroviio key={acc.id} accessory={acc} productId={productId} />
        ))}
      </div>

      {/* Chat accessoire IA */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3ED6A3]">
            💬 Posez une question sur les accessoires
          </p>
          <p className="mt-1 text-sm text-[#8B8FA3]">
            Filtre à eau, batterie, brosse… notre IA vous guide vers l'accessoire
            compatible avec votre appareil.
          </p>
        </div>
        <AccessoriesChat
          productId={productId}
          productName={productName}
        />
      </div>

      {data.accessories.length > 3 && (
        <div className="mt-7 text-center">
          <a
            href={`https://www.amazon.fr/s?k=${encodeURIComponent(productName + " accessoire")}&tag=troviio-21`}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4257FF] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#5870FF]"
          >
            Voir les {data.accessories.length} accessoires sur Amazon →
          </a>
        </div>
      )}
    </section>
  );
}

// ── Carte accessoire dark ──────────────────────────────────

function AccessoryTroviio({
  accessory, productId,
}: {
  accessory: Accessory; productId: string;
}) {
  const bestPrice = accessory.bestPrice;
  const offerUrl = bestPrice?.affiliateUrl || bestPrice?.url || '#';

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0E1020] transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Image */}
      <a
        href={offerUrl}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="relative block aspect-[4/3] overflow-hidden bg-[var(--bg-surface)]"
      >
        {accessory.imageUrl ? (
          <img
            src={accessory.imageUrl}
            alt={accessory.name}
            className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-bold text-[#8B8FA3]">
            {accessory.brand} {accessory.name?.[0]}
          </div>
        )}

        {/* Score */}
        {accessory.scoreQuality > 0 && (
          <div className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xs font-bold text-white backdrop-blur-sm">
            {Math.round(accessory.scoreQuality)}
          </div>
        )}
      </a>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#8B8FA3]">
          {accessory.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-white leading-tight">
          <a href={offerUrl} target="_blank" rel="nofollow sponsored noopener noreferrer" className="hover:text-[#3ED6A3] transition">
            {accessory.name}
          </a>
        </h3>

        {accessory.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8B8FA3]">
            {accessory.description}
          </p>
        )}

        {/* Prix */}
        <div className="mt-auto pt-4">
      <div className="mb-3 flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
            <div>
              <p className="text-xs text-[#8B8FA3]">Voir l'offre</p>
              {bestPrice?.affiliateUrl && (
                <a
                  href={bestPrice.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#ff6b2b] px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#e55a1f]"
                >
                  Chez {bestPrice.merchantName || "le marchand"} →
                </a>
              )}
              {!bestPrice?.affiliateUrl && (
                <p className="text-sm font-bold text-white">Voir les offres</p>
              )}
            </div>
          </div>

          <a
            href={offerUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[#4257FF] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#5870FF]"
          >
            Voir l'offre →
          </a>
        </div>
      </div>
    </article>
  );
}
