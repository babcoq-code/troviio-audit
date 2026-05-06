import type { Metadata } from "next";
import TopsClient from "./TopsClient";

export const metadata: Metadata = {
  title: "Top 3 Troviio — Les meilleurs produits par catégorie",
  description:
    "Les 3 meilleurs produits dans chaque catégorie, sélectionnés et notés par l'IA Troviio. Pas de sponsor, que des tests.",
  alternates: { canonical: "https://www.troviio.com/tops" },
  openGraph: {
    title: "Top 3 Troviio — Les meilleurs produits par catégorie",
    description: "Les 3 meilleurs produits dans chaque catégorie. Pas de sponsor, que des tests.",
    url: "https://www.troviio.com/tops",
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

export default async function TopsPage() {
  // Les tops sont chargés côté client via TopsClient
  return <TopsClient />;
}
