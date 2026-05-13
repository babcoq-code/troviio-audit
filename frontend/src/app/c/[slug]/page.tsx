import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ChatHero from "@/components/ChatHero";
import { SEO_INTRO } from "@/lib/seo-intro";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface Props {
  params: Promise<{ slug: string }>;
}

type CatMeta = {
  name: string; emoji: string;
  title: string; description: string;
  guide_title: string; guide_desc: string;
};

const CAT_META: Record<string, CatMeta> = {
  smartphone: { name: "Smartphone", emoji: "📱", title: "Meilleur smartphone 2026", description: "Photo, batterie, iOS ou Android : Troviio trouve le smartphone qui te correspond.", guide_title: "Comment choisir son smartphone ?", guide_desc: "Autonomie, appareil photo, puissance : découvrez les critères essentiels pour bien choisir votre smartphone en 2026." },
  "aspirateur-robot": { name: "Robot aspirateur", emoji: "🤖", title: "Meilleur robot aspirateur 2026", description: "Trouve le robot aspirateur parfait : parquet, animaux, appartement ou maison. Comparatif IA personnalisé.", guide_title: "Quel robot aspirateur choisir ?", guide_desc: "Aspiration, autonomie, navigation : tous les critères pour choisir le robot qui nettoiera votre maison." },
  "aspirateur-balai": { name: "Aspirateur balai", emoji: "🧹", title: "Meilleur aspirateur balai 2026", description: "Sans fil, léger, puissant : Troviio sélectionne l'aspirateur balai adapté à ton logement.", guide_title: "Comment choisir un aspirateur balai ?", guide_desc: "Autonomie, puissance, poids : les critères pour trouver l'aspirateur balai idéal pour votre intérieur." },
  "aspirateur-laveur": { name: "Aspirateur laveur", emoji: "🧹", title: "Meilleur aspirateur laveur 2026", description: "Lave et aspire en un passage : Troviio choisit l'aspirateur laveur pour tes sols impeccables.", guide_title: "Quel aspirateur laveur choisir ?", guide_desc: "Puissance, lavage, autonomie : le guide pour choisir un aspirateur laveur performant." },
  "lave-linge": { name: "Lave-linge", emoji: "🌀", title: "Meilleur lave-linge 2026", description: "Capacité, bruit, consommation : Troviio choisit le lave-linge fait pour ta famille.", guide_title: "Quel lave-linge choisir ?", guide_desc: "Capacité, essorage, classe énergétique : le guide complet pour choisir sa machine à laver." },
  "lave-vaisselle": { name: "Lave-vaisselle", emoji: "🍽️", title: "Meilleur lave-vaisselle 2026", description: "Taille, silence, éco : Troviio sélectionne le lave-vaisselle pour ton usage réel.", guide_title: "Bien choisir son lave-vaisselle", guide_desc: "Capacité, bruit, programmes : tout savoir pour acheter le bon lave-vaisselle." },
  refrigerateur: { name: "Réfrigérateur", emoji: "🧊", title: "Meilleur réfrigérateur 2026", description: "Volume, No Frost, multi-portes : Troviio trouve le frigo adapté à ton foyer.", guide_title: "Quel réfrigérateur acheter ?", guide_desc: "Volume, froid ventilé, consommation : le guide pour bien choisir son réfrigérateur." },
  "friteuse-air": { name: "Friteuse à air", emoji: "🍟", title: "Meilleure friteuse à air 2026", description: "Capacité, rapidité, nettoyage : Troviio choisit la friteuse à air adaptée à ta famille.", guide_title: "Comment choisir une friteuse à air ?", guide_desc: "Capacité, puissance, nettoyage : les critères pour une friteuse healthy et pratique." },
  "machine-a-cafe": { name: "Machine à café", emoji: "☕", title: "Meilleure machine à café 2026", description: "Grains, capsules, silence, entretien : Troviio choisit la machine à café faite pour ta vie.", guide_title: "Quelle machine à café choisir ?", guide_desc: "Grain ou capsule, pression, entretien : le guide ultime pour votre café quotidien." },
  tv: { name: "TV", emoji: "📺", title: "Meilleure TV 2026", description: "Salon lumineux, gaming, cinéma : Troviio sélectionne la TV pour ton usage réel.", guide_title: "Quelle TV acheter en 2026 ?", guide_desc: "OLED, QLED, taille, taux de rafraîchissement : tous les critères pour bien choisir votre téléviseur." },
  "casque-audio": { name: "Casque audio", emoji: "🎧", title: "Meilleur casque audio 2026", description: "Nomade, réduction de bruit, qualité son : Troviio choisit le casque adapté à toi.", guide_title: "Quel casque audio choisir ?", guide_desc: "Réduction de bruit, confort, qualité sonore : le guide pour trouver le casque parfait." },
  "tv-oled": { name: "TV OLED", emoji: "📺", title: "Meilleure TV OLED 2026", description: "OLED, cinéma, gaming, Dolby Vision : Troviio choisit la TV OLED pour ton salon.", guide_title: "Quelle TV OLED choisir ?", guide_desc: "OLED, Dolby Vision, HDMI 2.1 : le guide pour une qualité d'image exceptionnelle." },
  "laptop-etudiant": { name: "Laptop étudiant", emoji: "💻", title: "Meilleur laptop étudiant 2026", description: "Légèreté, autonomie, budget : Troviio choisit le PC portable pour tes études.", guide_title: "Quel PC portable étudiant choisir ?", guide_desc: "Autonomie, poids, budget : le guide du laptop pour les étudiants." },
  "ordinateur-portable": { name: "Ordinateur portable", emoji: "💻", title: "Meilleur ordinateur portable 2026", description: "Légèreté, autonomie, perfs : Troviio choisit le laptop idéal pour tes études ou ton travail.", guide_title: "Quel PC portable choisir ?", guide_desc: "Processeur, RAM, autonomie, poids : le guide complet de l'ordinateur portable." },
  "barre-de-son": { name: "Barre de son", emoji: "🔊", title: "Meilleure barre de son 2026", description: "TV, gaming, Dolby Atmos : Troviio choisit la barre de son pour ton salon.", guide_title: "Comment choisir une barre de son ?", guide_desc: "Canaux, caisson, connectique : le guide pour transformer votre salon en home cinéma." },
  "enceinte-bt": { name: "Enceinte Bluetooth", emoji: "🔈", title: "Meilleure enceinte Bluetooth 2026", description: "Nomade, puissante, étanche : Troviio trouve l'enceinte pour ta vie.", guide_title: "Quelle enceinte Bluetooth choisir ?", guide_desc: "Portabilité, puissance, autonomie : le guide de l'enceinte sans fil qui vous accompagne." },
  poussette: { name: "Poussette", emoji: "👶", title: "Meilleure poussette 2026", description: "Légère, pliable, tout terrain, nouveau-né : Troviio trouve la poussette parfaite pour toi.", guide_title: "Quelle poussette choisir ?", guide_desc: "Poids, pliage, confort : le guide pour choisir la poussette de votre bébé." },
  "four-micro-ondes": { name: "Micro-ondes", emoji: "🔥", title: "Meilleur micro-ondes 2026", description: "Seul, combiné, compact : Troviio choisit le micro-ondes adapté à ta cuisine.", guide_title: "Quel micro-ondes choisir ?", guide_desc: "Puissance, capacité, fonctions : le guide pour un micro-ondes adapté à vos besoins." },
  "cave-a-vin": { name: "Cave à vin", emoji: "🍷", title: "Meilleure cave à vin 2026", description: "Température, capacité, silence : Troviio sélectionne la cave à vin pour ta collection.", guide_title: "Bien choisir sa cave à vin", guide_desc: "Capacité, température, encastrable : le guide de la cave à vin idéale." },
  "robot-cuisine": { name: "Robot cuisine", emoji: "🍳", title: "Meilleur robot cuisine 2026", description: "Polyvalence, puissance, accessoires : Troviio trouve le robot cuisine qui transforme ta cuisine.", guide_title: "Quel robot cuisine choisir ?", guide_desc: "Puissance, fonctions, accessoires : le guide pour cuisiner sans effort." },
  trottinette: { name: "Trottinette électrique", emoji: "🛴", title: "Meilleure trottinette électrique 2026", description: "Autonomie, puissance, poids : Troviio trouve la trottinette pour tes trajets.", guide_title: "Quelle trottinette électrique choisir ?", guide_desc: "Autonomie, vitesse, poids : le guide de la trottinette pour vos déplacements urbains." },
  "velo-electrique": { name: "Vélo électrique", emoji: "🚲", title: "Meilleur vélo électrique 2026", description: "Autonomie, moteur, confort : Troviio choisit le VAE adapté à ta pratique.", guide_title: "Quel vélo électrique choisir ?", guide_desc: "Autonomie, moteur, batterie : le guide complet du vélo à assistance électrique." },
  "purificateur-air": { name: "Purificateur d'air", emoji: "🌬️", title: "Meilleur purificateur d'air 2026", description: "Filtration, surface, bruit : Troviio choisit le purificateur pour ton intérieur.", guide_title: "Quel purificateur d'air choisir ?", guide_desc: "Filtration, surface, niveau sonore : le guide pour respirer un air sain chez vous." },
  "thermostat-connecte": { name: "Thermostat connecté", emoji: "🌡️", title: "Meilleur thermostat connecté 2026", description: "Économies, compatibilité, pilotage : Troviio trouve le thermostat qui réduit ta facture.", guide_title: "Quel thermostat connecté choisir ?", guide_desc: "Compatibilité chaudière, pilotage, économies : le guide du thermostat intelligent." },
  "camera-securite": { name: "Caméra sécurité", emoji: "📹", title: "Meilleure caméra sécurité 2026", description: "Intérieur, extérieur, vision nocturne : Troviio choisit la caméra qui protège ton chez-toi.", guide_title: "Quelle caméra de sécurité choisir ?", guide_desc: "Résolution, vision nocturne, stockage : le guide pour sécuriser votre domicile." },
  imprimante: { name: "Imprimante", emoji: "🖨️", title: "Meilleure imprimante 2026", description: "Laser, jet d'encre, multifonction : Troviio choisit l'imprimante pour ton usage.", guide_title: "Quelle imprimante choisir ?", guide_desc: "Laser ou jet d'encre, vitesse, coût à la page : le guide de l'imprimante idéale." },
  matelas: { name: "Matelas", emoji: "🛏️", title: "Meilleur matelas 2026", description: "Ferme, mémoire de forme, naturel : Troviio trouve le matelas pour tes nuits.", guide_title: "Quel matelas choisir ?", guide_desc: "Fermeté, matière, soutien : le guide pour des nuits réparatrices." },
  "accessoire-velo": { name: "Accessoires vélo", emoji: "🚴", title: "Meilleurs accessoires vélo 2026", description: "Casques, antivols, éclairage, sonnettes : Troviio choisit les accessoires vélo pour ta pratique.", guide_title: "Quels accessoires vélo choisir ?", guide_desc: "Sécurité, confort, réglementation : le guide des accessoires indispensables pour votre vélo." },
  "bureau-electrique": { name: "Bureau électrique", emoji: "🪑", title: "Meilleur bureau électrique 2026", description: "Assis-debout, stable, silencieux : Troviio choisit le bureau électrique pour ton télétravail.", guide_title: "Quel bureau électrique choisir ?", guide_desc: "Stabilité, silence, hauteur : le guide du bureau assis-debout pour votre santé." },
  clavier: { name: "Clavier", emoji: "⌨️", title: "Meilleur clavier 2026", description: "Mécanique, gaming, bureautique : Troviio trouve le clavier adapté à ta frappe.", guide_title: "Quel clavier choisir ?", guide_desc: "Mécanique ou membrane, layout, switches : le guide du clavier parfait." },
  "four-encastrable": { name: "Four encastrable", emoji: "🔥", title: "Meilleur four encastrable 2026", description: "Chaleur tournante, pyrolyse, catalyse : Troviio choisit le four encastrable pour ta cuisine.", guide_title: "Quel four encastrable choisir ?", guide_desc: "Chaleur tournante, pyrolyse, catalyse : le guide du four encastrable pour une cuisine équipée." },
  "jeu-coop-local": { name: "Jeux coop locaux", emoji: "🎮", title: "Meilleurs jeux coop locaux 2026", description: "Split-screen, couch co-op, famille : Troviio sélectionne les jeux à partager sur ton canapé.", guide_title: "Quels jeux coop locaux choisir ?", guide_desc: "Split-screen, co-op, famille : le guide des jeux à deux sur le même canapé." },
  "manette-switch": { name: "Manette Switch", emoji: "🎮", title: "Meilleure manette Switch 2026", description: "Pro, 8BitDo, Hall Effect : Troviio choisit la manette Nintendo Switch pour ton gaming.", guide_title: "Quelle manette Switch choisir ?", guide_desc: "Confort, précision, autonomie : le guide de la manette Nintendo Switch idéale." },
  "montre-connectee": { name: "Montre connectée", emoji: "⌚", title: "Meilleure montre connectée 2026", description: "Sport, santé, autonomie : Troviio trouve la montre connectée pour ton poignet.", guide_title: "Quelle montre connectée choisir ?", guide_desc: "Sport, santé, autonomie, OS : le guide de la montre connectée qui vous suit partout." },
  "station-daccueil-usbc": { name: "Station d'accueil USB-C", emoji: "🔌", title: "Meilleure station d'accueil USB-C 2026", description: "Power delivery, écrans multiples, connectique : Troviio choisit la station USB-C pour ton setup.", guide_title: "Quelle station d'accueil USB-C choisir ?", guide_desc: "Power delivery, multi-écran, connectique : le guide de la station d'accueil pour laptop." },
  tablette: { name: "Tablette", emoji: "📱", title: "Meilleure tablette 2026", description: "iPad, Android, dessin, productivité : Troviio trouve la tablette pour ton usage.", guide_title: "Quelle tablette choisir ?", guide_desc: "Écran, OS, stylet, autonomie : le guide de la tablette pour le travail et les loisirs." },
  "ventilateur-classique": { name: "Ventilateur classique", emoji: "🌀", title: "Meilleur ventilateur 2026", description: "Silencieux, puissant, sur pied ou colonne : Troviio choisit le ventilateur pour ta maison.", guide_title: "Quel ventilateur choisir ?", guide_desc: "Silence, puissance, type : le guide du ventilateur pour rester frais sans nuisance sonore." },
  "voiture-electrique": { name: "Voiture électrique", emoji: "🚗", title: "Meilleure voiture électrique 2026", description: "Autonomie, recharge, budget : Troviio choisit la voiture électrique pour ta mobilité.", guide_title: "Quelle voiture électrique choisir ?", guide_desc: "Autonomie, recharge, budget : le guide complet de la voiture électrique en 2026." },
};

