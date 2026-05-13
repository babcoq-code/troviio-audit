import type { Metadata } from "next";
import HomePageClient from "./page.client";
import { JsonLd, buildWebSiteJsonLd, buildOrganizationJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Troviio | Pas le meilleur. Le tien.",
  description: "Décris ta vie, tes contraintes, ton budget. Troviio croise tout pour te donner UNE réponse claire.",
  alternates: { canonical: "https://troviio.com/" },
  openGraph: {
    title: "Troviio | Pas le meilleur. Le tien.",
    description: "Décris ta vie, tes contraintes, ton budget. L'IA qui trouve le produit parfait pour toi.",
    url: "https://troviio.com/",
    siteName: "Troviio",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Troviio | Pas le meilleur. Le tien.",
    description: "Décris ta vie, tes contraintes, ton budget. L'IA qui trouve le produit parfait pour toi.",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildOrganizationJsonLd()} />
      <HomePageClient />
    </>
  );
}
// FORCE_REBUILD: 1778615825
