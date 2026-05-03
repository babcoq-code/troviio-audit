import type { Metadata } from "next";
import TopsClient from "./TopsClient";

export const metadata: Metadata = {
  title: "Top 3 Troviio — Les meilleurs produits par catégorie",
  description:
    "Les 3 meilleurs produits dans chaque catégorie, sélectionnés et notés par l'IA Troviio. Pas de sponsor, que des tests.",
  alternates: { canonical: "https://www.troviio.com/tops" },
  openGraph: {
    title: "Top 3 Troviio — Les meilleurs produits par catégorie",
    description: "Les 3 meilleurs produits dans chaque catégorie. Pas de sponsor, que des tests.",
    url: "https://www.troviio.com/tops",
    siteName: "Troviio",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 3 Troviio — Les meilleurs produits par catégorie",
    description: "Les 3 meilleurs produits dans chaque catégorie. Pas de sponsor, que des tests.",
  },
};

interface TopProduct {
  slug: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  estimated_score: number | null;
  price_eur: number | null;
  best_merchant: string | null;
  affiliate_url: string | null;
  pros: string[];
  cons: string[];
  why_perfect: string | null;
  rank_label: string | null;
}

interface TopCategory {
  slug: string;
  name: string;
  products: TopProduct[];
  count_products: number;
}

async function fetchTops(): Promise<TopCategory[]> {
  try {
    const base = process.env.INTERNAL_API_URL || "http://backend:8000/api";
    const res = await fetch(`${base}/tops`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

export default async function TopsPage() {
  const categories = await fetchTops();
  return <TopsClient categories={categories} />;
}
