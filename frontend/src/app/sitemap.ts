import type { MetadataRoute } from "next";

const BASE = "https://www.troviio.com";
const SUPABASE_URL = "https://uukshxztoztkwxuuvqzc.supabase.co";

// ── Catégories (43 — synchronisé avec DB le 12/05/2026) ─────────────
const CATEGORIES = [
  "accessoire-velo","aspirateur-balai","aspirateur-laveur","aspirateur-robot",
  "barre-de-son","bureau-electrique","camera-securite","casque-audio",
  "cave-a-vin","clavier","climatiseur-portable","enceinte-bt",
  "four-encastrable","four-micro-ondes","friteuse-air","imprimante",
  "jeu-coop-local","laptop-etudiant","laptop-gamer","lave-linge",
  "lave-vaisselle","machine-a-cafe","manette-switch","matelas",
  "montre-connectee","onduleur-ups","ordinateur-portable","poussette",
  "purificateur-air","refrigerateur","robot-cuisine","smartphone",
  "station-charge-usb-c","station-daccueil-usbc","tablette",
  "thermostat-connecte","trottinette","tv","tv-oled","velo-electrique",
  "ventilateur-classique","ventilateur-colonne","voiture-electrique",
];

// ── Duels (27 pages statiques) ──────────────────────────────────────
const DUEL_SLUGS = [
  "apple-watch-ultra-2-vs-samsung-galaxy-watch-ultra",
  "bose-qc-ultra-vs-sony-wh-1000xm6",
  "bugaboo-fox5-vs-uppababy-vista-v3",
  "caldigit-ts5-plus-vs-plugable-tbt4-ud5",
  "dreame-x50-ultra-vs-roborock-qrevo-curv-2-pro",
  "duux-whisper-flex-2-vs-rowenta-vu5890f0",
  "dyson-gen5-detect-vs-samsung-bespoke-jet",
  "dyson-gen5-vs-samsung-bespoke-jet",
  "eaton-5sc-1500i-vs-apc-back-ups-pro-br650mi",
  "flexispot-e7-pro-vs-secretlab-magnus-pro",
  "giant-explore-eplus1-vs-riese-muller-charger4",
  "hp-envy-inspire-7924e-vs-hp-officejet-pro-9135e",
  "hypnia-bien-etre-supreme-vs-emma-original",
  "ipad-pro-m5-11-vs-samsung-galaxy-tab-s11-ultra",
  "it-takes-two-vs-split-fiction",
  "jura-e8-vs-sage-barista-express",
  "lg-g6-oled-vs-samsung-s95h-qd-oled",
  "miele-wcr870-vs-bosch-wgb244a2fr",
  "ninja-foodi-flexdrawer-vs-cosori-turboblaze",
  "samsung-galaxy-s26-ultra-vs-iphone-17-pro-max",
  "sennheiser-ambeo-soundbar-mini-vs-sony-ht-sf150",
  "silvercrest-monsieur-cuisine-smart-vs-magimix-cook-expert-premium-xl",
  "switch-2-pro-controller-vs-8bitdo-pro2-halleffect",
  "tesla-model-y-juniper-vs-tesla-model-3-highland",
  "thermomix-tm7-vs-kitchenaid-artisan",
  "wooting-80he-vs-lemokey-p1-he",
];

// ── Tops statiques (12 pages) ───────────────────────────────────────
const TOP_SLUGS = [
  "aspirateur-balai","aspirateur-robot","bureau-electrique",
  "casque-audio","clavier-gaming","friteuse-air",
  "machine-a-cafe","montre-connectee","robot-cuisine",
  "station-accueil-usbc","tv","voiture-electrique",
];

// ── Guides longtail ─────────────────────────────────────────────────
const GUIDES = [
  "tv/coupe-du-monde-2026",
  "accessoire-velo/guide-achat",
  "accessoire-velo/casque-velo",
  "bureau-electrique/guide-achat",
  "bureau-electrique/grande-taille",
  "clavier/guide-achat",
  "clavier/mecanique-gaming",
  "four-encastrable/guide-achat",
  "four-encastrable/pyrolyse-encastrable",
  "jeu-coop-local/guide-achat",
  "jeu-coop-local/ecran-partage",
  "manette-switch/guide-achat",
  "manette-switch/hall-effect",
  "montre-connectee/guide-achat",
  "montre-connectee/sport-running",
  "station-daccueil-usbc/guide-achat",
  "station-daccueil-usbc/triple-ecran",
  "tablette/guide-achat",
  "tablette/dessin-note",
  "tv-oled/guide-achat",
  "tv-oled/lg-vs-samsung",
  "ventilateur-classique/guide-achat",
  "ventilateur-classique/silencieux-chambre",
  "voiture-electrique/guide-achat",
  "voiture-electrique/moins-40000",
];

// ── Helper: fetch les slugs produits actifs depuis Supabase ─────────
async function getProductSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug&is_active=eq.true`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || \"\",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || \"\"}`,
          Range: \"0-9999\",
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) {
      console.error("Sitemap: failed to fetch product slugs", res.status);
      return [];
    }
    const data: { slug: string }[] = await res.json();
    return data.map((item) => item.slug);
  } catch (err) {
    console.error("Sitemap: error fetching product slugs", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];

  // Home
  urls.push({ url: `${BASE}/`, changeFrequency: "weekly", priority: 1.0 });

  // Pages statiques
  const staticPages = [
    "/methode","/accessoires",
    "/mentions-legales","/politique-confidentialite","/cookies","/cgv","/contact",
    "/catalogue",
    "/duels",
    "/a-propos",
  ];
  for (const p of staticPages) {
    urls.push({ url: `${BASE}${p}`, changeFrequency: "monthly", priority: 0.3 });
  }

  // Tops
  for (const t of TOP_SLUGS) {
    urls.push({ url: `${BASE}/tops/${t}`, changeFrequency: "weekly", priority: 0.8 });
  }
  urls.push({ url: `${BASE}/tops`, changeFrequency: "weekly", priority: 0.7 });

  // Catégories
  for (const slug of CATEGORIES) {
    urls.push({ url: `${BASE}/c/${slug}`, changeFrequency: "weekly", priority: 0.7 });
  }

  // Duels
  for (const slug of DUEL_SLUGS) {
    urls.push({ url: `${BASE}/duel/${slug}`, changeFrequency: "monthly", priority: 0.5 });
  }

  // Guides longtail
  for (const g of GUIDES) {
    urls.push({ url: `${BASE}/guide-longtail/${g}`, changeFrequency: "monthly", priority: 0.4 });
  }

  // ── Produits dynamiques depuis Supabase ──────────────────────────
  const productSlugs = await getProductSlugs();
  for (const slug of productSlugs) {
    urls.push({ url: `${BASE}/produit/${slug}`, changeFrequency: "weekly", priority: 0.6 });
  }

  return urls;
}