export async function generateStaticParams() {
  return Object.keys(CAT_META).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = CAT_META[slug];
  if (!meta) return {};
  return {
    title: `${meta.title}`,
    description: meta.description,
    alternates: { canonical: `https://troviio.com/c/${slug}` },
    openGraph: {
      title: `${meta.title}`,
      description: meta.description,
      url: `https://troviio.com/c/${slug}`,
      siteName: "Troviio",
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title}`,
      description: meta.description,
    },
  };
}

// Map des slugs de guide longtail existants (premier guide par catégorie)
const GUIDES_BY_CATEGORY: Record<string, string> = {
  "aspirateur-robot": "laveur-station-vidange",
  "aspirateur-balai": "guide-achat",
  "aspirateur-laveur": "guide-achat",
  "barre-de-son": "appartement-voisins",
  "camera-securite": "guide-achat",
  "casque-audio": "guide-achat",
  "cave-a-vin": "guide-achat",
  "climatiseur-portable": "guide-achat",
  "enceinte-bt": "guide-achat",
  "four-micro-ondes": "pyrolyse-vs-catalyse",
  "friteuse-air": "guide-achat",
  "imprimante": "guide-achat",
  "laptop-etudiant": "guide-achat",
  "laptop-gamer": "guide-achat",
  "lave-linge": "silencieux-appartement",
  "lave-vaisselle": "45cm-ou-60cm",
  "machine-a-cafe": "guide-achat",
  "matelas": "guide-achat",
  "onduleur-ups": "guide-achat",
  "ordinateur-portable": "autonomie-legere",
  "poussette": "terrain-mixte",
  "purificateur-air": "guide-achat",
  "refrigerateur": "grande-capacite-famille",
  "robot-cuisine": "guide-achat",
  "smartphone": "guide-achat",
  "station-charge-usb-c": "guide-achat",
  "thermostat-connecte": "guide-achat",
  "trottinette": "guide-achat",
  "tv": "salon-lumineux",
  "velo-electrique": "guide-achat",
  "ventilateur-colonne": "guide-achat",
  "accessoire-velo": "guide-achat",
  "bureau-electrique": "guide-achat",
  "clavier": "guide-achat",
  "four-encastrable": "guide-achat",
  "jeu-coop-local": "guide-achat",
  "manette-switch": "guide-achat",
  "montre-connectee": "guide-achat",
  "station-daccueil-usbc": "guide-achat",
  "tablette": "guide-achat",
  "ventilateur-classique": "guide-achat",
  "voiture-electrique": "guide-achat",
};
type Product = {
  id: string;
  name: string;
  brand: string;
  slug: string;
  image_url?: string;
  price_eur?: number;
  estimated_score?: number;
  pros?: string[];
  cons?: string[];
  specs?: Record<string, unknown>;
  amazon_asin?: string;
  affiliate_url?: string;
  merchant_links?: Array<{ merchant: string; url: string; affiliate_url?: string; price_eur?: number }>;
};

function getMerchantName(url: string): string {
  if (!url) return "Amazon";
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("amazon")) return "Amazon";
    if (hostname.includes("fnac")) return "Fnac";
    if (hostname.includes("darty")) return "Darty";
    if (hostname.includes("cdiscount")) return "Cdiscount";
    if (hostname.includes("ldlc")) return "LDLC";
    if (hostname.includes("boulanger")) return "Boulanger";
    if (hostname.includes("leboncoin")) return "Leboncoin";
    if (hostname.includes("ebay")) return "eBay";
    if (hostname.includes("materiel")) return "Materiel.net";
    if (hostname.includes("aliexpress")) return "AliExpress";
    return "Amazon"; // fallback
  } catch {
    return "Amazon";
  }
}

async function fetchProducts(slug: string): Promise<Product[]> {
  try {
    const apiUrl = process.env.API_BASE_URL || "http://backend:8000";
    const res = await fetch(`${apiUrl}/api/products/by-category/${slug}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || data || [];
  } catch {
    return [];
  }
}

