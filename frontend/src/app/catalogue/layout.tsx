import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue — Tous les produits notés par l'IA",
  description:
    "Parcours le catalogue complet Troviio : smartphones, TV, aspirateurs, cafetières... Tous notés /100 par notre IA indépendante. Zéro sponsor.",
  openGraph: {
    title: "Catalogue Troviio — Tous les produits notés par l'IA",
    description:
      "Parcours le catalogue complet Troviio : smartphones, TV, aspirateurs, cafetières... Tous notés /100 par notre IA indépendante.",
    siteName: "Troviio",
    locale: "fr_FR",
    url: "https://www.troviio.com/catalogue",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalogue Troviio — Tous les produits notés par l'IA",
    description:
      "Parcours le catalogue complet Troviio, tous notés /100 par notre IA.",
  },
  alternates: {
    canonical: "https://www.troviio.com/catalogue",
  },
};

export default function CatalogueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
