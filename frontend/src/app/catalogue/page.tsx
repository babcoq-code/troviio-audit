import type { Product } from "@/types";
import CatalogueClient from "./CatalogueClient";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// ─── Types ─────────────────────────────────────────────────
interface CategoryFilter {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  count: number;
}

// ─── Catégories connues avec emoji (dupliqué pour SSR) ────
const KNOWN_CATEGORY_EMOJI: Record<string, string> = {
  smartphone: "📱",
  "machine-a-cafe": "☕",
  "aspirateur-balai": "🧹",
  "aspirateur-laveur": "🧹",
  "friteuse-air": "🍟",
  "casque-audio": "🎧",
  "aspirateur-robot": "🤖",
  "barre-de-son": "🔊",
  refrigerateur: "🧊",
  "lave-linge": "🌀",
  "lave-vaisselle": "🍽️",
  "four-micro-ondes": "🔥",
  poussette: "👶",
  "ordinateur-portable": "💻",
  tv: "📺",
  "enceinte-bt": "🔊",
  "cave-a-vin": "🍷",
  "purificateur-air": "💨",
  "robot-cuisine": "🍳",
  trottinette: "🛴",
  "velo-electrique": "🚲",
  matelas: "🛏️",
  imprimante: "🖨️",
  "camera-securite": "📷",
  "thermostat-connecte": "🌡️",
  "accessoire-velo": "🔧",
  "laptop-gamer": "🎮",
  "laptop-etudiant": "📚",
  "climatiseur-portable": "❄️",
  "ventilateur-colonne": "🌀",
  "station-charge-usb-c": "🔌",
  "onduleur-ups": "⚡",
};

const DEFAULT_EMOJI = "🏷️";

// ─── Backend URL for SSR ───────────────────────────────────
const INTERNAL_API = process.env.API_BASE_URL || "http://backend:8000";

// ─── Server Component ─────────────────────────────────────
export default async function CataloguePage() {
  let initialData: (Product & { category_slug?: string; category_name?: string })[] = [];
  let categories: CategoryFilter[] = [];
  let hasData = false;

  try {
    // 1. Fetch products from backend (includes category_id, category_slug, category_name)
    const productUrl = `${INTERNAL_API}/api/products/?limit=500`;
    const productRes = await fetch(productUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (productRes.ok) {
      const products: any[] = await productRes.json();
      initialData = products;

      // 2. Build category filters from product data itself
      // Products already have category_slug, category_name, category_id from the backend.
      // We extract unique categories and count products per category.
      const catMap = new Map<string, { id: string; name: string; slug: string }>();

      for (const p of products) {
        const slug = p.category_slug as string | undefined;
        const name = p.category_name as string | undefined;
        const id = p.category_id as string | undefined;
        if (slug && id && !catMap.has(slug)) {
          catMap.set(slug, { id, name: name || slug, slug });
        } else if (slug && !catMap.has(slug) && !id) {
          // Fallback: generate a synthetic ID from slug
          catMap.set(slug, { id: slug, name: name || slug, slug });
        }
      }

      // 3. Count products per category
      const counts: Record<string, number> = {};
      for (const p of products) {
        const slug = p.category_slug as string;
        if (slug) {
          counts[slug] = (counts[slug] || 0) + 1;
        }
      }

      // 4. Build final category filter list
      categories = Array.from(catMap.values())
        .map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          emoji: KNOWN_CATEGORY_EMOJI[c.slug] || DEFAULT_EMOJI,
          count: counts[c.slug] || 0,
        }))
        .filter((c) => c.count > 0)
        .sort((a, b) => b.count - a.count);

      hasData = true;
    }
  } catch (err) {
    console.error("SSR catalogue fetch error:", err);
  }

  // If SSR fetch succeeded, pass initial data; otherwise the client will fetch on its own
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Catalogue" },
        ]}
      />
      <CatalogueClient
        initialData={hasData ? initialData : undefined}
        initialCategories={hasData ? categories : undefined}
      />
    </>
  );
}
