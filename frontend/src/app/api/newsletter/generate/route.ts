import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * GET /api/newsletter/generate
 * Génère le contenu JSON de la newsletter (Top 3 par catégorie).
 * Utile pour prévisualiser ou envoyer manuellement.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "3"), 1), 10);

  try {
    const supabase = getSupabase();

    // Récupérer les catégories
    const { data: categories } = await supabase
      .from("categories")
      .select("id, slug, name")
      .order("name");

    if (!categories || categories.length === 0) {
      return NextResponse.json({ categories: [] });
    }

    const result = [];

    for (const cat of categories) {
      const { data: products } = await supabase
        .from("products")
        .select("id, name, brand, slug, estimated_score, image_url, price_eur")
        .eq("status", "published")
        .eq("category_id", cat.id)
        .not("estimated_score", "is", null)
        .order("estimated_score", { ascending: false })
        .limit(limit);

      if (products && products.length > 0) {
        result.push({
          category: cat.slug,
          category_label: cat.name,
          products: products.map((p) => ({
            ...p,
            estimated_score: p.estimated_score ? Math.round(p.estimated_score * 10) / 10 : null,
          })),
        });
      }
    }

    return NextResponse.json({
      generated_at: new Date().toISOString(),
      categories: result,
    });
  } catch (error) {
    console.error("Error generating newsletter content:", error);
    return NextResponse.json({ error: "Erreur de génération" }, { status: 500 });
  }
}
