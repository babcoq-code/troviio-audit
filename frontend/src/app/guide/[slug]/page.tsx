import { notFound } from "next/navigation";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────

interface GuideMeta {
  title: string;
  slug: string;
  category: string;
  emoji: string;
  date: string;
  description: string;
  canonical: string;
  ogImage: string;
  faq: { question: string; answer: string }[];
}

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Guide Metadata Registry ───────────────────────────────

const GUIDES_META: Record<string, GuideMeta> = {
  "meilleur-lave-linge": {
    title: "Meilleur lave-linge 2026 : le guide complet pour choisir sa machine à laver",
    slug: "meilleur-lave-linge",
    category: "lave-linge",
    emoji: "🌀",
    date: "2026-04-29",
    description: "Découvre comment choisir ton lave-linge en 2026 : capacité, essorage, bruit, consommation. Guide d'achat complet avec comparatif et FAQ Troviio.",
    canonical: "https://troviio.com/guide/meilleur-lave-linge",
    ogImage: "https://troviio.com/og-guide-lave-linge.jpg",
    faq: [
      { question: "Quelle capacité de lave-linge choisir pour une famille de 4 personnes ?", answer: "Pour une famille de 4 personnes, un lave-linge de 7 à 8 kg est recommandé. Cela permet de laver les draps, les serviettes et le linge quotidien en une seule fois." },
      { question: "Lave-linge hublot ou top : lequel choisir ?", answer: "Le hublot est plus économe en eau et en énergie, s'intègre sous plan de travail et permet de poser un sèche-linge dessus. Le top est plus compact et ne nécessite pas de se baisser." },
      { question: "Quelle vitesse d'essorage est idéale ?", answer: "1200 à 1400 tr/min est le bon compromis pour la plupart des foyers : le linge ressort bien essoré sans être trop froissé." },
      { question: "Quelle est la meilleure marque de lave-linge en 2026 ?", answer: "Les marques les plus fiables restent Miele, Bosch, Siemens et LG. Miele est la référence en durabilité, Bosch/Siemens excellent dans le rapport qualité-prix, et LG innove avec ses moteurs à entraînement direct." },
    ],
  },
  "meilleur-aspirateur-balai": {
    title: "Meilleur aspirateur balai 2026 : le guide complet sans fil",
    slug: "meilleur-aspirateur-balai",
    category: "aspirateurs-balai",
    emoji: "🧹",
    date: "2026-04-29",
    description: "Aspirateur balai sans fil : autonomie, puissance, poids, budget. Le guide d'achat complet Troviio pour trouver le meilleur aspirateur balai en 2026.",
    canonical: "https://troviio.com/guide/meilleur-aspirateur-balai",
    ogImage: "https://troviio.com/og-guide-aspirateur-balai.jpg",
    faq: [
      { question: "Quelle autonomie minimum pour un aspirateur balai ?", answer: "Pour un appartement (40-60m²), 25-30 minutes d'autonomie en mode standard suffisent. Pour une maison (80-120m²), vise 40-60 minutes minimum." },
      { question: "Quelle puissance d'aspiration est suffisante ?", answer: "Exprimée en Air Watts (AW), une bonne aspiration commence à 120 AW pour un appartement. Pour une maison avec moquettes et animaux, 150-200 AW sont recommandés." },
      { question: "Les aspirateurs balai sont-ils efficaces pour les poils d'animaux ?", answer: "Oui, à condition de choisir un modèle avec une brosse motorisée anti-emmêlement. Ces brosses évitent que les poils s'enroulent autour du rouleau." },
      { question: "Quel entretien pour un aspirateur balai ?", answer: "Vide le bac après chaque utilisation. Lave le filtre lavable tous les mois. Détache les poils de la brosse toutes les 2 semaines si tu as des animaux." },
    ],
  },
  "meilleur-robot-cuisine": {
    title: "Meilleur robot de cuisine 2026 : le guide complet multifonction",
    slug: "meilleur-robot-cuisine",
    category: "robots-cuisine",
    emoji: "🍳",
    date: "2026-04-29",
    description: "Robot cuiseur, pâtissier ou multifonction : le guide complet 2026 pour choisir ton robot de cuisine. Comparatif des meilleurs modèles et conseils Troviio.",
    canonical: "https://troviio.com/guide/meilleur-robot-cuisine",
    ogImage: "https://troviio.com/og-guide-robot-cuisine.jpg",
    faq: [
      { question: "Robot pâtissier ou robot cuiseur : quelle différence ?", answer: "Un robot pâtissier (KitchenAid, Kenwood) est conçu pour mélanger, battre et pétrir. Un robot cuiseur (Thermomix, Monsieur Cuisine) combine pesée, cuisson, hachage et mixage." },
      { question: "Quel robot de cuisine pour un débutant ?", answer: "Le Monsieur Cuisine Connect de Lidl est parfait pour débuter : il coûte 329€, fait presque tout comme un Thermomix, et sa communauté est très active." },
      { question: "Quelle capacité pour une famille de 4 personnes ?", answer: "Pour une famille de 4 personnes, vise un bol d'au moins 3 litres pour un robot cuiseur, et 4,5 litres pour un robot pâtissier." },
      { question: "Quel budget prévoir pour un bon robot de cuisine ?", answer: "Compte 200-400€ pour un robot cuiseur d'entrée de gamme (Monsieur Cuisine, Moulinex), 500-900€ pour un milieu de gamme (Kenwood, Magimix), et 1 200-1 500€ pour le haut de gamme (Thermomix, KitchenAid)." },
    ],
  },
  "meilleur-casque-audio": {
    title: "Meilleur casque audio 2026 : le guide complet (sans fil, nomade, Hi-Fi)",
    slug: "meilleur-casque-audio",
    category: "casques-audio",
    emoji: "🎧",
    date: "2026-04-29",
    description: "Casque audio sans fil, réduction de bruit, Hi-Fi, gaming ou sport : le guide complet 2026 pour choisir le meilleur casque audio selon ton usage.",
    canonical: "https://troviio.com/guide/meilleur-casque-audio",
    ogImage: "https://troviio.com/og-guide-casque-audio.jpg",
    faq: [
      { question: "Casque ouvert ou fermé : quelle différence ?", answer: "Un casque fermé isole de l'extérieur et ne fait pas fuir le son — idéal pour les transports et le bureau. Un casque ouvert offre une scène sonore plus large — parfait pour l'écoute à la maison." },
      { question: "Quelle est la meilleure marque de casque audio en 2026 ?", answer: "Sony et Bose dominent pour les casques sans fil à réduction de bruit. Sennheiser règne sur la Hi-Fi. Apple excelle dans l'écosystème avec les AirPods Max." },
      { question: "Casque à réduction de bruit active : est-ce utile au quotidien ?", answer: "Oui, si tu utilises ton casque dans les transports ou en open space. L'ANC supprime les bruits continus et améliore l'écoute à bas volume." },
      { question: "Quel budget pour un bon casque audio ?", answer: "Pour un bon casque nomade sans fil, compte 150-250€ (Sony WH-1000XM4). Pour le très haut de gamme, 300-400€ (Sony WH-1000XM6, Bose QC Ultra)." },
    ],
  },
  "meilleur-ordinateur-portable": {
    title: "Meilleur ordinateur portable 2026 : le guide complet (étudiant, pro, gaming)",
    slug: "meilleur-ordinateur-portable",
    category: "ordinateurs-portables",
    emoji: "💻",
    date: "2026-04-29",
    description: "Quel ordinateur portable choisir en 2026 ? PC ou Mac, étudiant ou pro, gaming ou bureautique : guide complet avec comparatif des meilleurs laptops.",
    canonical: "https://troviio.com/guide/meilleur-ordinateur-portable",
    ogImage: "https://troviio.com/og-guide-ordinateur-portable.jpg",
    faq: [
      { question: "Mac ou PC : lequel choisir en 2026 ?", answer: "Mac (Apple Silicon M4/M5) : meilleure autonomie, silence, écosystème. PC (Windows) : plus de choix, gaming, meilleur rapport qualité-prix en entrée de gamme." },
      { question: "Quelle configuration pour un étudiant ?", answer: "Pour un étudiant : MacBook Air M4 ou PC à 600-800€ (16 Go RAM, SSD 512 Go). Pour ingénierie/design : 32 Go RAM, bon GPU, SSD 1 To." },
      { question: "16 Go de RAM, est-ce suffisant en 2026 ?", answer: "Oui, 16 Go est le nouveau minimum conseillé. 8 Go est insuffisant dès que tu ouvres plusieurs applications. Pour gaming ou montage vidéo, vise 32 Go." },
      { question: "Quelle autonomie pour un usage nomade ?", answer: "Pour un usage nomade quotidien, l'autonomie réelle devrait être d'au moins 8-10 heures. Les MacBook Air M4/M5 tiennent 14-16 heures en usage réel." },
    ],
  },
  "meilleur-velo-electrique": {
    title: "Meilleur vélo électrique 2026 : le guide complet pour choisir son VAE",
    slug: "meilleur-velo-electrique",
    category: "velo-electrique",
    emoji: "🚲",
    date: "2026-05-01",
    description: "Vélo électrique : autonomie, moteur, batterie, budget. Le guide d'achat complet Troviio pour trouver le meilleur VAE en 2026, du city bike au VTT électrique.",
    canonical: "https://troviio.com/guide/meilleur-velo-electrique",
    ogImage: "https://troviio.com/og-guide-velo-electrique.jpg",
    faq: [
      { question: "Quelle autonomie pour un vélo électrique en usage quotidien ?", answer: "Pour un usage quotidien (trajets domicile-travail de 10-20 km), une autonomie de 60-80 km est largement suffisante. Pour des balades loisir le week-end, vise 100-150 km. Attention : l'autonomie réelle est généralement 30 à 50% inférieure à l'autonomie annoncée selon le relief, le vent et l'assistance choisie." },
      { question: "Moteur roue avant, roue arrière ou pédalier : lequel choisir ?", answer: "Le moteur pédalier (Bosch, Brose, Shimano) est le meilleur choix : il offre une sensation de conduite naturelle, un meilleur couple pour les côtes, et préserve les composants. Les moteurs roue sont plus économiques mais moins agréables en usage vallonné." },
      { question: "Quelle batterie choisir : batterie intégrée ou amovible ?", answer: "La batterie amovible est fortement recommandée si tu vis en appartement ou si tu n'as pas de prise près de ton vélo. Elle te permet de recharger chez toi ou au bureau sans déplacer le vélo. Les batteries intégrées offrent un look plus épuré mais contraignent la recharge." },
      { question: "Quel budget pour un bon vélo électrique en 2026 ?", answer: "Compte 1 000-1 500€ pour un VAE d'entrée de gamme correct (moteur roue, batterie 400 Wh), 1 800-2 500€ pour un milieu de gamme avec moteur pédalier Bosch/Brose, et 3 000-5 000€ pour le haut de gamme (batterie 625+ Wh, moteur performant, composants Shimano/SRAM de qualité)." },
    ],
  },
  "meilleur-aspirateur-robot": {
    title: "Meilleur aspirateur robot 2026 : le guide complet pour un sol propre sans effort",
    slug: "meilleur-aspirateur-robot",
    category: "aspirateurs-robot",
    emoji: "🤖",
    date: "2026-05-01",
    description: "Aspirateur robot : navigation, aspiration, lavage, autonomie. Le guide d'achat complet Troviio pour choisir le meilleur robot aspirateur en 2026.",
    canonical: "https://troviio.com/guide/meilleur-aspirateur-robot",
    ogImage: "https://troviio.com/og-guide-aspirateur-robot.jpg",
    faq: [
      { question: "Aspirateur robot avec ou sans station de vidage : quelle différence ?", answer: "Une station de vidage permet au robot de se vider automatiquement dans un sac ou un réservoir — tu n'as plus à toucher au bac pendant 30 à 60 jours. C'est un vrai confort mais la station prend plus de place et coûte plus cher (100-200€ de plus). Sans station, tu dois vider le bac après 1 à 3 passages selon la surface." },
      { question: "Quelle puissance d'aspiration est suffisante pour un aspirateur robot ?", answer: "Une aspiration de 2 500 à 4 000 Pa est suffisante pour les sols durs et les tapis à poils courts. Pour les moquettes épaisses et les animaux, vise 4 000-6 000 Pa. Les modèles récents offrent une aspiration ajustable automatiquement selon le type de sol." },
      { question: "Les aspirateurs robots sont-ils compatibles avec les animaux domestiques ?", answer: "Oui, la plupart des modèles milieu et haut de gamme sont excellents avec les animaux. Privilégie un modèle avec une brosse anti-emmêlement, une aspiration puissante (4 000+ Pa), et un bon système de filtration (HEPA) pour les allergènes. La programmation quotidienne est idéale pour gérer les poils." },
      { question: "Quelle est la meilleure marque d'aspirateur robot en 2026 ?", answer: "iRobot (Roomba) reste la référence historique avec une fiabilité éprouvée. Roborock et Dreame dominent le rapport qualité-prix avec une excellente navigation LiDAR. Ecovacs (Deebot) propose des modèles avec serpillère intégrée très performants. Xiaomi offre le meilleur rapport qualité-prix en entrée de gamme." },
    ],
  },
  "meilleur-smartphone": {
    title: "Meilleur smartphone 2026 : le guide complet pour choisir son téléphone",
    slug: "meilleur-smartphone",
    category: "smartphones",
    emoji: "📱",
    date: "2026-05-01",
    description: "Smartphone 2026 : iOS ou Android, photo, autonomie, budget. Le guide d'achat complet Troviio pour trouver le meilleur smartphone adapté à tes besoins.",
    canonical: "https://troviio.com/guide/meilleur-smartphone",
    ogImage: "https://troviio.com/og-guide-smartphone.jpg",
    faq: [
      { question: "iPhone ou Android : lequel choisir en 2026 ?", answer: "iPhone (iOS) : écosystème fermé mais fluide, mises à jour 6-7 ans, excellente photo, bonne revente. Android : plus de choix et de liberté, meilleur rapport qualité-prix, personnalisation poussée, et désormais 7 ans de mises à jour sur les derniers Pixel et Samsung. Le choix dépend de ton écosystème et de tes priorités." },
      { question: "Quel budget pour un bon smartphone en 2026 ?", answer: "Compte 200-400€ pour un bon entrée de gamme (Redmi, Galaxy A, Pixel 8a), 500-800€ pour un milieu de gamme performant (Pixel 9, Galaxy S24 FE, Nothing Phone 3a), et 1 000-1 600€ pour le haut de gamme (iPhone 18 Pro, Galaxy S26 Ultra, Pixel 11 Pro)." },
      { question: "Quelle est la meilleure marque de smartphone photo en 2026 ?", answer: "Google (Pixel) domine la photo computationnelle avec des clichés époustouflants en toutes conditions. Samsung (Galaxy S Ultra) excelle en zoom (x100), et Apple (iPhone Pro) offre la meilleure vidéo et une colorimétrie naturelle. Vivo et Xiaomi montent en puissance avec des capteurs 1 pouce." },
      { question: "6 Go de RAM en 2026, est-ce encore suffisant ?", answer: "6 Go est le strict minimum pour un usage basique (réseaux sociaux, messagerie, navigation). Pour un usage confortable et laisser le système respirer, vise 8 Go minimum. 12-16 Go sont recommandés pour le gaming, le multitâche intensif ou si tu comptes garder ton téléphone 4-5 ans." },
    ],
  },
  "meilleur-lave-vaisselle": {
    title: "Meilleur lave-vaisselle 2026 : le guide complet pour choisir sa machine",
    slug: "meilleur-lave-vaisselle",
    category: "lave-vaisselle",
    emoji: "🍽️",
    date: "2026-05-01",
    description: "Lave-vaisselle : capacité, bruit, consommation, séchage. Le guide d'achat complet Troviio pour trouver le meilleur lave-vaisselle en 2026.",
    canonical: "https://troviio.com/guide/meilleur-lave-vaisselle",
    ogImage: "https://troviio.com/og-guide-lave-vaisselle.jpg",
    faq: [
      { question: "Quelle capacité de lave-vaisselle pour une famille de 4 personnes ?", answer: "Pour une famille de 4 personnes, un lave-vaisselle de 12 à 14 couverts est recommandé. Cela permet de laver la vaisselle d'une journée complète en un seul cycle. Pour un couple, 9 à 10 couverts suffisent." },
      { question: "Lave-vaisselle encastrable ou pose libre : lequel choisir ?", answer: "L'encastrable s'intègre sous plan de travail avec façade personnalisable — idéal pour cuisine neuve. Le pose libre est plus simple à installer, moins cher (50 à 150€ de moins) et se déplace avec toi si tu changes de logement." },
      { question: "Quel niveau sonore pour un lave-vaisselle silencieux ?", answer: "Vise un modèle à 42 dB ou moins pour le lavage — aussi silencieux qu'une bibliothèque. En essorage, reste sous les 48 dB. Les modèles les plus silencieux descendent à 38 dB (Miele G 7000)." },
      { question: "Quelle est la meilleure marque de lave-vaisselle en 2026 ?", answer: "Bosch et Siemens dominent avec des machines fiables et silencieuses. Miele est la référence en durabilité (20+ ans) mais à un tarif premium. Electrolux offre un bon rapport qualité-prix." },
    ],
  },
  "meilleur-tv-oled": {
    title: "Meilleur téléviseur OLED 2026 : le guide complet pour choisir sa TV haut de gamme",
    slug: "meilleur-tv-oled",
    category: "tv-oled",
    emoji: "📺",
    date: "2026-05-01",
    description: "TV OLED : qualité d'image, HDR, taille, gaming. Le guide d'achat complet Troviio pour choisir le meilleur téléviseur OLED en 2026.",
    canonical: "https://troviio.com/guide/meilleur-tv-oled",
    ogImage: "https://troviio.com/og-guide-tv-oled.jpg",
    faq: [
      { question: "OLED, QLED ou Mini-LED : quelle différence en 2026 ?", answer: "OLED : noirs parfaits, contraste infini — le meilleur pour le cinéma. QLED : plus lumineux, meilleur en plein jour. Mini-LED : compromis lumineux, bon contraste. Pour le cinéma et le gaming, l'OLED reste roi." },
      { question: "Quelle taille de TV OLED pour mon salon ?", answer: "À 2 mètres : 55 pouces est idéal. À 2,5 mètres : 65 pouces. À 3 mètres : 75 pouces. Les OLED 55 et 65 pouces offrent le meilleur rapport qualité-prix." },
      { question: "L'OLED est-il fait pour le gaming ?", answer: "Oui : temps de réponse < 1 ms, 120-165 Hz, VRR, G-Sync/FreeSync, HDMI 2.1. Les LG C/G sont la référence pour les joueurs." },
      { question: "Quel budget pour une TV OLED en 2026 ?", answer: "900-1 300€ pour un 55 pouces, 1 300-2 000€ pour un 65 pouces, 2 000-3 500€ pour un 77 pouces. Les prix baissent régulièrement." },
    ],
  },
  "meilleur-machine-cafe": {
    title: "Meilleure machine à café 2026 : le guide complet pour devenir barista sans le bac",
    slug: "meilleur-machine-cafe",
    category: "machine-cafe",
    emoji: "☕",
    date: "2026-05-01",
    description: "Machine à café : grain, dosette, expresso, budget. Le guide d'achat Troviio pour choisir ta machine à café en 2026 sans te prendre la tête.",
    canonical: "https://troviio.com/guide/meilleur-machine-cafe",
    ogImage: "https://troviio.com/og-guide-machine-cafe.jpg",
    faq: [
      { question: "Machine grain ou dosette : laquelle choisir ?", answer: "La machine grain offre le meilleur café : grains fraîchement moulus à chaque tasse, coût à la tasse 15-25 cts. La dosette (Nespresso) est plus pratique mais coûte 35-50 cts/tasse. Si tu bois 2+ cafés par jour, la grain est rentable en 1 à 2 ans." },
      { question: "Quelle est la meilleure marque de machine expresso en 2026 ?", answer: "Jura est la référence haut de gamme suisse. De'Longhi et Philips dominent le milieu de gamme avec un excellent rapport qualité-prix. Siemens propose des machines compactes très bien notées." },
      { question: "Quel budget pour une bonne machine à café grain ?", answer: "300-500€ pour l'entrée de gamme (Philips EP), 500-900€ pour le milieu (De'Longhi Dinamica), 1 000-2 500€ pour le haut de gamme (Jura E8, Z10)." },
      { question: "Quel entretien pour une machine grain ?", answer: "Vide le bac à marc tous les 2-3 jours, nettoie la buse vapeur après chaque usage, change le filtre à eau tous les 2 mois, détartre tous les 3 mois." },
      { question: "Machine grain ou dosette : le duel final", answer: "La machine grain offre un café objectivement meilleur. La dosette offre la simplicité. Tout dépend de ton rapport au café : plaisir vs fonction." },
    ],
  },
  "meilleur-matelas": {
    title: "Meilleur matelas 2026 : le guide complet pour des nuits de rêve (sans se ruiner)",
    slug: "meilleur-matelas",
    category: "matelas",
    emoji: "🛏️",
    date: "2026-05-01",
    description: "Matelas : mousse, ressorts, latex, fermeté, budget. Le guide d'achat Troviio pour choisir le meilleur matelas en 2026 et enfin dormir sur ses deux oreilles.",
    canonical: "https://troviio.com/guide/meilleur-matelas",
    ogImage: "https://troviio.com/og-guide-matelas.jpg",
    faq: [
      { question: "Matelas mousse ou ressorts : lequel choisir ?", answer: "La mousse mémoire de forme épouse le corps et absorbe les mouvements — idéal pour les dormeurs sur le côté. Les ressorts ensachés offrent un meilleur soutien et une meilleure ventilation — parfaits pour ceux qui ont chaud." },
      { question: "Quelle fermeté choisir selon mon poids ?", answer: "Moins de 60 kg : souple à mi-ferme. 60-80 kg : mi-ferme (le standard). 80-100 kg : ferme. Plus de 100 kg : très ferme. Le bon matelas garde ta colonne parfaitement droite." },
      { question: "Quel budget pour un bon matelas en 2026 ?", answer: "200-400€ pour un bon matelas mousse (Tediber, Emma). 400-700€ pour milieu de gamme (Hypnia, Kipli). 700-1 200€ pour haut de gamme (Bultex). 1 200€+ pour le luxe (Tempur)." },
      { question: "Matelas en rouleau : bonne idée ?", answer: "Excellente idée. Les matelas en boîte (Emma, Tediber) offrent un rapport qualité-prix imbattable : vente directe, pas d'intermédiaire. Qualité équivalente aux marques traditionnelles pour 30-50% moins cher." },
      { question: "Quelle durée de vie pour un matelas ?", answer: "8 à 10 ans pour un matelas de qualité correcte, 10 à 15 ans pour un haut de gamme. Signes qu'il est temps de changer : réveils douloureux, creux permanents, ou plus de 10 ans." },
    ],
  },
  "meilleure-imprimante": {
    title: "Meilleure imprimante 2026 : jet d'encre, laser ou multifonction — le guide complet",
    slug: "meilleure-imprimante",
    category: "imprimante",
    emoji: "🖨️",
    date: "2026-05-01",
    description: "Imprimante jet d'encre, laser, multifonction : le guide complet 2026 pour choisir l'imprimante parfaite pour ton bureau ou ta maison.",
    canonical: "https://troviio.com/guide/meilleure-imprimante",
    ogImage: "https://troviio.com/og-guide-imprimante.jpg",
    faq: [
      { question: "Imprimante jet d'encre ou laser : laquelle choisir ?", answer: "Le jet d'encre est idéal pour les photos et les impressions couleur occasionnelles. Le laser est plus économique pour les impressions noir et blanc en grand volume. Pour un usage mixte, une imprimante multifonction jet d'encre est un bon compromis." },
      { question: "Quel budget pour une bonne imprimante en 2026 ?", answer: "Compte 50-100€ pour une jet d'encre d'entrée de gamme, 150-300€ pour une jet d'encre multifonction (avec réservoir, type EcoTank), 200-400€ pour une laser monochrome, et 300-600€ pour une laser couleur." },
      { question: "Imprimante avec réservoir ou cartouche : quelle différence ?", answer: "Les imprimantes à réservoir (Epson EcoTank, HP Smart Tank) sont plus chères à l'achat mais très économiques à l'usage : jusqu'à 6 000 pages avec un jeu d'encre. Les cartouches coûtent plus cher à long terme mais l'imprimante est moins chère au départ." },
      { question: "Quelle connectivité choisir ?", answer: "Le Wi-Fi est indispensable en 2026 pour imprimer depuis ton téléphone et ton PC. L'impression sans fil via AirPrint (Apple) et Mopria (Android) est standard. L'Ethernet est utile pour un usage en réseau d'entreprise." },
    ],
  },
  "meilleure-camera-securite": {
    title: "Meilleure caméra sécurité 2026 : intérieur, extérieur, sans fil — le guide complet",
    slug: "meilleure-camera-securite",
    category: "camera-securite",
    emoji: "📷",
    date: "2026-05-01",
    description: "Caméra sécurité intérieur et extérieur : vision nocturne, détection, cloud. Le guide complet 2026 pour protéger ton domicile avec la meilleure caméra.",
    canonical: "https://troviio.com/guide/meilleure-camera-securite",
    ogImage: "https://troviio.com/og-guide-camera-securite.jpg",
    faq: [
      { question: "Caméra intérieur ou extérieur : quelles différences ?", answer: "Les caméras extérieures sont conçues pour résister aux intempéries (IP65+) et ont une vision nocturne plus performante. Les caméras intérieures sont plus compactes et souvent moins chères, mais ne supportent pas l'humidité." },
      { question: "Stockage cloud ou local : lequel choisir ?", answer: "Le cloud est plus pratique (accessible partout, pas de risque de vol) mais nécessite un abonnement. Le stockage local (carte SD, NVR) est plus privé et sans frais récurrents, mais la caméra peut être volée avec sa carte." },
      { question: "Quelle résolution pour une caméra de sécurité ?", answer: "1080p est le minimum en 2026. 2K (2560x1440) offre un bon compromis qualité/prix. 4K est idéal pour identifier des visages ou des plaques d'immatriculation, mais nécessite un bon débit internet." },
      { question: "Caméra filaire ou batterie : laquelle privilégier ?", answer: "La caméra filaire offre un flux continu sans souci de batterie — idéale pour une surveillance 24/7. La caméra sur batterie est plus facile à installer (pose libre) mais nécessite une recharge toutes les 2 à 6 mois selon l'utilisation." },
    ],
  },
  "meilleur-thermostat-connecte": {
    title: "Meilleur thermostat connecté 2026 : économies d'énergie et confort — le guide complet",
    slug: "meilleur-thermostat-connecte",
    category: "thermostat-connecte",
    emoji: "🌡️",
    date: "2026-05-01",
    description: "Thermostat connecté : économies d'énergie, programmation, géolocalisation. Le guide complet 2026 pour choisir le meilleur thermostat intelligent pour ta maison.",
    canonical: "https://troviio.com/guide/meilleur-thermostat-connecte",
    ogImage: "https://troviio.com/og-guide-thermostat-connecte.jpg",
    faq: [
      { question: "Quelles économies d'énergie avec un thermostat connecté ?", answer: "Un thermostat connecté permet d'économiser 15 à 30% sur ta facture de chauffage, soit 200 à 400€ par an pour une maison moyenne. La géolocalisation et la programmation adaptative sont les principaux leviers d'économie." },
      { question: "Thermostat connecté : compatible avec toutes les chaudières ?", answer: "La plupart des thermostats connectés sont compatibles avec les chaudières gaz, fioul et électriques. Vérifie la compatibilité avec ta marque de chaudière (les modèles Tado° et Netatmo sont les plus universels). Les pompes à chaleur nécessitent des modèles spécifiques." },
      { question: "Quelle différence entre un thermostat simple et des têtes thermostatiques connectées ?", answer: "Un thermostat central contrôle la température globale. Des têtes thermostatiques connectées (Tado°, Netatmo) permettent de programmer pièce par pièce — jusqu'à 40% d'économies supplémentaires en chauffant uniquement les pièces utilisées." },
      { question: "L'installation est-elle complexe ?", answer: "L'installation est généralement simple pour un thermostat connecté : 30 minutes avec les outils de base. Les modèles les plus récents sont sans fil et se fixent au mur. Netatmo et Tado° proposent des applications qui guident pas à pas." },
    ],
  },
  "meilleur-four-micro-ondes": {
    title: "Meilleur four micro-ondes 2026 : combiné, vapeur, encastrable — le guide complet",
    slug: "meilleur-four-micro-ondes",
    category: "four-micro-ondes",
    emoji: "🔥",
    date: "2026-05-02",
    description: "Four micro-ondes combiné, vapeur ou solo : retrouve les 6 meilleurs modèles 2026 testés par Troviio. Guide d'achat complet, comparatif et conseils pour choisir ton micro-ondes idéal.",
    canonical: "https://troviio.com/guide/meilleur-four-micro-ondes",
    ogImage: "https://troviio.com/og-guide-four-micro-ondes.jpg",
    faq: [
      { question: "Quelle est la différence entre un micro-ondes solo, combiné et encastrable ?", answer: "Un micro-ondes solo fait uniquement réchauffer et décongeler. Un combiné intègre gril et/ou chaleur tournante pour cuire et dorer comme un four. L'encastrable s'intègre dans une niche de cuisine. Les combinés avec fonction vapeur sont les plus polyvalents." },
      { question: "Quelle puissance micro-ondes est suffisante ?", answer: "900 W est la puissance standard recommandée. Les modèles à technologie Inverter (Panasonic) ajustent la puissance en continu pour éviter les points chauds." },
      { question: "Quel budget pour un bon four micro-ondes en 2026 ?", answer: "80-150€ pour un solo, 150-300€ pour un combiné entrée de gamme, 300-600€ pour un combiné haut de gamme avec vapeur, et 1000-1100€ pour les modèles encastrables Miele." },
      { question: "Quelle capacité choisir pour une famille ?", answer: "Pour un couple, 20-25 L suffisent. Pour 3-4 personnes, vise 30-40 L avec plateau de 36 cm minimum. Les modèles 46 L (Miele) permettent les grands plats." },
    ],
  },
  "meilleure-enceinte-bluetooth": {
    title: "Meilleure enceinte Bluetooth 2026 : nomade, party, premium — le guide complet",
    slug: "meilleure-enceinte-bluetooth",
    category: "enceinte-bt",
    emoji: "🔈",
    date: "2026-05-02",
    description: "Enceinte Bluetooth nomade, party ou premium : les 6 meilleurs modèles 2026 testés par Troviio. Guide d'achat complet pour choisir ton enceinte selon ton usage et ton budget.",
    canonical: "https://troviio.com/guide/meilleure-enceinte-bluetooth",
    ogImage: "https://troviio.com/og-guide-enceinte-bluetooth.jpg",
    faq: [
      { question: "Quelle est la meilleure enceinte Bluetooth en 2026 ?", answer: "La Marshall Kilburn II (199€) pour le style vintage, la Ultimate Ears Boom 4 (149€) pour l'extérieur, la Bose SoundLink Max (349€) pour un son premium, la Sony SRS-XG300 (249€) pour les fêtes, la Sonos Move 2 (449€) pour le multiroom, ou la JBL PartyBox 110 (249€) pour les grosses soirées." },
      { question: "Quelle est la différence entre enceinte nomade et enceinte party ?", answer: "L'enceinte nomade est compacte, légère, étanche et a une bonne autonomie. L'enceinte party est plus grosse, plus puissante, avec des basses généreuses et souvent des effets lumineux." },
      { question: "Quel budget pour une bonne enceinte Bluetooth en 2026 ?", answer: "50-100€ pour l'entrée de gamme, 100-200€ pour le milieu de gamme, 200-350€ pour le haut de gamme, 350-500€ pour le premium multiroom." },
      { question: "L'étanchéité IPX est-elle importante ?", answer: "Oui pour l'extérieur : IPX7 (immersion) pour la plage/piscine, IP67 (poussière+eau) pour le tout-terrain, IPX4 (éclaboussures) pour usage intérieur principal." },
    ],
  },
  "meilleure-poussette": {
    title: "Meilleure poussette 2026 : compacte, tout-terrain, évolutive — le guide complet",
    slug: "meilleure-poussette",
    category: "poussette",
    emoji: "👶",
    date: "2026-05-02",
    description: "Poussette citadine, tout-terrain, évolutive ou jogging : les 6 meilleures poussettes 2026 testées par Troviio. Guide d'achat complet pour choisir la poussette parfaite pour ton bébé.",
    canonical: "https://troviio.com/guide/meilleure-poussette",
    ogImage: "https://troviio.com/og-guide-poussette.jpg",
    faq: [
      { question: "Quelle est la meilleure poussette en 2026 ?", answer: "La Thule Urban Glide 2 (750€) pour le jogging, l'UPPAbaby Vista V2 (1100€) pour l'évolutif, la Babyzen Yoyo2 (550€) pour le voyage, la Cybex Gazelle S (899€) pour la modularité, la Joie Versatrax (349€) pour le rapport qualité-prix, la Silver Cross Spirit (600€) pour la ville." },
      { question: "Poussette évolutive ou compacte : que choisir ?", answer: "L'évolutive dure de la naissance à 4 ans et peut accueillir un second enfant. La compacte est légère et se plie très petit pour les voyages. Prends une évolutive pour l'usage principal et une compacte en complément si tu voyages." },
      { question: "Quel budget pour une bonne poussette en 2026 ?", answer: "200-400€ pour l'entrée de gamme, 400-700€ pour le milieu de gamme, 700-1100€ pour le haut de gamme." },
      { question: "Quel poids maximum pour une poussette facile à manipuler ?", answer: "Vise 8-10 kg pour un usage quotidien. La Babyzen Yoyo2 (6,2 kg) est la plus légère. L'UPPAbaby Vista V2 (12,7 kg) est plus lourde mais avec un confort exceptionnel." },
    ],
  },
  "meilleure-cave-a-vin": {
    title: "Meilleure cave à vin 2026 : vieillissement, service, polyvalence — le guide complet",
    slug: "meilleure-cave-a-vin",
    category: "cave-a-vin",
    emoji: "🍷",
    date: "2026-05-02",
    description: "Cave à vin de vieillissement, de service ou polyvalente : les 6 meilleures caves à vin 2026 testées par Troviio. Guide d'achat complet pour choisir ta cave idéale.",
    canonical: "https://troviio.com/guide/meilleure-cave-a-vin",
    ogImage: "https://troviio.com/og-guide-cave-a-vin.jpg",
    faq: [
      { question: "Quelle est la différence entre une cave à vin de vieillissement et une cave de service ?", answer: "La cave de vieillissement conserve les bouteilles plusieurs années à 12-14°C avec hygrométrie contrôlée. La cave de service maintient une température plus fraîche pour servir les vins à la bonne température immédiatement." },
      { question: "Quelle capacité de cave à vin choisir ?", answer: "Pour un amateur : 30-50 bouteilles. Pour un passionné : 100-150. Pour un collectionneur : 150-300. Prends double de ce que tu possèdes." },
      { question: "Quel budget pour une cave à vin en 2026 ?", answer: "200-400€ pour l'entrée de gamme, 400-800€ pour milieu de gamme 2 zones, 800-1500€ pour haut de gamme, 2000-4000€ pour le prestige." },
      { question: "Quelle est la meilleure marque de cave à vin ?", answer: "Eurocave est la référence, La Sommelière le meilleur rapport qualité-prix, Caveco des modèles abordables et fiables, ArteVino le haut de gamme design." },
    ],
  },
  "meilleur-purificateur-air": {
    title: "Meilleur purificateur d'air 2026 : allergies, pollution, maison — le guide complet",
    slug: "meilleur-purificateur-air",
    category: "purificateur-air",
    emoji: "🌬️",
    date: "2026-05-02",
    description: "Purificateur d'air antiallergique, antipollution ou antibactérien : les 6 meilleurs purificateurs d'air 2026 testés par Troviio. Guide d'achat complet pour respirer un air plus sain.",
    canonical: "https://troviio.com/guide/meilleur-purificateur-air",
    ogImage: "https://troviio.com/og-guide-purificateur-air.jpg",
    faq: [
      { question: "Quel purificateur d'air choisir pour les allergies ?", answer: "Un modèle avec filtre HEPA H13 ou H14, capteur de particules PM2.5 et CADR d'au moins 200 m³/h pour une chambre de 25 m². Le Levoit Core 300 et le Philips Series 2000 sont parfaits." },
      { question: "Quelle surface peut couvrir un purificateur d'air ?", answer: "100-150 m³/h pour 20-30 m², 150-250 m³/h pour 30-50 m², 250-400 m³/h pour 50-80 m². Prends un modèle conçu pour une pièce deux fois plus grande." },
      { question: "Quel budget pour un bon purificateur d'air ?", answer: "100-200€ pour l'entrée de gamme, 200-350€ pour milieu de gamme connecté, 350-600€ pour haut de gamme grande surface." },
      { question: "HEPA, charbon actif, ioniseur : quelles différences ?", answer: "Le HEPA capture les particules fines, le charbon actif absorbe les gaz et odeurs, l'ioniseur charge les particules. Privilégie HEPA + charbon actif, évite les ioniseurs seuls." },
    ],
  },
  "meilleure-barre-de-son": {
    title: "Meilleure barre de son 2026 : Dolby Atmos, home cinéma, budget — le guide complet",
    slug: "meilleure-barre-de-son",
    category: "barre-de-son",
    emoji: "🔊",
    date: "2026-05-02",
    description: "Barre de son Dolby Atmos, home cinéma ou connectée : les 6 meilleures barres de son 2026 testées par Troviio. Guide d'achat complet pour transformer le son de ta TV.",
    canonical: "https://troviio.com/guide/meilleure-barre-de-son",
    ogImage: "https://troviio.com/og-guide-barre-de-son.jpg",
    faq: [
      { question: "Quelle est la meilleure barre de son en 2026 ?", answer: "La Samsung HW-Q990D (1499€) pour le home cinéma, la Sony HT-A7000 (700€) pour le Dolby Atmos, la Bose Smart Soundbar 900 (899€) pour le design, la LG S95QR (799€) pour le meilleur rapport qualité-prix." },
      { question: "Barre de son avec ou sans caisson de basses ?", answer: "Le caisson est essentiel pour l'immersion home cinéma. Les barres haut de gamme l'incluent. Pour un usage quotidien (JT, séries), une barre seule peut suffire." },
      { question: "Quel budget pour une bonne barre de son ?", answer: "150-300€ pour l'entrée de gamme, 300-500€ pour milieu de gamme avec caisson, 500-900€ pour haut de gamme Atmos, 1000-1500€ pour premium tout-inclus." },
      { question: "Dois-je prendre une barre de la même marque que ma TV ?", answer: "Pas obligatoire, mais Samsung (Q-Symphony), LG (WOW Orchestra) et Sony (360 Spatial Sound) offrent des fonctionnalités avancées avec leurs TV." },
    ],
  },
  "meilleure-friteuse-air": {
    title: "Meilleure friteuse à air 2026 : sans huile, croustillante, familiale — le guide complet",
    slug: "meilleure-friteuse-air",
    category: "friteuse-air",
    emoji: "🍟",
    date: "2026-05-02",
    description: "Friteuse à air, air fryer ou friteuse sans huile : les 6 meilleures friteuses à air 2026 testées par Troviio. Guide d'achat complet pour des frites croustillantes sans matière grasse.",
    canonical: "https://troviio.com/guide/meilleure-friteuse-air",
    ogImage: "https://troviio.com/og-guide-friteuse-air.jpg",
    faq: [
      { question: "Quelle est la meilleure friteuse à air en 2026 ?", answer: "La Ninja Foodi MAX AF400EU 9.5L (249€) pour les familles, la Ninja Foodi AF350EU (159€) pour le rapport qualité-prix, la Seb Actifry Genius (179€) pour les frites parfaites, la Ninja Airfryer AF100EU (89€) pour l'entrée de gamme." },
      { question: "Friteuse à air avec ou sans huile ?", answer: "Une air fryer utilise l'air chaud avec très peu d'huile (1 c. à soupe). Les aliments sont croustillants avec 70-80% de calories en moins qu'une friture classique." },
      { question: "Quelle capacité pour une famille ?", answer: "1-2 personnes : 3-4 L. 3-4 personnes : 5-7 L. 5+ personnes : 8-10 L. Les modèles double zone permettent de cuire deux plats différents simultanément." },
      { question: "Une friteuse à air peut-elle remplacer un four ?", answer: "Oui pour 80% des plats : frites, nuggets, légumes, poisson, petits gâteaux. Cuisson 20-30% plus rapide. Trop petite pour les grandes plaques ou grosses pièces de viande." },
    ],
  },
  "meilleur-refrigerateur": {
    title: "Meilleur réfrigérateur 2026 : combiné, américain, encastrable — le guide complet",
    slug: "meilleur-refrigerateur",
    category: "refrigerateur",
    emoji: "❄️",
    date: "2026-05-02",
    description: "Réfrigérateur combiné, américain ou encastrable : les 6 meilleurs réfrigérateurs 2026 testés par Troviio. Guide d'achat complet pour choisir le frigo idéal.",
    canonical: "https://troviio.com/guide/meilleur-refrigerateur",
    ogImage: "https://troviio.com/og-guide-refrigerateur.jpg",
    faq: [
      { question: "Quel est le meilleur réfrigérateur en 2026 ?", answer: "Le Liebherr CBNd 5223 (1199€) pour la conservation BioFresh, le LG GBB92MCB2P (949€) pour la connectivité, le Samsung RB38C7B5A12 (899€) pour le rapport qualité-prix, le Miele KFN 4795 CD (2499€) pour le luxe." },
      { question: "Quelle capacité pour une famille de 4 ?", answer: "350-450 L de volume total. Le LG GBB92MCB2P offre 635 L (très spacieux). Le Samsung RB38C7B5A12 propose 380 L (standard familial)." },
      { question: "No Frost ou froid statique ?", answer: "Le No Frost empêche le givre (fini le dégivrage). Le froid statique est plus économique et conserve mieux les légumes. Le froid brassé est un compromis." },
      { question: "Quelle est la meilleure marque de réfrigérateur ?", answer: "Liebherr pour la conservation des frais, Miele pour la durabilité, LG et Samsung pour la connectivité, Bosch/Siemens pour le milieu de gamme allemand." },
    ],
  },
  "meilleure-trottinette-electrique": {
    title: "Meilleure trottinette électrique 2026 : urbaine, autonomie, budget — le guide complet",
    slug: "meilleure-trottinette-electrique",
    category: "trottinette",
    emoji: "🛴",
    date: "2026-05-02",
    description: "Trottinette électrique urbaine, grande autonomie ou tout-terrain : les 6 meilleures trottinettes 2026 testées par Troviio. Guide d'achat complet pour choisir ta trottinette idéale.",
    canonical: "https://troviio.com/guide/meilleure-trottinette-electrique",
    ogImage: "https://troviio.com/og-guide-trottinette-electrique.jpg",
    faq: [
      { question: "Quelle est la meilleure trottinette électrique en 2026 ?", answer: "Le Segway Ninebot G2 Max (649€) pour l'autonomie/prix, le Segway Ninebot F2 Pro (579€) pour le rapport qualité-prix, la Xiaomi Electric Scooter 4 Pro (449€) pour le petit budget." },
      { question: "Quelle autonomie pour un usage quotidien ?", answer: "Pour 5-15 km/jour : 30-40 km suffisent. Pour 15-25 km/jour : vise 50-70 km. L'autonomie réelle est 30-40% inférieure à l'annoncée." },
      { question: "Trottinette avec ou sans suspension ?", answer: "La suspension est fortement recommandée sur routes abîmées ou pavés. Le Segway Ninebot G2 Max est le meilleur choix avec suspension avant et arrière." },
      { question: "Quelle vitesse maximale autorisée ?", answer: "25 km/h en France et en Europe. Le débridage est illégal (amende de 1500€) et fait perdre la garantie et l'assurance." },
    ],
  },
  "meilleur-clavier": {
    title: "Meilleur clavier 2026 : le guide complet pour choisir son clavier (gaming, mécanique, bureautique)",
    slug: "meilleur-clavier",
    category: "clavier",
    emoji: "⌨️",
    date: "2026-05-07",
    description: "Mécanique, Hall Effect, sans fil, low-profile : le guide d'achat complet Troviio pour trouver le meilleur clavier en 2026, du gaming à la bureautique.",
    canonical: "https://troviio.com/guide/meilleur-clavier",
    ogImage: "https://troviio.com/og-guide-clavier.jpg",
    faq: [
      { question: "Mécanique ou Hall Effect : quel switch est fait pour moi ?", answer: "Les switches mécaniques classiques (Cherry MX, Gateron) sont fiables, abordables et offrent le meilleur feeling tactile pour la bureautique. Le Hall Effect (HE) utilise des capteurs magnétiques : plus rapide, plus durable (100+ millions de frappes), et permet le Rapid Trigger — un must pour les joueurs. Si tu tapes 90% du temps, prends du mécanique. Si tu joues 90% du temps, prends du HE." },
      { question: "Quelle disposition de touches pour un Français ?", answer: "L'AZERTY reste le standard en France, mais de plus en plus de claviers proposent les deux (AZERTY/QWERTY via logiciel). Certains modèles haut de gamme permettent même de changer les switches sans dessouder — pratique si ta touche W lâche après 3 000 heures de course-poursuite." },
      { question: "Clavier sans fil : le lag est-il perceptible en gaming ?", answer: "Les claviers sans fil modernes (2,4 GHz, pas Bluetooth) ont une latence aussi faible qu'un filaire — on parle de 1 ms contre 0,5 ms. À moins d'être un pro du e-sport, tu ne sentiras aucune différence. Le vrai plus : plus de câble qui prend la poussière et que ton chat mordille." },
      { question: "Un clavier à 30€ fait-il le job ?", answer: "ça dépend de ton job. Pour taper un mail ou un Excel, oui, ça passe. Pour taper 8 heures par jour ou jouer en compétition, tes doigts te remercieront de mettre au moins 80-100€. C'est comme une chaise de bureau : tu passes 1/3 de ta vie dessus, autant que ce soit confortable." },
    ],
  },
  "meilleur-bureau-electrique": {
    title: "Meilleur bureau électrique 2026 : le guide complet assis-debout (télétravail, gaming)",
    slug: "meilleur-bureau-electrique",
    category: "bureau-electrique",
    emoji: "🪑",
    date: "2026-05-07",
    description: "Bureau assis-debout électrique : stabilité, moteurs, charge, budget. Le guide d'achat complet Troviio pour choisir le meilleur bureau électrique en 2026.",
    canonical: "https://troviio.com/guide/meilleur-bureau-electrique",
    ogImage: "https://troviio.com/og-guide-bureau-electrique.jpg",
    faq: [
      { question: "Double moteur ou simple moteur : quelle différence concrète ?", answer: "Le double moteur (un par pied) est plus rapide (35-40 mm/s contre 25 mm/s), plus silencieux, et soulève des charges plus lourdes (120-160 kg contre 60-80 kg). Le simple moteur est moins cher mais peut montrer des signes de fatigue sur les bureaux larges (>140 cm). En 2026, le double moteur est le standard pour un bureau qui tient la route — ou plutôt qui monte tout droit." },
      { question: "Quelle charge maximale pour un setup gaming ou télétravail ?", answer: "Un moniteur 27 pouces pèse ~5 kg, un PC fixe ~10-15 kg, ajoute clavier, lampe, et tasse de café : tu arrives à 25-35 kg facile. Prends un bureau supportant au moins 80 kg pour avoir de la marge. Pour un setup double écran + tour + bras articulés, vise 120 kg minimum." },
      { question: "Un bureau assis-debout, est-ce que ça vaut vraiment le coup ?", answer: "La science est formelle : rester assis 8 heures par jour augmente les risques cardiovasculaires et les douleurs lombaires. Alterner assis/debout toutes les 45 minutes réduit la fatigue et améliore la concentration. Si tu bosses de chez toi, le retour sur investissement (300-500€) se fait en 3 mois de mal de dos en moins. Et non, debout toute la journée n'est pas mieux — l'astuce c'est l'alternance." },
      { question: "Quelle hauteur minimale pour être à l'aise quand on est petit/grand ?", answer: "Un bon bureau doit descendre à 65-70 cm pour les gabarits petits (1m60) et monter à 125-130 cm pour les grands gabarits (1m90+). La plupart des bureaux standard montent de 72 à 120 cm — ce qui convient à 90% des utilisateurs. Si tu mesures moins d'1m60 ou plus d'1m90, vérifie les spécifications avant d'acheter." },
    ],
  },
  "meilleure-poele": {
    title: "Meilleure poêle 2026 : acier, fonte, inox, céramique — le guide complet",
    slug: "meilleure-poele",
    category: "poele",
    emoji: "🍳",
    date: "2026-05-14",
    description: "Poêle en acier carbone, fonte, inox ou céramique : les 10 meilleures poêles 2026 testées par Troviio. Guide d'achat complet pour cuisiner sain et durable.",
    canonical: "https://troviio.com/guide/meilleure-poele",
    ogImage: "https://troviio.com/og-guide-poele.jpg",
    faq: [
      { question: "Quelle est la meilleure poêle en 2026 ?", answer: "La De Buyer Mineral B Pro (60€) est la meilleure poêle pour les cuisiniers passionnés, avec un score de 94/100. La De Buyer Mineral B Element (50€) offre le meilleur rapport qualité-prix en acier carbone. La Lodge Fonte 26cm (46€) est imbattable pour la cuisson fonte à petit prix." },
      { question: "Poêle antiadhésive ou acier carbone : que choisir ?", answer: "L'acier carbone (De Buyer) est plus sain (zéro PFAS), dure toute une vie, mais demande un culottage initial. L'antiadhésif (Tefal, Scanpan) est plus pratique au quotidien mais dure 2-3 ans et contient du PTFE. Si la santé est ta priorité, prends l'acier carbone ou la fonte." },
      { question: "Les poêles sans PFAS sont-elles vraiment sans risque ?", answer: "Oui, les poêles en acier carbone, fonte brute, inox 18/10 et fonte émaillée sont totalement sans PFAS. Les poêles céramiques (GreenPan) sont certifiées sans PFAS mais durent 3-5 ans. évite les poêles PTFE rayées." },
      { question: "Quel budget pour une bonne poêle en 2026 ?", answer: "30-50€ pour l'entrée de gamme (Tefal Unlimited On 43€), 45-65€ pour le milieu (De Buyer Mineral B Element 50€, Lodge 46€), 60-150€ pour le haut de gamme (De Buyer Mineral B Pro 60€, Cristel 145€), 200-300€ pour le prestige (Le Creuset 230€)." },
    ],
  },
};
// ─── Slug → catégorie mapping pour les liens ────────────────

