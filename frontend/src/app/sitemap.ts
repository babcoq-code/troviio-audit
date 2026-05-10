import type { MetadataRoute } from "next";

const BASE = "https://www.troviio.com";

// ── Catégories ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "airfryer","aspirateur-balai","aspirateur-robot","bureau-electrique",
  "casque-audio","cave-a-vin","clavier-gaming","climatiseur-mobile",
  "decongelateur","enceinte-bt","epilateur-lumiere-pulsee","four-micro-ondes",
  "imprimante-3d","laptop-gamer","machine-a-cafe","machine-a-pain",
  "machine-a-coudre","moniteur","montre-connectee","nettoyeur-vapeur",
  "ordinateur-portable","purificateur-air","rasoir-electrique",
  "refrigerateur","robot-cuisine","robot-piscine","robot-tondeuse",
  "serrure-connectee","smartphone","souffleur-feuilles",
  "station-charge-usb-c","station-daccueil-usbc","table-de-cuisson",
  "tapis-de-course","tracteur-tondeuse","trottinette-electrique",
  "tv","velo-electrique","velo-electrique-pliant","voiture-electrique",
];

// ── Duels ───────────────────────────────────────────────────────────────────────
const DUEL_SLUGS = [
  "thermomix-vs-magimix-cook-expert","caldigit-ts5-vs-plugable-tbt4-ud5",
  "dyson-gen5-detect-vs-samsung-bespoke-jet","lg-c6-vs-samsung-s95h",
  "ninja-foodi-vs-cosori-turboblaze","sony-wh-1000xm6-vs-bose-qc-ultra",
  "flexispot-e7-pro-vs-secretlab-magnus-pro","garmin-fenix-8-vs-apple-watch-ultra-2",
  "jura-e8-vs-sage-barista-express","tesla-model-y-vs-bmw-ix3",
  "wooting-80he-vs-keychron-q5-max","dyson-v15-vs-jet-ultra",
  "vorwerk-vs-kitchenaid","moccamaster-vs-sage",
  "ninja-max-vs-philips-airfryer","lg-g6-vs-samsung-s95h",
  "caldigit-vs-startech","fenix-8-vs-galaxy-watch-ultra",
  "tesla-model-3-vs-bmw-ix3","keychron-vs-lemokey",
  "magimix-xl-vs-thermomix","bose-vs-sennheiser","desktronic-vs-flexispot",
];

// ── Guides longtail ──────────────────────────────────────────────────────────────
const GUIDES = [
  "tv/coupe-du-monde-2026",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  // Home
  urls.push({ url: `${BASE}/`, changeFrequency: "weekly", priority: 1.0 });

  // Pages statiques
  const staticPages = [
    "/methode","/a-propos","/score","/accessoires",
    "/mentions-legales","/confidentialite","/cookies","/cgv","/contact",
    "/catalogue",
    "/duels",
  ];
  for (const p of staticPages) {
    urls.push({ url: `${BASE}${p}`, changeFrequency: "monthly", priority: 0.3 });
  }

  // Tops
  const tops = [
    "aspirateur-robot","aspirateur-balai","robot-cuisine","casque-audio",
    "bureau-electrique","clavier-gaming","friteuse-air","machine-a-cafe",
    "montre-connectee","station-accueil-usbc","tv","voiture-electrique",
  ];
  for (const t of tops) {
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

  return urls;
}
