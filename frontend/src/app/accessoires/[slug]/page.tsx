import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import type { Accessory } from '@/lib/types/accessories';

export const revalidate = 3600;

export default async function AccessoryDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let accessory: Accessory | null = null;
  try {
    accessory = await apiFetch<Accessory>(`/api/accessories/${slug}`);
  } catch {
    notFound();
  }

  if (!accessory) notFound();

  const bestPrice = accessory.bestPrice;
  const offerUrl = bestPrice?.affiliateUrl || bestPrice?.url || '#';

  const BADGE_CONFIG: Record<string, { label: string }> = {
    official: { label: '🟢 Officiel' },
    recommended: { label: '🔵 Recommandé Troviio' },
    compatibility_warning: { label: '⚠️ Vérifier compatibilité' },
  };
  const badge = BADGE_CONFIG[accessory.qualityBadge] ?? { label: '🔵 Recommandé Troviio' };

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        {/* Fil d'Ariane */}
        <nav className="mb-6 text-xs font-bold uppercase tracking-wide text-stone-500">
          <Link href="/accessoires" className="hover:text-stone-800 transition-colors">Accessoires</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-800">{accessory.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Image */}
          <div className="flex items-center justify-center rounded-3xl bg-white p-8 ring-1 ring-stone-200">
            {accessory.imageUrl ? (
              <Image src={accessory.imageUrl} alt={accessory.name}
                width={400} height={400}
                className="max-h-80 w-auto object-contain" />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-2xl bg-stone-100 text-6xl text-stone-400">
                ?
              </div>
            )}
          </div>

          {/* Infos */}
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-stone-900 px-3 py-1 text-xs font-bold text-white">
                {badge.label}
              </span>
              {accessory.category?.name && (
                <span className="inline-flex items-center rounded-full bg-stone-200 px-3 py-1 text-xs font-bold text-stone-700">
                  {accessory.category.name}
                </span>
              )}
              {accessory.certifications?.slice(0, 2).map((cert: string) => (
                <span key={cert} className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-800">
                  {cert}
                </span>
              ))}
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-stone-500">{accessory.brand}</p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-stone-900">{accessory.name}</h1>

            {accessory.description && (
              <p className="mt-4 text-sm leading-7 text-stone-600">{accessory.description}</p>
            )}

            {accessory.hasDangerousCopies && (
              <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
                <p className="font-bold mb-1">⚠️ Attention aux copies non certifiées</p>
                <p>{accessory.whyAvoidCopies || 'Les contrefaçons peuvent présenter des risques pour vos appareils.'}</p>
              </div>
            )}

            {/* Prix et achat */}
            <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-stone-200">
              <p className="text-xs font-bold text-stone-500 mb-1">Meilleur prix</p>
              <p className="text-2xl font-bold text-stone-900">
                {bestPrice?.price
                  ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: bestPrice.currency || 'EUR' }).format(bestPrice.price)
                  : 'Prix indisponible'}
              </p>
              {bestPrice?.merchantName && (
                <p className="text-xs text-stone-500 mt-1">Chez {bestPrice.merchantName}</p>
              )}
              <a
                href={offerUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-stone-700"
              >
                Voir l&apos;offre
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
