export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://troviio.com'
).replace(/\/$/, '');

export const AMAZON_TAG = 'troviio-21';

export const CATEGORIES = [
  'aspirateur-robot', 'aspirateur-balai', 'tv', 'ordinateur-portable',
  'lave-linge', 'lave-vaisselle', 'refrigerateur', 'poussette',
  'barre-de-son', 'four-micro-ondes', 'machine-a-cafe', 'smartphone',
  'casque-audio', 'enceinte-bt', 'cave-a-vin', 'purificateur-air',
  'robot-cuisine', 'trottinette', 'velo-electrique', 'matelas',
  'imprimante', 'camera-securite', 'thermostat-connecte', 'friteuse-air',
  'aspirateur-laveur', 'laptop-gamer', 'laptop-etudiant',
  'climatiseur-portable', 'ventilateur-colonne', 'station-charge-usb-c',
  'onduleur-ups',
  'tablette', 'manette-switch', 'jeu-coop-local', 'ventilateur-classique',
] as const;

export type CategorySlug = typeof CATEGORIES[number];
