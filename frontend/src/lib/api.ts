import type { Product, ChatResponse, NewsletterResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://picksy.babcoq.tech/api";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/`);
  if (!res.ok) throw new Error("Erreur chargement produits");
  return res.json();
}

export async function fetchTopProducts(category: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/top5/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("Erreur chargement top produits");
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Produit introuvable");
  return res.json();
}

export async function chatWithAI(message: string, history: { role: string; content: string }[] = []): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Erreur de communication avec l'IA");
  }
  return res.json();
}

export async function subscribeNewsletter(email: string, name?: string): Promise<NewsletterResponse> {
  const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  return res.json();
}
