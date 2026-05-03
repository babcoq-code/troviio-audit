"use client";

import { useEffect, useState } from "react";
import { PriceChart } from "./PriceChart";

export function PriceChartWrapper({ slug }: { slug: string }) {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    fetch(`/api/products/${slug}/price-history`)
      .then((r) => r.json())
      .then((d) => setData(d.history || d || []))
      .catch(() => setData([]));
  }, [slug]);

  if (data === null) {
    return <div className="h-64 rounded-3xl bg-stone-100 animate-pulse" />;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-stone-300 text-sm text-stone-500">
        L&apos;historique sera disponible après les premières semaines de suivi des prix.
      </div>
    );
  }

  return (
    <PriceChart
      data={data.map((h: any) => ({
        merchantName: h.merchant_name,
        priceEur: h.price_eur,
        scrapedAt: h.scraped_at,
      }))}
    />
  );
}
