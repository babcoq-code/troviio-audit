import type { MetadataRoute } from "next";

const BASE = "https://www.troviio.com";

const SLUGS = [
  "aspirateurs-robots","aspirateurs-balai","lave-linge","lave-vaisselle",
  "refrigerateurs","purificateurs-air","friteuses-air","machines-a-cafe",
  "robots-cuisine","caves-a-vin","tv-oled","casques-audio","smartphones",
  "ordinateurs-portables","imprimantes","barres-de-son","cameras-securite",
  "thermostats-connectes","trottinettes-electriques","velos-electriques",
  "matelas","poussettes",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/methodologie`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/affiliation`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/guide`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const categories: MetadataRoute.Sitemap = SLUGS.map((slug) => ({
    url: `${BASE}/c/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...statics, ...categories];
}
