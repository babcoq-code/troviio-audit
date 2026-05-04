import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const API_BASE = process.env.API_BASE_URL || "http://backend:8000";

const SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co";
const SUPABASE_KEY = "sb_publishable_MtlnW7iC23FprNIUrISnZg_6IN8erpB";

async function fetchCategories(): Promise<Record<string, string>> {
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data } = await sb.from("categories").select("id, name, slug");
    const map: Record<string, string> = {};
    for (const c of data || []) {
      map[c.id] = `${c.name}`;
    }
    return map;
  } catch {
    return {};
  }
}

async function fetchAllProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/products/?limit=200`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("fetch error", e);
    return [];
  }
}

export default async function AdminProduitsPage() {
  const [products, catMap] = await Promise.all([
    fetchAllProducts(),
    fetchCategories(),
  ]);

  // Grouper par catégorie
  const byCategory: Record<string, typeof products> = {};
  for (const p of products) {
    const cid = p.category_id || "autre";
    if (!byCategory[cid]) byCategory[cid] = [];
    byCategory[cid].push(p);
  }

  return (
    <main className="min-h-screen bg-[#0E1020] text-white p-6">
      <h1 className="text-3xl font-bold mb-2">📋 Catalogue Troviio</h1>
      <p className="text-white/60 mb-6">{products.length} produits actifs — clique sur un produit pour voir/modifier sa fiche</p>

      {Object.entries(byCategory)
        .sort(([, a], [, b]) => (b[0]?.estimated_score || 0) - (a[0]?.estimated_score || 0))
        .map(([catId, prods]) => {
          const catName = catMap[catId] || catId.slice(0, 8);
          return (
            <details key={catId} className="mb-4 border border-white/10 rounded-2xl overflow-hidden" open>
              <summary className="cursor-pointer px-5 py-3 bg-white/5 hover:bg-white/10 transition font-bold text-lg flex items-center gap-3">
                <span>{catName}</span>
                <span className="text-sm font-normal text-white/40">({prods.length} produits)</span>
              </summary>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-white/10 text-white/50 text-xs uppercase">
                    <th className="px-4 py-2 text-left">Score</th>
                    <th className="px-4 py-2 text-left">Marque</th>
                    <th className="px-4 py-2 text-left">Nom</th>
                    <th className="px-4 py-2 text-left">Prix</th>
                    <th className="px-4 py-2 text-left">ASIN</th>
                    <th className="px-4 py-2 text-left">Test</th>
                    <th className="px-4 py-2 text-left">Photo</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {prods
                    .sort((a: any, b: any) => (b.estimated_score || 0) - (a.estimated_score || 0))
                    .map((p: any) => (
                      <tr key={p.slug} className="hover:bg-white/5 transition">
                        <td className="px-4 py-2 font-mono">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                            p.estimated_score >= 90 ? "bg-green-500/20 text-green-400" :
                            p.estimated_score >= 80 ? "bg-blue-500/20 text-blue-400" :
                            p.estimated_score >= 70 ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-red-500/20 text-red-400"
                          }`}>
                            {p.estimated_score?.toFixed(0) || "?"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-white/80">{p.brand || "?"}</td>
                        <td className="px-4 py-2 max-w-[250px] truncate">{p.name}</td>
                        <td className="px-4 py-2 font-mono text-white/60">
                          {p.price_eur != null ? `${(p.price_eur / 100).toFixed(0)}€` : "?"}
                        </td>
                        <td className="px-4 py-2 font-mono text-[10px] text-white/40">{p.amazon_asin || "—"}</td>
                        <td className="px-4 py-2">
                          {p.test_summary ? (
                            <span className="text-green-400 text-xs" title={p.test_summary.slice(0, 100) + "..."}>✅</span>
                          ) : (
                            <span className="text-red-400 text-xs">❌</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {p.image_url && !p.image_url.includes("amazon") && !p.image_url.includes("gstatic") && !p.image_url.includes("encrypted") ? (
                            <span className="text-green-400 text-xs">✅</span>
                          ) : p.image_url ? (
                            <span className="text-yellow-400 text-xs" title={p.image_url.slice(0, 60)}>⚠️</span>
                          ) : (
                            <span className="text-red-400 text-xs">❌</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <Link
                            href={`/produit/${p.slug}`}
                            className="text-blue-400 hover:text-blue-300 text-xs underline"
                            target="_blank"
                          >
                            Voir →
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </details>
          );
        })}

      {/* Stats footer */}
      <div className="mt-8 p-4 rounded-2xl border border-white/10 bg-white/5 text-sm text-white/60">
        <strong>Légende :</strong>
        {" "}✅ Test OK / ⚠️ Photo CDN (à fiabiliser) / ❌ Manquant
        {" — "} <strong>Score :</strong> 🟢 90+ / 🔵 80-89 / 🟡 70-79 / 🔴 -70
      </div>
    </main>
  );
}
