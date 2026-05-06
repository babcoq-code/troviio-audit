import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CATEGORIES } from "@/lib/constants";

export const revalidate = 86400;

const SITE_URL = "https://www.troviio.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseServerClient();
  const now = new Date();

  // Pages statiques
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/tops`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/catalogue`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/methodologie`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/affiliation`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/duels`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  // Pages catégories (depuis les slugs statiques)
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((slug) => ({
    url: `${SITE_URL}/c/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Pages longue traîne SEO (depuis seo_pages)
  const { data: seoPages, error } = await supabase
    .from("seo_pages")
    .select("category_slug, page_slug, updated_at");

  const seoPageRoutes: MetadataRoute.Sitemap =
    !error && seoPages
      ? seoPages.map((page) => ({
          url: `${SITE_URL}/guide-longtail/${page.category_slug}/${page.page_slug}`,
          lastModified: page.updated_at ? new Date(page.updated_at) : now,
          changeFrequency: "monthly" as const,
          priority: 0.75,
        }))
      : [];

  // Pages produits (depuis les slugs statiques générés)
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { PRODUCT_SLUGS } = await import("./sitemap-data");
    productRoutes = PRODUCT_SLUGS.map((slug: string) => ({
      url: `${SITE_URL}/produit/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // Fallback silencieux si sitemap-data n'est pas dispo
  }

  // Pages duels
  const DUEL_SLUGS = [
    "dreame-x50-ultra-vs-roborock-qrevo-curv-2-pro",
    "sony-wh-1000xm6-vs-bose-qc-ultra",
    "lg-g6-oled-vs-samsung-s95h-qd-oled",
    "jura-e8-vs-sage-barista-express",
    "ninja-foodi-flexdrawer-vs-cosori-turboblaze",
    "dyson-gen5-vs-samsung-bespoke-jet",
    "ipad-pro-m5-11-vs-samsung-galaxy-tab-s11-ultra",
    "switch-2-pro-controller-vs-8bitdo-pro2-halleffect",
    "samsung-galaxy-s26-ultra-vs-iphone-17-pro-max",
    "apple-watch-ultra-2-vs-samsung-galaxy-watch-ultra",
    "tesla-model-y-juniper-vs-tesla-model-3-highland",
    "dyson-gen5-detect-vs-samsung-bespoke-jet",
    "ninja-foodi-flexdrawer-vs-cosori-turboblaze",
    "miele-wcr870-vs-bosch-wgb244a2fr",
    "thermomix-tm7-vs-kitchenaid-artisan",
    "hypnia-bien-etre-supreme-vs-emma-original",
    "giant-explore-eplus1-vs-riese-muller-charger4",
    "bugaboo-fox5-vs-uppababy-vista-v3",
    "it-takes-two-vs-split-fiction",
    "duux-whisper-flex-2-vs-rowenta-vu5890f0",
  ];
  const duelRoutes: MetadataRoute.Sitemap = DUEL_SLUGS.map((slug) => ({
    url: `${SITE_URL}/duel/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // Pages tops
  const TOP_SLUGS = [
    "meilleur-aspirateur-robot",
    "meilleur-casque-audio",
    "meilleure-tv",
    "meilleure-machine-a-cafe",
    "meilleur-robot-cuisine",
    "meilleure-friteuse-air",
    "meilleur-aspirateur-balai",
    "meilleure-montre-connectee",
    "meilleure-voiture-electrique",
  ];
  const topRoutes: MetadataRoute.Sitemap = TOP_SLUGS.map((slug) => ({
    url: `${SITE_URL}/tops/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Pages guide-longtail statiques (générées)
  const STATIC_GUIDE_PATHS = [
    // Aspirateur-robot
    "aspirateur-robot/maison-etage",
    "aspirateur-robot/parquet-fragile",
    "aspirateur-robot/silencieux-appartement",
    "aspirateur-robot/connecte-alexa",
    // TV
    "tv/65-pouces-recul-3m",
    "tv/sport-foot-2026",
    "tv/gaming-120hz-pas-cher-ps5",
    "tv/salon-tres-lumineux",
    // Machine à café
    "machine-a-cafe/debutant",
    "machine-a-cafe/silencieuse",
    "machine-a-cafe/moins-400e",
    "machine-a-cafe/espresso-pas-cher",
    // Café grain
    "cafe-grain/bureau-entreprise",
    // Friteuse air
    "montre-connectee/meilleure-montre-sport",
    "montre-connectee/montre-connectee-pas-chere",
    "voiture-electrique/voiture-electrique-autonomie-maximum",
    "voiture-electrique/voiture-electrique-premier-achat",
    "friteuse-air/famille-4-personnes",
    "friteuse-air/studio-etudiant",
    "friteuse-air/sans-huile-grande-capacite",
    // Purificateur air
    "purificateur-air/allergie-pollen-ete",
    "purificateur-air/chambre-bebe",
    // Robot cuisine
    "robot-cuisine/grand-famille-6-personnes",
    "robot-cuisine/toutes-options-multifonction",
  ];
  const staticGuideRoutes: MetadataRoute.Sitemap = STATIC_GUIDE_PATHS.map((path) => ({
    url: `${SITE_URL}/guide-longtail/${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...seoPageRoutes, ...productRoutes, ...staticGuideRoutes, ...duelRoutes, ...topRoutes];
}