function getAffiliateUrl(product: Product): string {
  if (product.affiliate_url) return product.affiliate_url;
  if (product.amazon_asin) return `https://www.amazon.fr/dp/${product.amazon_asin}?tag=troviio-21`;
  return `/produit/${product.slug}`;
}

function SpecItem({ label, value }: { label: string; value: string }) {
  if (!value || value === "false") return null;
  const display = value === "true" ? "Oui" : value;
  return (
    <div className="flex justify-between py-1 text-sm">
      <span className="text-[#8B8B9A]">{label}</span>
      <span className="text-right font-medium">{display}</span>
    </div>
  );
}

function Top3Card({ product, rank }: { product: Product; rank: number }) {
  const medals = ["🥇", "🥈", "🥉"];
  const score = product.estimated_score ?? 0;
  const price = ""; // No fixed prices — using affiliate button below
  const img = product.image_url || "";
  const productUrl = `/produit/${product.slug}`;
  const affiliateUrl = getAffiliateUrl(product);

  return (
    <div className="card-troviio p-5 flex flex-col items-center text-center relative overflow-hidden"
         style={{ animation: `troviio-card-slide-up 0.4s ease ${rank * 0.1}s both` }}>
      {/* Medal badge */}
      <div className="text-3xl mb-2">{medals[rank - 1]}</div>
      {rank === 1 && (
        <div className="absolute top-3 right-3 bg-[#FF6B5F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          Meilleur choix
        </div>
      )}
      {/* Image */}
      {img && (
        <div className="w-24 h-24 mb-3 flex items-center justify-center">
          <img src={img} alt={product.name} className="max-w-full max-h-full object-contain" />
        </div>
      )}
      {/* Name */}
      <h3 className="font-bold text-sm mb-1 leading-tight">
        {product.brand} {product.name}
      </h3>
      {/* Score */}
      {score > 0 && (
        <div className="text-lg font-bold" style={{ color: "var(--coral, #FF6B5F)" }}>
          {Math.round(score)}/100
        </div>
      )}
      {/* Price removed — replaced by affiliate button below */}
      {/* Buttons */}
      <div className="flex gap-2 w-full">
        <a href={productUrl} className="flex-1 text-center text-xs py-2 rounded-xl font-medium transition-all hover:brightness-110"
           style={{ backgroundColor: "var(--surface-light, #242840)", color: "var(--text, #FAFAFA)" }}>
          Voir la fiche
        </a>
        <a href={affiliateUrl} target="_blank" rel="noopener noreferrer sponsored"
           className="flex-1 text-center text-xs py-2 rounded-xl font-bold text-white transition-all hover:brightness-110"
           style={{ background: "linear-gradient(135deg, #FF6B5F 0%, #3ED6A3 100%)" }}>
          Voir le prix sur {getMerchantName(affiliateUrl)}
        </a>
      </div>
    </div>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const meta = CAT_META[slug];
  if (!meta) notFound();

  const products = await fetchProducts(slug);
  // Trier par score descendant
  const sorted = [...products].sort((a, b) => (b.estimated_score ?? 0) - (a.estimated_score ?? 0));
  const top3 = sorted.slice(0, 3);

  // Extraire les specs clés du top 1 pour le tableau comparatif
  const topSpecKeys = new Set<string>();
  if (top3.length > 0) {
    for (const p of top3) {
      if (p.specs && typeof p.specs === "object") {
        Object.keys(p.specs).slice(0, 8).forEach(k => topSpecKeys.add(k));
      }
    }
  }
  const itemListSchema = top3.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: meta.title,
    description: meta.description,
    url: `https://troviio.com/c/${slug}`,
    numberOfItems: top3.length,
    itemListElement: top3.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${p.brand} ${p.name}`,
        url: `https://troviio.com/produit/${p.slug}`,
        offers: p.price_eur ? {
          "@type": "Offer",
          price: p.price_eur,
          priceCurrency: "EUR",
        } : undefined,
      },
    })),
  } : null;

  return (
    <>
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}

      {/* Breadcrumb */}
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <Breadcrumbs
          crumbs={[
            { label: "Accueil", href: "/" },
            { label: `${meta.emoji} ${meta.name}` },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-display, Sora, sans-serif)" }}>
            {meta.emoji} {meta.title}
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#8B8B9A" }}>
            {meta.description}
          </p>
        </div>
      </section>

      {/* Chat IA */}
      <ChatHero category={slug} />

      {/* Top 3 Section */}
      {top3.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg-surface, #111113)" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: "var(--font-display, Sora, sans-serif)" }}>
              🏆 Top 3 des meilleurs {meta.name} en 2026
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {top3.map((product, i) => (
                <Top3Card key={product.id} product={product} rank={i + 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tableau comparatif Top 3 */}
      {top3.length >= 2 && topSpecKeys.size > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center">
              📊 Comparatif des meilleurs {meta.name}
            </h2>
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border, #1E1E24)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "var(--surface, #1A1D2E)" }}>
                    <th className="p-3 text-left font-semibold">Caractéristique</th>
                    {top3.map((p) => (
                      <th key={p.id} className="p-3 text-center font-semibold">
                        <span className="text-xs">{p.brand} {p.name}</span>
                        {p.estimated_score && (
                          <div className="text-[10px] font-bold" style={{ color: "var(--coral, #FF6B5F)" }}>
                            {Math.round(p.estimated_score)}/100
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Ligne prix - lien Amazon */}
                  <tr style={{ borderTop: "1px solid var(--border, #1E1E24)" }}>
                    <td className="p-3 font-medium" style={{ color: "#8B8B9A" }}>Prix</td>
                    {top3.map((p) => (
                      <td key={p.id} className="p-3 text-center font-semibold" style={{ color: "var(--mint, #3ED6A3)" }}>
                        <a href={getAffiliateUrl(p)} target="_blank" rel="noopener noreferrer sponsored"
                           className="text-xs underline decoration-dotted">
                          Voir →
                        </a>
                      </td>
                    ))}
                  </tr>
                  {/* Lignes specs */}
                  {Array.from(topSpecKeys).slice(0, 8).map((key) => (
                    <tr key={key} style={{ borderTop: "1px solid var(--border, #1E1E24)" }}>
                      <td className="p-3" style={{ color: "#8B8B9A" }}>{key}</td>
                      {top3.map((p) => {
                        const val = p.specs?.[key];
                        const display = val === true ? "Oui" : val === false ? "Non" : val ?? "—";
                        return <td key={p.id} className="p-3 text-center">{String(display)}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Grille des produits */}
      {products.length > 0 && (
        <section className="px-4 py-10 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg-subtle, #0C0C0E)" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold mb-6">
              Tous les {meta.name} testés ({products.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {sorted.slice(3).map((product) => {
                const score = product.estimated_score ?? 0;
                return (
                  <a key={product.id} href={`/produit/${product.slug}`}
                     className="rounded-xl p-4 flex flex-col items-center text-center transition-all hover:brightness-110"
                     style={{ backgroundColor: "var(--surface, #1A1D2E)", border: "1px solid var(--border, #1E1E24)" }}>
                    {product.image_url && (
                      <div className="w-16 h-16 mb-2 flex items-center justify-center">
                        <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <div className="text-xs font-medium leading-tight mb-1">
                      {product.brand} {product.name}
                    </div>
                    {score > 0 && (
                      <div className="text-xs font-bold mb-1" style={{ color: "var(--coral, #FF6B5F)" }}>
                        {Math.round(score)}/100
                      </div>
                    )}
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white"
                      style={{ background: "linear-gradient(135deg, #FF6B5F 0%, #3ED6A3 100%)" }}>
                      Voir le prix
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Guide d'achat */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">{meta.guide_title}</h2>
          <p className="text-sm leading-7 mb-4" style={{ color: "#8B8B9A" }}>
            {meta.guide_desc}
          </p>
          <p className="text-sm leading-7 mb-4" style={{ color: "#8B8B9A" }}>
            Troviio analyse votre profil complet : usage quotidien, contraintes d'espace,
            nombre d'utilisateurs et budget total. L'IA croise ces données avec des milliers
            d'avis vérifiés et les fiches techniques officielles pour vous recommander
            uniquement le produit qui correspond à VOTRE usage.
          </p>
          <p className="text-sm leading-7" style={{ color: "#8B8B9A" }}>
            Contrairement aux comparateurs traditionnels qui affichent les produits les mieux commissionnés,
            Troviio ne perçoit aucune rémunération des fabricants. Le choix reste 100% objectif.
          </p>
          {(() => {
            const guideSlug = GUIDES_BY_CATEGORY[slug];
            const href = guideSlug ? `/guide-longtail/${slug}/${guideSlug}` : `/c/${slug}#guides`;
            const label = guideSlug ? `📖 Lire le guide ${meta.name}` : `📖 Voir tous les guides ${meta.name}`;
            return (
              <div className="mt-6 text-center">
                <a href={href}
                   className="inline-block text-sm font-semibold py-3 px-6 rounded-xl text-white transition-all hover:brightness-110"
                   style={{ background: "linear-gradient(135deg, #FF6B5F 0%, #3ED6A3 100%)" }}>
                  {label}
                </a>
              </div>
            );
          })()}
        </div>
      </section>

      {/* SEO text — intro longue */}
      {SEO_INTRO[slug] && (
        <section className="px-4 py-10 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg-subtle, #0C0C0E)" }}>
          <div className="max-w-3xl mx-auto">
            <p className="text-sm leading-7" style={{ color: "#8B8B9A" }}>
              {SEO_INTRO[slug]}
            </p>
          </div>
        </section>
      )}

      {/* SEO text */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs leading-6" style={{ color: "#6B6B7A" }}>
            * Les prix indiqués sont susceptibles de varier. Troviio participe au Programme
            d'Associés d'Amazon EU, un programme d'affiliation qui nous permet de percevoir
            une commission sur les achats effectués via nos liens, sans surcoût pour vous.
          </p>
        </div>
      </section>
    </>
  );
}
