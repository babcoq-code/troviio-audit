import type { MetadataRoute } from "next";

const BASE = "https://troviio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/tops`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/tops/meilleur-clavier-gaming`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tops/meilleur-bureau-electrique`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tops/meilleure-machine-a-cafe`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tops/meilleur-robot-cuisine`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tops/meilleure-tv`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tops/meilleur-aspirateur-robot`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tops/meilleure-friteuse-air`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tops/meilleur-casque-audio`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tops/meilleure-voiture-electrique`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/guide/meilleur-lave-linge`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guide/meilleur-aspirateur-balai`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guide/meilleur-robot-cuisine`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guide/meilleur-casque-audio`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guide/meilleur-ordinateur-portable`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guide/meilleur-velo-electrique`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guide/meilleur-aspirateur-robot`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guide/meilleur-clavier`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guide/meilleur-bureau-electrique`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/duel/wooting-80he-vs-lemokey-p1-he`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/flexispot-e7-pro-vs-secretlab-magnus-pro`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/dyson-gen5-detect-vs-samsung-bespoke-jet`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/thermomix-tm7-vs-kitchenaid-artisan`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/miele-wcr870-vs-bosch-wgb244a2fr`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/samsung-galaxy-s26-ultra-vs-iphone-17-pro-max`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/apple-watch-ultra-2-vs-samsung-galaxy-watch-ultra`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/hypnia-bien-etre-supreme-vs-emma-original`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/lg-g6-oled-vs-samsung-s95h-qd-oled`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/giant-explore-eplus1-vs-riese-muller-charger4`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/ninja-foodi-flexdrawer-vs-cosori-turboblaze`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/dreame-x50-ultra-vs-roborock-qrevo-curv-2-pro`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/jura-e8-vs-sage-barista-express`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/bugaboo-fox5-vs-uppababy-vista-v3`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/tesla-model-y-juniper-vs-tesla-model-3-highland`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/sony-wh-1000xm6-vs-bose-qc-ultra`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/ipad-pro-m5-11-vs-samsung-galaxy-tab-s11-ultra`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/dyson-gen5-vs-samsung-bespoke-jet`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/it-takes-two-vs-split-fiction`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/duel/duux-whisper-flex-2-vs-rowenta-vu5890f0`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Supprimer les doublons (uniques par URL)
  const seen = new Set<string>();
  const unique = staticPages.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return unique;
}
