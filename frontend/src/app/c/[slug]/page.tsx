import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ChatHero from "@/components/ChatHero";

interface Props {
  params: Promise<{ slug: string }>;
}

type CatMeta = {
  name: string; emoji: string;
  title: string; description: string;
};

const CAT_META: Record<string, CatMeta> = {
  "aspirateurs-robots":       { name: "Robot aspirateur",    emoji: "🤖", title: "Meilleur robot aspirateur 2026",    description: "Trouve le robot aspirateur parfait : parquet, animaux, appartement ou maison. Comparatif IA personnalisé." },
  "aspirateurs-balai":        { name: "Aspirateur balai",    emoji: "🧹", title: "Meilleur aspirateur balai 2026",    description: "Sans fil, léger, puissant : Troviio sélectionne l'aspirateur balai adapté à ton logement." },
  "lave-linge":               { name: "Lave-linge",          emoji: "🌀", title: "Meilleur lave-linge 2026",          description: "Capacité, bruit, consommation : Troviio choisit le lave-linge fait pour ta famille." },
  "lave-vaisselle":           { name: "Lave-vaisselle",      emoji: "🍽️", title: "Meilleur lave-vaisselle 2026",      description: "Taille, silence, éco : Troviio sélectionne le lave-vaisselle pour ton usage réel." },
  "refrigerateurs":           { name: "Réfrigérateur",       emoji: "🧊", title: "Meilleur réfrigérateur 2026",       description: "Volume, No Frost, multi-portes : Troviio trouve le frigo adapté à ton foyer." },
  "purificateurs-air":        { name: "Purificateur d'air",  emoji: "💨", title: "Meilleur purificateur d'air 2026",  description: "Allergies, asthme, surface : Troviio sélectionne le purificateur d'air efficace pour toi." },
  "friteuses-air":            { name: "Friteuse à air",      emoji: "🍟", title: "Meilleure friteuse à air 2026",     description: "Capacité, rapidité, nettoyage : Troviio choisit la friteuse à air adaptée à ta famille." },
  "machines-a-cafe":          { name: "Machine à café",      emoji: "☕", title: "Meilleure machine à café 2026",     description: "Grains, capsules, silence, entretien : Troviio choisit la machine à café faite pour ta vie." },
  "robots-cuisine":           { name: "Robot cuisine",       emoji: "🍳", title: "Meilleur robot de cuisine 2026",    description: "Pâtisserie, cuisson, polyvalence : Troviio trouve le robot cuisine pour tes besoins." },
  "caves-a-vin":              { name: "Cave à vin",          emoji: "🍷", title: "Meilleure cave à vin 2026",         description: "Capacité, température, style : Troviio sélectionne la cave à vin pour ta collection." },
  "tv-oled":                  { name: "TV OLED",             emoji: "📺", title: "Meilleure TV OLED 2026",            description: "Salon lumineux, gaming, cinéma : Troviio sélectionne la TV OLED pour ton usage réel." },
  "casques-audio":            { name: "Casque audio",        emoji: "🎧", title: "Meilleur casque audio 2026",        description: "Nomade, réduction de bruit, qualité son : Troviio choisit le casque adapté à toi." },
  "smartphones":              { name: "Smartphone",          emoji: "📱", title: "Meilleur smartphone 2026",          description: "Photo, batterie, iOS ou Android : Troviio trouve le smartphone qui te correspond." },
  "ordinateurs-portables":    { name: "Laptop étudiant",     emoji: "💻", title: "Meilleur laptop étudiant 2026",     description: "Légèreté, autonomie, perfs : Troviio choisit le laptop idéal pour tes études ou ton travail." },
  "imprimantes":              { name: "Imprimante",          emoji: "🖨️", title: "Meilleure imprimante 2026",         description: "Jet d'encre, laser, couleur : Troviio sélectionne l'imprimante pour ton usage." },
  "barres-de-son":            { name: "Barre de son",        emoji: "🔊", title: "Meilleure barre de son 2026",       description: "TV, gaming, Dolby Atmos : Troviio choisit la barre de son pour ton salon." },
  "cameras-securite":         { name: "Caméra sécurité",     emoji: "📷", title: "Meilleure caméra de sécurité 2026", description: "Intérieur, extérieur, cloud ou local : Troviio sécurise ta maison intelligemment." },
  "thermostats-connectes":    { name: "Thermostat connecté", emoji: "🌡️", title: "Meilleur thermostat connecté 2026", description: "Économies, confort, compatibilité : Troviio optimise ton chauffage." },
  "trottinettes-electriques": { name: "Trottinette élec.",   emoji: "🛴", title: "Meilleure trottinette électrique 2026", description: "Autonomie, poids, homologuée France : Troviio trouve ta trottinette idéale." },
  "velos-electriques":        { name: "Vélo électrique",     emoji: "🚲", title: "Meilleur vélo électrique 2026",     description: "Urbain, VTT, autonomie : Troviio choisit le VAE adapté à tes trajets." },
  "matelas":                  { name: "Matelas",             emoji: "🛏️", title: "Meilleur matelas 2026",             description: "Fermeté, morphologie, couple, allergies : Troviio personnalise le choix de ton matelas." },
  "poussettes":               { name: "Poussette",           emoji: "👶", title: "Meilleure poussette 2026",          description: "Légère, pliable, tout terrain, nouveau-né : Troviio trouve la poussette parfaite pour toi." },
};

export async function generateStaticParams() {
  return Object.keys(CAT_META).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = CAT_META[slug];
  if (!meta) return {};
  return {
    title: `${meta.title} — Troviio`,
    description: meta.description,
    alternates: { canonical: `https://www.troviio.com/c/${slug}` },
    openGraph: {
      title: `${meta.title} — Troviio`,
      description: meta.description,
      url: `https://www.troviio.com/c/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const meta = CAT_META[slug];
  if (!meta) notFound();

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.troviio.com" },
      { "@type": "ListItem", position: 2, name: meta.name, item: `https://www.troviio.com/c/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Breadcrumb */}
      <div className="pt-24 px-4 max-w-7xl mx-auto" style={{ color: "#8B8B9A" }}>
        <nav className="text-sm flex items-center gap-2">
          <a href="/" style={{ color: "#8B8B9A" }} className="hover:underline">Accueil</a>
          <span>›</span>
          <span style={{ color: "#FAFAFA" }}>{meta.emoji} {meta.name}</span>
        </nav>
      </div>

      {/* Chat IA en premier */}
      <ChatHero category={slug} />

      {/* Section SEO */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8" style={{ backgroundColor: "#0A0A0B" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#FAFAFA" }}>
            Comment Troviio choisit ton {meta.name.toLowerCase()} ?
          </h2>
          <div className="space-y-3 text-sm leading-7" style={{ color: "#8B8B9A" }}>
            <p>
              Troviio analyse ton profil complet : usage quotidien, contraintes d'espace,
              nombre d'utilisateurs, budget total et budget d'usage (consommables, entretien).
              L'IA croise ces données avec des milliers d'avis vérifiés et les fiches techniques officielles.
            </p>
            <p>
              Contrairement aux comparateurs traditionnels qui affichent les produits les mieux commissionnés,
              Troviio ne perçoit aucune rémunération des fabricants. Nos liens Amazon Associates
              sont identiques pour tous les produits — le choix reste 100% objectif.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
