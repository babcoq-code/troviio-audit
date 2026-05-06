export interface CrossLink {
  slug: string;
  label: string;
  reason: string;
}

export const CROSS_LINKING_MAP: Record<string, CrossLink[]> = {
  "aspirateur-robot": [
    { slug: "/c/tv", label: "TV OLED", reason: "Complétez votre salon connecté" },
    { slug: "/c/lave-linge", label: "Lave-linge", reason: "Entretien maison complet" },
    { slug: "/c/barre-de-son", label: "Barre de son", reason: "Autre best-seller maison" },
  ],
  tv: [
    { slug: "/c/barre-de-son", label: "Barre de son", reason: "Indispensable pour profiter pleinement du son" },
    { slug: "/c/ordinateur-portable", label: "PC portable", reason: "Autre achat high-tech fréquent" },
  ],
  "barre-de-son": [
    { slug: "/c/tv", label: "TV OLED", reason: "Pour un combo image + son haut de gamme" },
    { slug: "/c/refrigerateur", label: "Réfrigérateur", reason: "Autre équipement maison populaire" },
  ],
  "lave-linge": [
    { slug: "/c/lave-vaisselle", label: "Lave-vaisselle", reason: "Complétez votre électroménager" },
    { slug: "/c/refrigerateur", label: "Réfrigérateur", reason: "Grands appareils cuisine" },
  ],
  "lave-vaisselle": [
    { slug: "/c/lave-linge", label: "Lave-linge", reason: "Gros électroménager à planifier ensemble" },
    { slug: "/c/refrigerateur", label: "Réfrigérateur", reason: "Compléter la cuisine" },
  ],
  refrigerateur: [
    { slug: "/c/lave-vaisselle", label: "Lave-vaisselle", reason: "Équipement cuisine complet" },
    { slug: "/c/four-micro-ondes", label: "Four micro-ondes", reason: "Cuisine intégrée complète" },
  ],
  "ordinateur-portable": [
    { slug: "/c/machine-a-cafe", label: "Machine à café", reason: "Pour les étudiants en révision" },
    { slug: "/c/casque-audio", label: "Casque audio", reason: "Travailler en concentration" },
  ],
  poussette: [
    { slug: "/c/lave-linge", label: "Lave-linge", reason: "Avec l'arrivée d'un bébé" },
  ],
  "four-micro-ondes": [
    { slug: "/c/refrigerateur", label: "Réfrigérateur", reason: "Cuisine intégrée complète" },
    { slug: "/c/lave-vaisselle", label: "Lave-vaisselle", reason: "Gros électroménager à planifier" },
  ],
  "machine-a-cafe": [
    { slug: "/c/refrigerateur", label: "Réfrigérateur", reason: "Cuisine équipée" },
  ],
  "aspirateur-balai": [
    { slug: "/c/aspirateur-robot", label: "Robot aspirateur", reason: "Alternative automatique" },
  ],
};

export function getCrossLinks(categorySlug: string, max = 3): CrossLink[] {
  return (CROSS_LINKING_MAP[categorySlug] ?? []).slice(0, max);
}
