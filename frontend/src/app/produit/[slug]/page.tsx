import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductClient from "./product-client";

const API_URL = process.env.NEXT_PUBLIC_APP_URL ?? process.env.PICKSY_API_URL ?? "https://picksy.babcoq.tech";

// ─── Fetch helper ─────────────────────────────────────────────

async function fetchProductBySlug(slug: string) {
  const res = await fetch(
    `${API_URL}/api/products/${encodeURIComponent(slug)}`,
    { next: { revalidate: 300, tags: [`product-${slug}`] } }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ─── Metadata dynamique (SEO) ─────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let product: any;
  try {
    product = await fetchProductBySlug(slug);
  } catch {
    return { title: "Produit introuvable — Picksy" };
  }

  if (!product) return { title: "Produit introuvable — Picksy" };

  const title = `${product.name} — Test & Avis 2026 — Picksy`;
  const description =
    product.why_perfect ||
    `Découvre le ${product.name} de ${product.brand}. Score Picksy: ${product.estimated_score ?? "?"}/10. Prix, specs techniques, et avis détaillés.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Server Page ──────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();
  return <ProductClient product={product} />;
}