const SLUG_TO_CATEGORY: Record<string, string> = {
  "meilleur-lave-linge": "lave-linge",
  "meilleur-aspirateur-balai": "aspirateur-balai",
  "meilleur-robot-cuisine": "robot-cuisine",
  "meilleur-casque-audio": "casque-audio",
  "meilleur-ordinateur-portable": "ordinateur-portable",
  "meilleur-velo-electrique": "velo-electrique",
  "meilleur-aspirateur-robot": "aspirateur-robot",
  "meilleur-smartphone": "smartphone",
  "meilleur-lave-vaisselle": "lave-vaisselle",
  "meilleur-tv-oled": "tv",
  "meilleur-machine-cafe": "machine-a-cafe",
  "meilleur-matelas": "matelas",
  "meilleure-imprimante": "imprimante",
  "meilleure-camera-securite": "camera-securite",
  "meilleur-thermostat-connecte": "thermostat-connecte",
  "meilleur-four-micro-ondes": "four-micro-ondes",
  "meilleure-enceinte-bluetooth": "enceinte-bt",
  "meilleure-poussette": "poussette",
  "meilleure-cave-a-vin": "cave-a-vin",
  "meilleur-purificateur-air": "purificateur-air",
  "meilleure-barre-de-son": "barre-de-son",
  "meilleure-friteuse-air": "friteuse-air",
  "meilleur-refrigerateur": "refrigerateur",
  "meilleure-trottinette-electrique": "trottinette-electrique",
  "meilleur-clavier": "clavier",
  "meilleur-bureau-electrique": "bureau-electrique",
};

