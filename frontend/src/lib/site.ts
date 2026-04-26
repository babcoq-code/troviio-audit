import type { SiteConfig } from "@/types"

export type SiteConfig = {
  name: string
  slogan: string
  description: string
  url: string
  ogImage: string
  publisherName: string
  publisherSiret: string
  publisherAddress: string
  publisherEmail: string
  publisherPhone: string
  publisherRcs: string
  publisherTva: string
  hostName: string
  hostAddress: string
  hostEmail: string
  cnilNumber: string
  editorName: string
  editorAddress: string
  editorEmail: string
  directorName: string
}

export const siteConfig: SiteConfig = {
  name: "Picksy",
  slogan: "C'est l'objet qui s'adapte à TOI, pas l'inverse",
  description:
    "Picksy est un comparateur intelligent de produits maison. L'IA analyse des centaines de sources techniques pour vous recommander le produit parfait pour vos besoins.",
  url: "https://picksy.babcoq.tech",
  ogImage: "https://picksy.babcoq.tech/og-image.png",

  // === Informations éditeur (à remplacer par les vraies) ===
  publisherName: "Sébastien Babcoq",
  publisherSiret: "xxx xxx xxx xxxxx",
  publisherAddress: "Adresse professionnelle à renseigner",
  publisherEmail: "contact@picksy.fr",
  publisherPhone: "+33 x xx xx xx xx",
  publisherRcs: "RCS xxx xxx xxx",
  publisherTva: "FRxx xxxxxxxxxx",

  // === Hébergeur ===
  hostName: "Hostinger International Ltd.",
  hostAddress: "61 Lordou Vironos Street, 6023 Larnaca, Chypre",
  hostEmail: "support@hostinger.com",

  // === CNIL ===
  cnilNumber: "xxxxx", // Numéro de déclaration CNIL si applicable

  // === Responsable publication ===
  editorName: "Sébastien Babcoq",
  editorAddress: "Adresse professionnelle à renseigner",
  editorEmail: "contact@picksy.fr",
  directorName: "Sébastien Babcoq",
}
