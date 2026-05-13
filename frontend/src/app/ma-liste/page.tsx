'use client';

import { useWishlist } from '@/components/product/useWishlist';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function MaListePage() {
  const { items, remove, count } = useWishlist();

  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Breadcrumbs
            crumbs={[
              { label: 'Accueil', href: '/' },
              { label: 'Ma liste' },
            ]}
          />
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">
              💜 Ma liste Troviio
            </h1>
            <p className="mt-4 text-lg leading-8 text-[#8B8FA3]">
              {count > 0
                ? `${count} produit${count > 1 ? 's' : ''} sauvegardé${count > 1 ? 's' : ''}`
                : 'Tu n\'as encore rien sauvegardé.'}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-6">🔍</p>
            <p className="text-xl text-[#8B8FA3] mb-2">Aucun produit sauvegardé</p>
            <p className="text-sm text-[#6B6F83] mb-8">
              Utilise le cœur ❤️ sur une fiche produit pour l&apos;ajouter à ta liste.
            </p>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-xl bg-[#4257FF] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3451E0] transition-colors"
            >
              Découvrir des produits →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const score = item.troviioScore;
              const scoreColor =
                score >= 85 ? 'text-[#3ED6A3]' : score >= 70 ? 'text-[#FF6B5F]' : 'text-[#9CA3AF]';

              return (
                <div
                  key={item.productId}
                  className="group rounded-2xl border border-white/5 bg-[#161827] p-5 hover:border-white/10 transition-all"
                >
                  <Link href={`/produit/${item.productSlug}`} className="block">
                    <div className="flex items-start gap-4">
                      {/* Image placeholder */}
                      <div className="h-16 w-16 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-[#6B6F83] uppercase tracking-wider">
                          {item.productBrand || 'Produit'}
                        </p>
                        <h3 className="font-semibold truncate">{item.productName}</h3>
                        <p className={`text-sm font-bold mt-1 ${scoreColor}`}>
                          {score}/100
                        </p>
                        {item.priceAtSave && (
                          <p className="text-xs text-[#6B6F83] mt-0.5">
                            {item.priceAtSave.toFixed(2)} €
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                    {item.categorySlug && (
                      <Link
                        href={`/c/${item.categorySlug}`}
                        className="text-xs text-[#4257FF] hover:underline"
                      >
                        Voir la catégorie
                      </Link>
                    )}
                    <button
                      onClick={() => remove(item.productId)}
                      className="text-xs text-[#6B6F83] hover:text-[#FF6B5F] transition-colors"
                    >
                      Retirer ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (confirm('Supprimer tous les produits de ta liste ?')) {
                  items.forEach((i) => remove(i.productId));
                }
              }}
              className="text-sm text-[#6B6F83] hover:text-[#FF6B5F] transition-colors underline underline-offset-2"
            >
              Vider la liste
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