const CATEGORY_EMOJI: Record<string, string> = {
  "lave-linge": "🌀",
  "aspirateur-balai": "🧹",
  "robot-cuisine": "🍳",
  "casque-audio": "🎧",
  "ordinateur-portable": "💻",
  "velo-electrique": "🚲",
  "aspirateur-robot": "🤖",
  "smartphone": "📱",
  "lave-vaisselle": "🍽️",
  "tv": "📺",
  "machine-a-cafe": "☕",
  "matelas": "🛏️",
  "imprimante": "🖨️",
  "camera-securite": "📷",
  "thermostat-connecte": "🌡️",
  "four-micro-ondes": "🔥",
  "enceinte-bt": "🔈",
  "poussette": "👶",
  "cave-a-vin": "🍷",
  "purificateur-air": "🌬️",
  "barre-de-son": "🔊",
  "friteuse-air": "🍟",
  "refrigerateur": "❄️",
  "trottinette-electrique": "🛴",
  "clavier": "⌨️",
  "bureau-electrique": "🪑",
};

// ─── Load MD Content ───────────────────────────────────────

function loadGuideContent(slug: string): string | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "guides",
      `${slug}.md`
    );
    const raw = fs.readFileSync(filePath, "utf-8");

    // Extract content after the frontmatter (between --- markers)
    const parts = raw.split("---");
    if (parts.length >= 3) {
      // The content is between the second set of --- and the end
      // We need to remove the FAQ liquid tags which we'll render natively
      let content = parts.slice(2).join("---").trim();
      // Remove liquid-style FAQ tags since we handle FAQ natively
      content = content.replace(/<%\s*faq\.forEach.*?%>[\s\S]*?<%\s*\}\);\s*%>/g, "");
      return content;
    }
    return raw;
  } catch {
    return null;
  }
}

