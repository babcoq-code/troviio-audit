import type { MetadataRoute } from "next";
import { PRODUCT_SLUGS, CATEGORY_SLUGS } from "./sitemap-data";

const BASE = "https://www.troviio.com";

const now = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/tops`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/methodologie`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/affiliation`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Catégories (from static data)
  for (const slug of CATEGORY_SLUGS) {
    entries.push({
      url: `${BASE}/c/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Produits (from static data — all 703 active products)
  for (const slug of PRODUCT_SLUGS) {
    entries.push({
      url: `${BASE}/produit/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // Pages comparatives
  const comparePairs: [string, string][] = [
    ["dreame-r20", "dyson-v15-detect-absolute"],
    ["samsung-galaxy-s25-ultra-256-go", "apple-iphone-17-pro-max"],
    ["jura-e8", "delonghi-magnifica-evo-lattecream"],
    ["sonos-sonos-move-2", "jbl-jbl-charge-5"],
    ["poussette-bugaboo-fox-5", "poussette-uppababy-vista-v2"],
  ];

  for (const [s1, s2] of comparePairs) {
    entries.push({
      url: `${BASE}/compare/${s1}/${s2}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // Guides
  const guideSlugs = [
    "meilleur-lave-linge", "meilleur-aspirateur-balai", "meilleur-robot-cuisine",
    "meilleur-casque-audio", "meilleur-ordinateur-portable", "meilleur-velo-electrique",
    "meilleur-aspirateur-robot", "meilleur-smartphone", "meilleur-lave-vaisselle",
    "meilleur-tv-oled", "meilleur-machine-cafe", "meilleur-matelas",
    "meilleure-imprimante", "meilleure-camera-securite", "meilleur-thermostat-connecte",
    "meilleur-four-micro-ondes", "meilleure-enceinte-bluetooth", "meilleure-poussette",
    "meilleure-cave-a-vin", "meilleur-purificateur-air", "meilleure-barre-de-son",
    "meilleure-friteuse-air", "meilleur-refrigerateur", "meilleure-trottinette-electrique",
  ];

  for (const slug of guideSlugs) {
    entries.push({
      url: `${BASE}/guide/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
