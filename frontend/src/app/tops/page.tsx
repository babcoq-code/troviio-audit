import type { Metadata } from "next";
import TopsClient from "./TopsClient";
import { JsonLd, buildBreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Top 3 Troviio — Les meilleurs produits par catégorie",
  description:
    "Les 3 meilleurs produits dans chaque catégorie, sélectionnés et notés par l'IA Troviio. Pas de sponsor, que des tests.",
  alternates: { canonical: "https://troviio.com/tops" },
  openGraph: {
    title: "Top 3 Troviio — Les meilleurs produits par catégorie",
    description: "Les 3 meilleurs produits dans chaque catégorie. Pas de sponsor, que des tests.",
    url: "https://troviio.com/tops",
    siteName: "Troviio",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 3 Troviio — Les meilleurs produits par catégorie",
    description: "Les 3 meilleurs produits dans chaque catégorie. Pas de sponsor, que des tests.",
  },
};

const TOP_CATEGORIES = [
  { name: "Aspirateur robot", url: "https://troviio.com/tops/meilleur-aspirateur-robot" },
  { name: "Machine à café", url: "https://troviio.com/tops/meilleure-machine-a-cafe" },
  { name: "TV", url: "https://troviio.com/tops/meilleure-tv" },
  { name: "Aspirateur balai", url: "https://troviio.com/tops/meilleur-aspirateur-balai" },
  { name: "Friteuse à air", url: "https://troviio.com/tops/meilleure-friteuse-air" },
  { name: "Casque audio", url: "https://troviio.com/tops/meilleur-casque-audio" },
  { name: "Robot cuisine", url: "https://troviio.com/tops/meilleur-robot-cuisine" },
  { name: "Bureau électrique", url: "https://troviio.com/tops/meilleur-bureau-electrique" },
  { name: "Clavier gaming", url: "https://troviio.com/tops/meilleur-clavier-gaming" },
  { name: "Voiture électrique", url: "https://troviio.com/tops/meilleure-voiture-electrique" },
  { name: "Station accueil USB-C", url: "https://troviio.com/tops/meilleure-station-accueil-usbc" },
  { name: "Montre connectée", url: "https://troviio.com/tops/meilleure-montre-connectee" },
];

export default async function TopsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@type": "ItemList",
          url: "https://troviio.com/tops",
          name: "Top 3 Troviio — Les meilleurs produits par catégorie",
          description: "Les 3 meilleurs produits dans chaque catégorie, sélectionnés et notés par l'IA Troviio.",
          numberOfItems: TOP_CATEGORIES.length,
          itemListElement: TOP_CATEGORIES.map((cat, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: cat.url,
            name: `Top 3: ${cat.name}`,
          })),
        }}
      />
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: "Accueil", url: "https://troviio.com" },
        { name: "Top 3 Troviio" },
      ])} />
      <Breadcrumbs
        crumbs={[
          { label: "Accueil", href: "/" },
          { label: "Top 3" },
        ]}
      />
      <TopsClient />
    </>
  );
}