// ─── Generate static params ─────────────────────────────────

export async function generateStaticParams() {
  return Object.keys(GUIDES_META).map((slug) => ({ slug }));
}

// ─── Generate Metadata ─────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = GUIDES_META[slug];
  if (!meta) return {};

  return {
    title: `${meta.title}`,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    openGraph: {
      title: `${meta.title}`,
      description: meta.description,
      url: meta.canonical,
      type: "article",
      publishedTime: meta.date,
      images: [{ url: meta.ogImage, width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true },
    keywords: `${meta.title}, guide d'achat, comparatif, ${meta.category}, meilleur ${meta.category} 2026, Troviio`,
  };
}

// ─── Page Component ────────────────────────────────────────

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const meta = GUIDES_META[slug];
  if (!meta) notFound();

  const mdContent = loadGuideContent(slug);
  if (!mdContent) notFound();

  const catSlug = SLUG_TO_CATEGORY[slug];

  // ── Rich snippet schema ──
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    author: {
      "@type": "Person",
      name: "Sébastien Babcoq",
    },
    publisher: {
      "@type": "Organization",
      name: "Troviio",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": meta.canonical,
    },
    image: meta.ogImage,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://troviio.com" },
      { "@type": "ListItem", position: 2, name: "Guides d'achat", item: "https://troviio.com/guide" },
      { "@type": "ListItem", position: 3, name: meta.title, item: meta.canonical },
    ],
  };

  // Parse MD sections
  const sections = parseMDSections(mdContent);

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg)" }}>
      {/* Schema.org rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--text-muted)" }}>Accueil</Link>
          <span>›</span>
          <Link href="/guide" className="hover:underline" style={{ color: "var(--text-muted)" }}>Guides</Link>
          <span>›</span>
          <span style={{ color: "var(--text)" }} className="truncate max-w-[200px] sm:max-w-xs">
            {meta.emoji} {meta.title.replace(/ \d{4} :.*$/, "").replace(/^Meilleur /i, "")}
          </span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">{meta.emoji}</span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--coral)" }}>
                Guide d'achat {meta.date.split("-")[0]}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                {meta.title}
              </h1>
            </div>
          </div>

          <p className="text-base leading-relaxed max-w-3xl" style={{ color: "var(--text-muted)" }}>
            {meta.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-5">
            <span className="text-xs" style={{ color: "rgba(250,250,250,0.4)" }}>
              Mis à jour le {new Date(meta.date).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            {catSlug && (
              <Link
                href={`/c/${catSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition hover:bg-[rgba(255,107,95,0.2)]"
                style={{ backgroundColor: "rgba(255,107,95,0.12)", color: "var(--coral)" }}
              >
                {CATEGORY_EMOJI[catSlug] || "🏷️"} Voir les produits {meta.emoji}
              </Link>
            )}
            <Link
              href="/#chat-hero"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition hover:bg-[rgba(62,214,163,0.2)]"
              style={{ backgroundColor: "rgba(62,214,163,0.12)", color: "var(--mint)" }}
            >
              ✨ Demander à l'IA
            </Link>
          </div>
        </header>

        {/* ── Article Content ── */}
        <article className="prose-custom space-y-8">
          {sections.map((section, i) => (
            <SectionRenderer key={i} section={section} />
          ))}
        </article>

        {/* ── FAQ Section ── */}
        {meta.faq.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>
              ❓ Questions fréquentes
            </h2>
            <div className="space-y-4">
              {meta.faq.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>

            {/* FAQ Schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: meta.faq.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: item.answer,
                    },
                  })),
                }),
              }}
            />
          </section>
        )}

        {/* ── CTA ── */}
        <section className="mt-16 text-center rounded-3xl border p-8"
          style={{ borderColor: "rgba(255,107,43,0.2)", backgroundColor: "rgba(255,107,43,0.06)" }}
        >
          <p className="text-2xl mb-2">{meta.emoji}</p>
          <p className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>
            Tu ne sais toujours pas lequel choisir ?
          </p>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
            Dis à Troviio ton budget, ton usage et tes contraintes — il te recommande le modèle fait pour toi.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#chat-hero"
              className="inline-block px-6 py-3 rounded-full font-semibold text-white transition hover:bg-[var(--coral-dark)]"
              style={{ backgroundColor: "var(--coral)" }}
            >
              🎯 Demander à Troviio
            </Link>
            {catSlug && (
              <Link
                href={`/c/${catSlug}`}
                className="inline-block px-6 py-3 rounded-full font-semibold transition hover:border-[var(--coral)]"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}
              >
                Voir tous les produits →
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// ─── Section Rendering Helpers ─────────────────────────────

interface Section {
  type: "heading" | "paragraph" | "list" | "table" | "blockquote" | "separator" | "divider";
  content: string;
  level?: number;
  items?: string[];
  rows?: string[][];
  headers?: string[];
}

function parseMDSections(md: string): Section[] {
  const lines = md.split("\n");
  const sections: Section[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Horizontal separator
    if (line.trim() === "---") {
      sections.push({ type: "separator", content: "" });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      sections.push({
        type: "heading",
        content: headingMatch[2].trim(),
        level: headingMatch[1].length,
      });
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const content = line.replace(/^> /, "").trim();
      sections.push({ type: "blockquote", content });
      continue;
    }

    // Table detection
    if (line.trim().startsWith("|") && i + 2 < lines.length) {
      const headerMatch = line.match(/\|([^|]+)\|/);
      if (headerMatch && lines[i + 2]?.trim().startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i]?.trim().startsWith("|")) {
          // Skip separator row (|----|----|)
          if (!lines[i].includes("---")) {
            tableLines.push(lines[i]);
          }
          i++;
        }
        i--;

        if (tableLines.length >= 2) {
          const headers = tableLines[0]
            .split("|")
            .filter((c) => c.trim())
            .map((c) => c.trim());
          const rows = tableLines.slice(1).map((row) =>
            row
              .split("|")
              .filter((c) => c.trim())
              .map((c) => c.trim())
          );
          sections.push({ type: "table", content: "", headers, rows });
        }
        continue;
      }
    }

    // List item
    if (line.match(/^[-*\d+.]\s/)) {
      const items: string[] = [line.replace(/^[-*\d+.]\s+/, "").trim()];
      while (i + 1 < lines.length && lines[i + 1]?.match(/^[-*\d+.]\s/)) {
        i++;
        items.push(lines[i].replace(/^[-*\d+.]\s+/, "").trim());
      }
      sections.push({ type: "list", content: "", items });
      continue;
    }

    // Regular paragraph (skip empty lines)
    if (line.trim()) {
      sections.push({ type: "paragraph", content: line.trim() });
    }
  }

  return sections;
}

function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case "separator":
      return <hr style={{ borderColor: "var(--border)", margin: "2rem 0" }} />;

    case "heading":
      const level = Math.min(section.level || 2, 3);
      const headingStyles: Record<string, React.CSSProperties> = {
        h1: { color: "var(--text)", fontSize: "1.75rem", fontWeight: 700, marginTop: "2rem", marginBottom: "1rem" },
        h2: { color: "var(--text)", fontSize: "1.5rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" },
        h3: { color: "var(--text)", fontSize: "1.25rem", fontWeight: 600, marginTop: "1.5rem", marginBottom: "0.5rem" },
      };
      const hKey = `h${level}` as "h1" | "h2" | "h3";
      const HeadingComponent = hKey;
      return (
        <HeadingComponent style={headingStyles[hKey]}>
          {renderInlineContent(section.content)}
        </HeadingComponent>
      );

    case "paragraph":
      if (!section.content) return null;
      return <p className="text-base leading-7 mb-4" style={{ color: "var(--text-muted)" }}>{renderInlineContent(section.content)}</p>;

    case "blockquote":
      return (
        <blockquote
          className="rounded-xl border p-4 my-4 text-sm"
          style={{ borderColor: "rgba(62,214,163,0.2)", backgroundColor: "rgba(62,214,163,0.05)", color: "#A8E6CF" }}
        >
          {renderInlineContent(section.content)}
        </blockquote>
      );

    case "list":
      return (
        <ul className="space-y-2 my-4 ml-2">
          {section.items?.map((item, i) => (
            <li key={i} className="text-base leading-7" style={{ color: "var(--text-muted)" }}>
              <span className="inline-block w-2 h-2 rounded-full mr-3 shrink-0" style={{ backgroundColor: "var(--mint)" }} />
              {renderInlineContent(item)}
            </li>
          ))}
        </ul>
      );

    case "table":
      return (
        <div className="overflow-x-auto my-6 rounded-xl border" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--bg-surface)" }}>
                {section.headers?.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows?.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < (section.rows?.length || 0) - 1 ? "1px solid var(--border)" : "none" }}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {renderInlineContent(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details
      className="rounded-2xl border overflow-hidden transition"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <summary
        className="px-5 py-4 font-medium cursor-pointer flex items-center justify-between transition hover:bg-[rgba(255,107,95,0.06)]"
        style={{ color: "var(--text)" }}
      >
        <span>{question}</span>
        <span className="text-lg shrink-0 ml-2" style={{ color: "var(--coral)" }}>+</span>
      </summary>
      <div className="px-5 pb-4 pt-1 text-sm leading-7" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
        {answer}
      </div>
    </details>
  );
}

function renderInlineContent(text: string): React.ReactNode {
  // Handle bold
  let processed = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold" style="color:var(--text)">$1</strong>');
  // Handle inline code
  processed = processed.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded text-sm" style="background-color:var(--border);color:var(--mint)">$1</code>');
  // Handle links
  processed = processed.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="underline font-medium transition" style="color:var(--coral)" onmouseenter="this.style.color=\'var(--coral-dark)\'" onmouseleave="this.style.color=\'var(--coral)\'">$1</a>'
  );

  return <span dangerouslySetInnerHTML={{ __html: processed }} />;
}
