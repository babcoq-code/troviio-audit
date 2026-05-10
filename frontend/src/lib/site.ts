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
  publisherName: "Sébastien Babcoq",
  publisherSiret: "932 285 448 00019",
  publisherAddress: "12 Rue du Faubourg Poissonnière",
  publisherEmail: "contact@troviio.com",
  publisherPhone: "+33 1 84 80 74 30",
  publisherRcs: "Paris 932 285 448",
  publisherTva: "FR34932285448",

  // === Hébergeur ===
  hostName: "Hetzner GmbH",
  hostAddress: "Guntherstraße 9b, 90461 Nürnberg, Allemagne",
  hostEmail: "support@hetzner.com",

  // === CNIL ===
  cnilNumber: "xxxxx",

  // === Responsable publication ===
  editorName: "Sébastien Babcoq",
  editorAddress: "12 Rue du Faubourg Poissonnière, 75010 Paris",
  editorEmail: "contact@troviio.com",
  directorName: "Sébastien B.",

  // === Objets pour compatibilité pages légales ===
  publisher: {
    name: "Sébastien Babcoq",
    siret: "932 285 448 00019",
    address: "12 Rue du Faubourg Poissonnière",
    postalCode: "75010",
    city: "Paris",
    country: "France",
    phone: "+33 1 84 80 74 30",
  },
  hosting: {
    name: "Hetzner GmbH",
    address: "Guntherstraße 9b, 90461 Nürnberg, Allemagne",
    phone: "+49 911 52525-0",
    website: "https://www.hetzner.com",
  },
}
