"use client";

import { useEffect, useState } from "react";

type AccessoryItem = {
  name: string;
  why: string;
  estimated_price: string;
  amazon_search_url: string;
  category: string;
};

type ProductAccessories = {
  product_name: string;
  accessories: AccessoryItem[];
};

type AccessoriesData = {
  accessories: ProductAccessories[];
};

export function ResultAccessories({ resultId }: { resultId: string }) {
  const [data, setData] = useState<AccessoriesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/results/${encodeURIComponent(resultId)}/accessories`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [resultId]);

  if (loading) return null;

  const accGroups = data?.accessories?.filter((g) => g.accessories?.length > 0);
  if (!accGroups || accGroups.length === 0) return null;

  return (
    <section className="mt-12">
      <p className="font-sora text-sm font-semibold uppercase tracking-[0.2em] text-[#FF6B5F]">
        Accessoires recommandés
      </p>
      <h2 className="mt-2 font-sora text-2xl font-bold tracking-tight sm:text-3xl">
        Pour aller plus loin… 🛠️
      </h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {accGroups.map((group) => (
          <div key={group.product_name} className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Pour</p>
            <p className="mt-1 font-sora text-lg font-bold" style={{ color: 'var(--text)' }}>{group.product_name}</p>
            <div className="mt-4 space-y-4">
              {group.accessories.slice(0, 3).map((acc, i) => (
                <div key={acc.name} className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{acc.name}</p>
                      <p className="mt-1 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{acc.why}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#FF6B5F]/10 px-2 py-0.5 text-xs font-bold text-[#FF6B5F]">
                      ~{acc.estimated_price}
                    </span>
                  </div>
                  <a
                    href={acc.amazon_search_url}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#FF6B5F] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#e55a4d]"
                  >
                    Voir sur Amazon →
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
