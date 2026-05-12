import type { SiteConfig } from "@/types"

export type LegalPage = {
  title: string;
  href: string;
  emoji?: string;
};

export const legalPages: LegalPage[] = [
  { title: "Mentions légales", href: "/mentions-legales", emoji: "⚖️" },
  { title: "Politique de confidentialité", href: "/politique-confidentialite", emoji: "🔒" },
  { title: "Cookies", href: "/cookies", emoji: "🍪" },
  { title: "Affiliation", href: "/affiliation", emoji: "🤝" },
  { title: "CGV", href: "/cgv", emoji: "📋" },
  { title: "Contact", href: "/contact", emoji: "✉️" },
  { title: "Blog", href: "/blog", emoji: "📝" },
  { title: "Méthodologie", href: "/methodologie", emoji: "📊" },
  { title: "À propos", href: "/a-propos", emoji: "ℹ️" },
];

export const siteConfig: SiteConfig = {
  name: "Troviio",
  slogan: "C'est l'objet qui s'adapte à TOI, pas l'inverse",
  description:
    "Troviio est un comparateur intelligent de produits maison. L'IA analyse des centaines de sources techniques pour vous recommander le produit parfait pour vos besoins.",
  url: "https://troviio.com",
  ogImage: "https://troviio.com/og-image.png",

  // === Informations éditeur ===
  publisherName: "Troviio SAS",
  publisherSiret: "365 497 375 00019",
  publisherAddress: "128 Rue de Rivoli",
  publisherEmail: "contact@troviio.com",
  publisherPhone: "+33 1 85 14 92 20",
  publisherRcs: "Paris 365 497 375",
  publisherTva: "FR78365497375",

  // === Hébergeur ===
  hostName: "Hetzner GmbH",
  hostAddress: "Guntherstraße 9b, 90461 Nürnberg, Allemagne",
  hostEmail: "support@hetzner.com",

  // === CNIL ===
  cnilNumber: "xxxxx",

  // === Responsable publication ===
  editorName: "Troviio SAS",
  editorAddress: "128 Rue de Rivoli, 75001 Paris",
  editorEmail: "contact@troviio.com",
  directorName: "Sébastien Babcoq",

  // === Objets pour compatibilité pages légales ===
  publisher: {
    name: "Troviio SAS",
    siret: "365 497 375 00019",
    address: "128 Rue de Rivoli",
    postalCode: "75001",
    city: "Paris",
    country: "France",
    phone: "+33 1 85 14 92 20",
  },
  hosting: {
    name: "Hetzner GmbH",
    address: "Guntherstraße 9b, 90461 Nürnberg, Allemagne",
    phone: "+49 911 52525-0",
    website: "https://www.hetzner.com",
  },
}
