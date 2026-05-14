// FAQ data for category pages — with schema.org FAQPage
// Each entry: { question, answer }

export type FAQItem = { question: string; answer: string };

export const FAQ_BY_CATEGORY: Record<string, FAQItem[]> = {
  smartphone: [
    { question: "Quel smartphone choisir pour la photo en 2026 ?", answer: "Si la photo est votre priorité absolue, privilégiez un modèle avec un capteur principal de 50 Mpx minimum, un ultra grand-angle de qualité et un mode nuit performant. Les iPhone 17 Pro, Samsung Galaxy S26 Ultra et Google Pixel 11 dominent ce segment. Troviio vous recommande selon votre budget exact." },
    { question: "iPhone ou Android : comment choisir ?", answer: "Le choix dépend de votre écosystème : si vous avez déjà un Mac ou un iPad, l'iPhone est le choix naturel. L'Android offre plus de liberté (personnalisation, fichiers, émulateurs). En termes de durée de vie, les deux tiennent 4-5 ans en 2026." },
    { question: "Combien de RAM faut-il pour un smartphone en 2026 ?", answer: "8 Go de RAM est le minimum confortable pour un usage quotidien fluide. Pour le gaming lourd et le multitâche intensif, 12 Go ou 16 Go sont recommandés. Au-delà, le gain est marginal pour la plupart des utilisateurs." },
    { question: "Quelle autonomie viser pour un smartphone ?", answer: "Pour tenir une journée complète sans recharge, visez au moins 4500 mAh. Si vous êtes un gros utilisateur (vidéo, jeux, 5G toute la journée), 5000 mAh est plus prudent. La charge rapide 65W+ est un vrai plus." },
    { question: "Smartphone reconditionné : bonne idée ou pas ?", answer: "Oui, si le vendeur est certifié (Back Market, Apple Certified Refurbished, Samsung Renewed). Vous économisez 20-40% pour un appareil quasi-neuf avec garantie. Attention à l'état de la batterie : visez au moins 85% de capacité." },
  ],
  "aspirateur-robot": [
    { question: "Faut-il un robot aspirateur ou un aspirateur laveur en 2026 ?", answer: "Tout dépend de vos sols. Si vous avez majoritairement du carrelage ou du parquet flottant, un robot laveur (avec serpillière intégrée) est un vrai plus. Pour de la moquette ou tapis épais, un aspirateur seul reste plus efficace." },
    { question: "Quelle différence entre LiDAR et caméra pour la navigation ?", answer: "Le LiDAR (laser) est plus précis dans l'obscurité, cartographie plus rapidement et ne nécessite pas de lumière. La caméra est moins chère et peut reconnaître des obstacles (chaussures, câbles). Les meilleurs robots combinent les deux technologies." },
    { question: "Un robot aspirateur est-il assez puissant pour les poils d'animaux ?", answer: "Oui, à condition de choisir un modèle avec une brosse spéciale anti-emmêlement et une puissance d'aspiration d'au moins 5000 Pa. Les marques Dreame, Roborock et Ecovacs excellent sur ce critère." },
    { question: "Quelle autonomie pour un robot aspirateur ?", answer: "Comptez 120-180 minutes pour les modèles récents, ce qui couvre 100-150m² en une charge. La plupart retournent automatiquement à leur base pour se recharger et reprendre." },
  ],
  "machine-a-cafe": [
    { question: "Machine à café grain ou dosette : que choisir ?", answer: "Le grain offre un meilleur goût et un coût à la tasse 2-3x inférieur (15-25 cts vs 35-50 cts). La dosette est plus pratique, plus rapide et ne nécessite aucun réglage. Si vous buvez 2+ cafés par jour, le grain est plus rentable." },
    { question: "Quelle pression pour un bon expresso ?", answer: "15 bars est le standard pour un expresso correct. Les machines haut de gamme montent à 19-20 bars avec une pompe vibrante. Au-delà de 20 bars, le gain est marginal pour un usage domestique." },
    { question: "Machine à café silencieuse : ça existe vraiment ?", answer: "Oui, les modèles avec broyeur silencieux (Sage, Jura, Philips Series 5500) émettent environ 45-55 dB — comparable au bruit d'une conversation. Évitez les modèles d'entrée de gamme qui montent à 65 dB+." },
    { question: "Quel entretien pour une machine à café automatique ?", answer: "Un détartrage tous les 2-3 mois (selon la dureté de l'eau), un nettoyage du broyeur toutes les 2 semaines, et un changement du filtre à eau tous les 2 mois. Certains modèles ont des cycles auto-nettoyants." },
  ],
  tv: [
    { question: "OLED ou QLED pour une TV en 2026 ?", answer: "L'OLED offre des noirs parfaits et des angles de vision infinis — idéal pour le cinéma dans une pièce sombre. Le QLED (mini-LED) est plus lumineux et ne craint pas le burn-in — meilleur choix pour un salon lumineux ou du gaming avec HUD fixe." },
    { question: "Quel taux de rafraîchissement pour une TV gaming ?", answer: "120 Hz est le minimum pour une PS5 Pro ou Xbox Series X — ça offre une fluidité incomparable. Pour le gaming compétitif sur PC, certains moniteurs montent à 240 Hz. Au cinéma, 60 Hz suffit." },
    { question: "Quelle taille de TV pour mon salon ?", answer: "Règle simple : la distance en centimètres divisée par 2. Pour un canapé à 3 mètres de la TV, visez un 65 pouces (165 cm). À 2,5 mètres, un 55 pouces. Les grands formats (75-85 pouces) deviennent très abordables en 2026." },
    { question: "Qu'est-ce que le Dolby Atmos sur une TV ?", answer: "Le Dolby Atmos est un format audio 3D qui donne l'impression que le son vient de toutes les directions, y compris du dessus. La plupart des TV récentes le prennent en charge, mais pour une vraie expérience, une barre de son Atmos est fortement conseillée." },
  ],
  "casque-audio": [
    { question: "Casque à réduction de bruit active : est-ce vraiment utile ?", answer: "Oui, surtout pour le télétravail, les transports en commun et les open spaces. Les meilleurs modèles (Sony WH-1000XM6, Bose QC Ultra) réduisent 95% des bruits ambiants. Pour une utilisation domestique seule, un casque fermé classique suffit." },
    { question: "Casque sans-fil ou filaire : quel choix ?", answer: "Le sans-fil (Bluetooth 5.4+) est aujourd'hui aussi bon que le filaire pour 99% des utilisateurs. Le filaire reste meilleur pour l'audio studio ou le gaming compétitif (latence zéro). Si vous écoutez en FLAC ou Tidal Master, du filaire peut se justifier." },
    { question: "Quelle autonomie pour un casque Bluetooth ?", answer: "Visez au moins 30 heures pour un usage nomade tranquille (une semaine de trajets). Les meilleurs modèles (Sony, Bose, Sennheiser) offrent 40-60 heures. La charge rapide (5 min = 2h d'écoute) est un vrai plus." },
    { question: "Comment entretenir son casque audio ?", answer: "Nettoyez les coussinets toutes les 2-3 semaines avec un chiffon humide. Remplacez-les tous les 6-12 mois (surtout en cuir). Rangez toujours dans un étui. Évitez l'exposition prolongée au soleil et à l'humidité." },
  ],
  "lave-linge": [
    { question: "Lave-linge hublot ou top : lequel choisir ?", answer: "Le hublot est plus économe en eau et énergie, permet d'empiler un sèche-linge, et offre plus de programmes. Le top est plus pratique (pas besoin de se baisser) et cycle plus vite. En 2026, le hublot domine très largement le marché." },
    { question: "Quelle capacité pour un lave-linge selon la taille du foyer ?", answer: "1-2 personnes : 7-8 kg. 3-4 personnes : 8-9 kg. 5+ personnes : 10-11 kg. Pour les familles avec enfants, les grands formats (10-11 kg) sont très pratiques pour les couettes et les charges lourdes." },
    { question: "Lave-linge silencieux : quel niveau sonore viser ?", answer: "Visitez les modèles avec essorage à 71-74 dB (lavage à 44-48 dB). Les lave-linge les plus silencieux (Miele, Bosch série 8) descendent à 67 dB en essorage. Évitez les modèles au-dessus de 78 dB si la machine est près des chambres." },
  ],
  "aspirateur-balai": [
    { question: "Aspirateur balai ou traîneau : que choisir ?", answer: "Le balai est plus pratique au quotidien (rangement, prise en main rapide) mais moins puissant. Le traîneau offre une puissance d'aspiration supérieure et un plus grand réservoir. Pour un petit appartement : balai. Pour une grande maison : traîneau." },
    { question: "Quelle autonomie pour un aspirateur balai ?", answer: "40-60 minutes est le standard en 2026 pour les bons modèles (Dyson, Samsung, Bosch). Attention : l'autonomie annoncée est souvent en mode éco. En mode turbo, comptez 15-20 minutes. Vérifiez la batterie amovible pour pouvoir la remplacer." },
    { question: "Aspirateur balai pour poils d'animaux : que faut-il regarder ?", answer: "Priorisez une brosse anti-emmêlement (sans poils qui s'enroulent), une puissance d'aspiration d'au moins 150 AW, et un filtre HEPA lavable. Dyson Gen5 et Samsung Bespoke Jet sont les meilleurs sur ce critère." },
  ],
  "bureau-electrique": [
    { question: "Bureau électrique assis-debout : est-ce vraiment bon pour la santé ?", answer: "Oui, des études montrent qu'alterner position assise et debout réduit les douleurs lombaires de 40% et améliore la circulation. L'idéal est de changer de position toutes les 30-45 minutes. Un bureau électrique performant permet cette transition en 10 secondes." },
    { question: "Quelle hauteur pour un bureau électrique ?", answer: "La hauteur assise idéale : 68-76 cm (coudes à 90°). La hauteur debout : 95-115 cm (écran au niveau des yeux). Les meilleurs bureaux offrent une plage de 62-127 cm pour couvrir toutes les morphologies." },
    { question: "Stabilité d'un bureau électrique : sur quoi vérifier ?", answer: "Regardez le nombre de pieds moteurs : un double-moteur est indispensable pour une table de 140 cm+ et offre une meilleure stabilité à hauteur debout. Le poids max (120-160 kg) et l'épaisseur du plateau (18-25 mm) sont aussi des indicateurs de stabilité." },
  ],
  "robot-cuisine": [
    { question: "Robot cuiseur ou robot pâtissier : que choisir ?", answer: "Le robot cuiseur (Thermomix, Magimix Cook Expert) pèse, cuit, mijote et mixe — idéal pour les repas quotidiens. Le robot pâtissier (KitchenAid, Kenwood) est parfait pour les gâteaux, pains et pâtes. Si vous cuisinez varié : cuiseur. Si vous êtes passionné de pâtisserie : pâtissier." },
    { question: "Quelle puissance pour un robot cuisine ?", answer: "800-1000W pour un usage standard (soupes, smoothies, sauces). 1200-1500W pour pétrir du pain et mixer des ingrédients durs (noix, glace). Les modèles professionnels atteignent 1700W. Attention : plus de puissance = plus de bruit." },
    { question: "Robot cuisine connecté : est-ce vraiment utile ?", answer: "Oui, si vous suivez des recettes guidées. Les modèles connectés (Monsieur Cuisine Smart, Thermomix TM7) vous guident étape par étape avec les réglages automatiques. Sans ça, un robot non-connecté peut être plus simple à utiliser." },
  ],
  "velo-electrique": [
    { question: "Quelle autonomie pour un vélo électrique au quotidien ?", answer: "Pour des trajets domicile-travail de 10-20 km, une batterie 400-500 Wh suffit (60-80 km d'autonomie réelle). Pour des trajets de 30+ km ou des livraisons, visez 625-750 Wh (100-130 km). Avec les moteurs 2026, 0,5-1 kWh/100 km." },
    { question: "Moteur roue ou moteur pédalier (central) ?", answer: "Le moteur central (Bosch, Shimano, Bafang) offre un meilleur couple, une sensation plus naturelle et une meilleure répartition du poids. Le moteur roue est moins cher, plus simple, mais moins agréable en côte. Pour un usage quotidien, le central est recommandé." },
    { question: "Quel budget pour un bon vélo électrique en 2026 ?", answer: "Entrée de gamme correct : 1200-1800€ (Moustache, Decathlon). Milieu de gamme : 2000-3500€ (Cube, Giant, Specialized). Haut de gamme : 3500-6000€ (Riese & Müller, Stromer). Au-dessus, vous payez surtout le poids et le design." },
  ],
  "montre-connectee": [
    { question: "Apple Watch ou Samsung Galaxy Watch : laquelle choisir ?", answer: "L'Apple Watch Ultra 3 est la meilleure si vous avez un iPhone — intégration parfaite, suivi santé avancé (ECG, saturation, température). La Galaxy Watch Ultra est le meilleur choix Android avec Wear OS 5. Le choix est verrouillé par votre téléphone." },
    { question: "Montre connectée pour le sport : que faut-il regarder ?", answer: "Précision du GPS (double bande idéal), autonomie en mode sport (8-12h minimum), capteur cardio optique, résistance à l'eau (50m ATM), et poids. Les Garmin Forerunner restent la référence pour les coureurs." },
    { question: "Quelle autonomie pour une montre connectée ?", answer: "1-2 jours pour les montres connectées complètes (Apple Watch, Galaxy Watch) avec affichage permanent. 5-14 jours pour les hybrides (Garmin Venu, Withings) avec écran mémoire. 4-6 semaines pour les montres d'activité basiques." },
  ],
  "tablette": [
    { question: "iPad ou tablette Android : que choisir en 2026 ?", answer: "L'iPad reste la référence pour la créativité (dessin, montage vidéo) et les apps optimisées. Les tablettes Android (Samsung Galaxy Tab S11, Xiaomi Pad) offrent plus de liberté et un meilleur rapport qualité-prix. Pour la consommation de contenu : les deux excellent." },
    { question: "Tablette pour dessiner : quel modèle choisir ?", answer: "L'iPad Pro M5 avec Apple Pencil Pro est le standard de l'industrie pour les illustrateurs. En Android, la Samsung Galaxy Tab S11 Ultra avec S Pen offre une excellente alternative. Recherchez un taux de rafraîchissement de 120 Hz et une faible latence du stylet." },
    { question: "Quelle capacité de stockage pour une tablette ?", answer: "128 Go pour un usage basique (streaming, navigation, lecture). 256 Go pour les joueurs et utilisateurs intensifs. 512 Go+ pour les créateurs de contenu. Si vous téléchargez des séries Netflix hors-ligne, prenez au moins 256 Go." },
  ],
  "friteuse-air": [
    { question: "Friteuse à air : est-ce vraiment plus sain ?", answer: "Oui, les friteuses à air utilisent 80% moins d'huile qu'une friteuse traditionnelle pour un résultat croustillant. Les calories sont réduites de 50 à 80%. C'est aussi plus sain car moins de composés nocifs formés par la friture à haute température." },
    { question: "Quelle capacité pour une friteuse à air ?", answer: "3-4 litres pour 1-2 personnes. 5-6 litres pour 3-4 personnes. 7-9 litres pour une famille de 5+. Un grand format permet aussi de cuire un poulet entier ou un gâteau." },
    { question: "Friteuse à air avec ou sans tiroir (four) ?", answer: "Le tiroir (à tiroir) est plus compact, moins cher et plus facile à ranger. Le format four (porte frontale) offre plusieurs niveaux pour cuire simultanément — idéal pour une famille. Le four prend aussi plus de place. Les deux formats sont aussi efficaces." },
  ],
  "four-encastrable": [
    { question: "Four chaleur tournante ou traditionnel : quelle différence ?", answer: "La chaleur tournante (ventilateur) diffuse la chaleur uniformément dans tout le four — idéal pour les gâteaux et les cuissons multi-niveaux. Un four 3 fonctions minimum avec chaleur tournante est recommandé pour une cuisine polyvalente en 2026." },
    { question: "Pyrolyse ou catalyse : quel nettoyage choisir ?", answer: "La pyrolyse monte à 500°C pour brûler les résidus — très efficace mais consomme beaucoup d'énergie (1-2 kWh). La catalyse est plus économe mais moins efficace sur les grosses taches. Le mieux : pyrolyse pour les nettoyages profonds, catalyse pour l'entretien quotidien." },
    { question: "Quelle classe énergétique pour un four ?", answer: "En 2026, visez A+ ou A++ minimum. Un four A++ consomme environ 40% d'énergie en moins qu'un four A. Vérifiez aussi le volume utile (60-70 litres pour un standard, 40-50 litres pour un compact)." },
    { question: "Four connecté : est-ce utile au quotidien ?", answer: "Utile si vous cuisinez souvent des plats programmés ou surveillez la cuisson à distance. Les applications permettent de préchauffer en rentrant du travail et reçoivent des notifications. Les puristes préfèrent la simplicité d'un four classique." },
  ],
  poele: [
    { question: "Poêle en acier carbone ou fonte : que choisir ?", answer: "L'acier carbone chauffe rapidement et réagit vite aux variations de température — idéal pour les sautés et les cuissons rapides. La fonte retient mieux la chaleur et la distribue uniformément — parfaite pour les mijotés et les viandes épaisses. Les deux sont excellentes pour la cuisson à haute température." },
    { question: "Poêle antiadhésive avec ou sans PFAS ?", answer: "Depuis 2023-2025, la tendance est aux poêles sans PFAS (céramique, titane, thermo-resistant coating). Les marques comme GreenPan proposent des revêtements sans PFOA. Attention : même 'sans PFAS' ne garantit pas une durée de vie extrême. Les poêles sans revêtement (acier, fonte) durent des décennies." },
    { question: "Poêle en inox : est-ce vraiment sans entretien ?", answer: "Oui, l'inox est très résistant et passe au lave-vaisselle. Contrairement à la fonte ou l'acier carbone, il ne rouille pas. Attention : la cuisson sans matière grasse est difficile (les aliments accrochent). Pour des cuissons douces (poisson, oeufs), l'inox est un très bon choix en 2026." },
  ],
  "accessoire-velo": [
    { question: "Quels accessoires vélo sont obligatoires en France ?", answer: "Le casque n'est pas obligatoire pour les adultes mais recommandé. L'éclairage avant/arrière, un avertisseur sonore et des freins sont obligatoires. Depuis 2025, les gilets réfléchissants sont obligatoires hors agglomération la nuit." },
    { question: "Quel antivol vélo choisir pour le city ?", answer: "Un antivol en U (Kryptonite, Abus) offre la meilleure sécurité. Combinez un U à l'avant et un câble à l'arrière pour les roues. Évitez les antivols à câble seul." },
    { question: "Casque vélo : comment choisir la bonne taille ?", answer: "Mesurez votre tour de tête au-dessus des sourcils. S (52-56 cm), M (56-58 cm), L (58-61 cm). Le casque ne doit pas bouger quand vous secouez la tête. Norme EN 1078 obligatoire en Europe." },
  ],
  "aspirateur-laveur": [
    { question: "Aspirateur laveur ou aspirateur + serpillière ?", answer: "L'aspirateur laveur lave et aspire en un passage, divisant le temps par deux. Les meilleurs (Dreame H14 Pro, Tineco Floor One) nettoient sans traces. Le combo est moins cher mais prend plus de temps." },
    { question: "Quelle autonomie pour un aspirateur laveur ?", answer: "25-40 minutes selon les modèles. Vérifiez les réservoirs : 700-900 ml pour l'eau propre. La plupart ont des capteurs de saleté qui ajustent la puissance." },
    { question: "Aspirateur laveur pour parquet : sans risque ?", answer: "Oui si le modèle a un mode parquet réduisant le débit d'eau. Vérifiez que la brosse est adaptée aux sols fragiles pour ne pas rayer." },
  ],
  "barre-de-son": [
    { question: "Barre de son ou home cinéma : que choisir ?", answer: "La barre de son est plus compacte et simple à installer. Le home cinéma 5.1 offre un son plus immersif mais nécessite des enceintes supplémentaires. Pour une TV quotidienne, une barre avec caisson est le meilleur compromis." },
    { question: "Faut-il un caisson de basses avec une barre de son ?", answer: "Oui, le caisson apporte les graves que les petites enceintes ne peuvent pas produire. Certaines barres haut de gamme (Sonos Arc, Sennheiser Ambeo) ont des graves suffisants sans caisson." },
    { question: "Quelle puissance pour une barre de son ?", answer: "200-300W suffisent pour 20-30m². Le nombre de canaux compte : 2.1 basique, 3.1.2 pour Dolby Atmos, 5.1.2 pour une expérience immersive." },
  ],
  "camera-securite": [
    { question: "Caméra intérieure ou extérieure : quelle différence ?", answer: "Les caméras extérieures doivent être étanches (IP65+), résistantes aux intempéries avec vision nocturne puissante. Les caméras intérieures sont plus petites, moins chères." },
    { question: "Quelle résolution pour une caméra de sécurité ?", answer: "1080p minimum, 2K (QHD) bon rapport qualité-prix, 4K idéal pour identifier visages ou plaques. Vérifiez le champ de vision : 130° minimum." },
    { question: "Caméra filaire ou sans-fil : que choisir ?", answer: "Le sans-fil est plus simple à installer mais nécessite des batteries. Le filaire (PoE) est plus fiable : pas de batterie, pas de Wi-Fi instable. Pour une installation fixe, préférez PoE." },
  ],
  "cave-a-vin": [
    { question: "Cave à vin mono ou multi-température ?", answer: "Mono si vous ne buvez qu'un type de vin. Multi (2 zones) pour tout : 10-12°C blancs, 14-16°C rouges." },
    { question: "Quelle capacité pour une cave à vin ?", answer: "12-24 bouteilles pour un usage occasionnel. 30-60 pour un amateur régulier. 100+ pour un collectionneur. Prévoyez 20% de marge pour la circulation." },
    { question: "Cave à vin encastrable ou libre ?", answer: "L'encastrable s'intègre mais ventile moins bien. La cave libre offre meilleure ventilation et est plus silencieuse. Pour grand format, préférez libre." },
  ],
  clavier: [
    { question: "Clavier mécanique ou membrane : que choisir ?", answer: "Le mécanique offre 50-100M frappes vs 5-10M, meilleur retour tactile. La membrane est plus silencieuse et moins chère. Pour taper ou jouer : mécanique. Pour le bureau : membrane." },
    { question: "Quels switches pour quel usage ?", answer: "Linéaires (Rouge) : gaming rapide. Tactiles (Marron) : bureautique. Clicky (Bleu) : très sonore. Pour l'open space, évitez les clicky." },
    { question: "Clavier filaire ou sans-fil ?", answer: "Le filaire a zéro latence. Le sans-fil (Bluetooth/2.4 GHz) est plus pratique. Les technologies récentes (Logitech Lightspeed) ont une latence imperceptible." },
  ],
  "enceinte-bt": [
    { question: "Enceinte Bluetooth : qualité sonore ?", answer: "La taille des haut-parleurs compte plus que les watts. Un woofer 50mm+ donne des basses correctes. Les codecs aptX HD ou LDAC offrent une meilleure qualité que le SBC standard." },
    { question: "Quelle autonomie pour une enceinte Bluetooth ?", answer: "8-12h pour les modèles compacts (JBL Flip, UE Boom). 16-24h pour les grands formats (JBL Xtreme). La charge rapide USB-C est un critère important." },
    { question: "Enceinte Bluetooth étanche : mythe ou réalité ?", answer: "Réelle avec IP67. IPX7 minimum pour la plage/piscine. L'eau salée est corrosive : rincez après usage." },
  ],
  "four-micro-ondes": [
    { question: "Micro-ondes solo, grill ou combiné ?", answer: "Solo : réchauffer/décongeler. Grill : gratiner/dorer. Combiné (chaleur tournante + micro-ondes) : cuisiner comme un four. Le combiné est 2-3x plus cher mais polyvalent." },
    { question: "Quelle puissance pour un micro-ondes ?", answer: "700-800W basique, 900-1000W cuisson rapide et homogène. Plus la puissance est élevée, plus la cuisson est rapide." },
    { question: "Micro-ondes encastrable ou posable ?", answer: "L'encastrable coûte 2x plus cher. Le posable est plus simple à installer et remplacer. Si vous ne refaites pas la cuisine, prenez un posable haut de gamme." },
  ],
  imprimante: [
    { question: "Laser ou jet d'encre : que choisir ?", answer: "Le laser est moins cher à l'usage (1-3 cts/page), le toner ne sèche pas. Le jet d'encre est meilleur pour les photos et souvent couleur. Pour le bureau : laser. Pour la maison/photo : jet d'encre." },
    { question: "Imprimante multifonction : utile ?", answer: "Oui : scanner, copier en un seul appareil. Les multifonctions scannent vers email ou cloud. Le gain de place est significatif." },
    { question: "Quel coût à la page pour une imprimante ?", answer: "Laser : 2-4 cts/page N&B. Jet d'encre : 8-15 cts/page couleur. Les abonnements (HP Instant Ink) descendent à 2-5 cts/page." },
  ],
  "jeu-coop-local": [
    { question: "Quels jeux coop pour débutants ?", answer: "It Takes Two, Overcooked 2 et Mario Kart 8 Deluxe. Simples, fun dès la première partie. It Takes Two a même gagné le GOTY 2021." },
    { question: "Split-screen : ça existe encore ?", answer: "Oui et ça revient. Borderlands, Halo, Call of Duty, FIFA proposent du split-screen. Les indés comme Cuphead et Stardew Valley aussi." },
    { question: "Jeux coop pour enfants ?", answer: "Mario Party, Kirby, Sackboy, Minecraft en écran partagé. Pour les 6-10 ans, privilégiez les jeux Nintendo conçus pour le jeu en famille." },
  ],
  "laptop-etudiant": [
    { question: "Quel budget pour un PC portable étudiant ?", answer: "400-600€ basique, 600-900€ bon polyvalent, 900-1400€ pour filières techniques (design, vidéo, code). Au-delà, vous payez le poids et le design." },
    { question: "PC portable ou tablette pour les études ?", answer: "Le PC est indispensable pour la bureautique et les logiciels spécialisés. La tablette est meilleure pour la prise de notes manuscrites. La solution idéale : les deux." },
    { question: "Quelle autonomie pour un laptop étudiant ?", answer: "8-12h minimum pour une journée sans prise. Les MacBook Air M4 et Dell XPS 13 atteignent 15-18h. La charge USB-C est un plus." },
  ],
  "laptop-gamer": [
    { question: "Quelle carte graphique pour un laptop gamer ?", answer: "RTX 4060 : 1080p ultra. RTX 4070 : 1440p haute qualité. RTX 4080/4090 : 4K Ray Tracing. En 2026, une RTX 5070 est le minimum confortable." },
    { question: "Laptop gamer ou PC fixe ?", answer: "Le laptop est transportable mais moins puissant, plus bruyant et plus cher. Le PC fixe offre plus de puissance pour le même budget et la possibilité d'upgrade." },
    { question: "Quel taux de rafraîchissement pour un écran gaming portable ?", answer: "144 Hz standard, 240 Hz pour le compétitif (FPS, esport). 165 Hz meilleur rapport qualité-prix en 2026. Temps de réponse : 3 ms max." },
  ],
  "lave-vaisselle": [
    { question: "Lave-vaisselle 45 cm ou 60 cm ?", answer: "45 cm (9 couverts) pour 1-2 personnes. 60 cm (12-14 couverts) pour 3+. Le 45 cm consomme presque autant. Pour une famille : 60 cm." },
    { question: "Quelle classe énergétique ?", answer: "Visez A ou B (nouvelle étiquette 2024). Les modèles avec pompe à chaleur sont plus chers mais plus économes." },
    { question: "Lave-vaisselle silencieux : quel niveau ?", answer: "44 dB est très silencieux. 40-42 dB excellent (Miele, Bosch). Évitez au-dessus de 48 dB si cuisine ouverte sur le salon." },
  ],
  "manette-switch": [
    { question: "Manette Switch Pro : ça vaut le coup ?", answer: "Oui, bien plus confortable que les Joy-Cons en mode docké, 40h d'autonomie, sticks précis. Les Joy-Cons restent utiles pour les jeux à mouvements." },
    { question: "Manette Hall Effect : c'est quoi ?", answer: "Sticks à champ magnétique sans contact physique. Avantage : pas de drift (usure). 8BitDo Pro 2 et GuliKit KingKong 2 Pro intègrent cette technologie." },
    { question: "Manette sans-fil ou filaire ?", answer: "Le Bluetooth est assez rapide pour 99% des joueurs en 2026. Le filaire a une latence légèrement inférieure mais nécessite d'être branché." },
  ],
  matelas: [
    { question: "Matelas ferme ou moelleux : comment choisir ?", answer: "Votre poids détermine le choix. Moins de 60 kg : moelleux. Plus de 80 kg : ferme. Position sur le dos = ferme, sur le côté = moelleux." },
    { question: "Mousse ou ressorts : que choisir ?", answer: "La mousse mémoire de forme épouse les courbes et isole des mouvements mais retient la chaleur. Les ressorts ensachés offrent meilleur soutien et fraîcheur. Les hybrides sont le meilleur compromis." },
    { question: "Quelle durée de vie pour un matelas ?", answer: "8-10 ans pour un matelas qualité. Signes de fatigue : affaissement de 2 cm+, réveils douloureux, allergies. Changez dès ces signes." },
  ],
  "onduleur-ups": [
    { question: "UPS ou multiprise parafoudre ?", answer: "Le parafoudre protège des surtensions. L'UPS protège aussi des coupures. Pour un PC fixe, NAS ou serveur, l'UPS est indispensable." },
    { question: "Quelle puissance d'onduleur pour un PC ?", answer: "800-1000 VA pour un PC gaming standard. 1200-1500 VA pour un PC haut de gamme + écrans. Les watts comptent plus que les VA." },
    { question: "UPS sinus pur ou modifié ?", answer: "Le sinus pur est indispensable pour les alimentations modernes (PC, NAS, serveurs). Le sinus modifié peut causer des dysfonctionnements." },
  ],
  "ordinateur-portable": [
    { question: "14 ou 15 pouces : que choisir ?", answer: "14 pouces : plus léger (1.2-1.5 kg), meilleure autonomie. 15 pouces : plus d'écran, plus performant. Pour le nomade : 14. Pour le fixe : 15." },
    { question: "Quelle config pour un PC polyvalent en 2026 ?", answer: "Intel Core Ultra 7 ou Ryzen 7, 16 Go RAM (32 Go recommandé), SSD 512 Go, écran 14-15 IPS/OLED. Budget : 800-1200€." },
    { question: "MacBook ou PC Windows ?", answer: "MacBook Air M4 : 18h d'autonomie, meilleur écran, écosystème Apple. PC Windows : plus de choix, meilleure compatibilité, moins cher à config égale." },
  ],
  poussette: [
    { question: "Poussette légère ou tout-terrain ?", answer: "Légère (6-8 kg) pour la ville et les voyages. Tout-terrain (10-15 kg) pour les chemins et parcs. La légère se plie plus facilement." },
    { question: "Poussette 3-en-1 ou simple ?", answer: "La 3-en-1 (coque, nacelle, siège) couvre 0-3 ans dans un châssis, idéale pour les nouveaux parents. La simple est plus légère et moins chère." },
    { question: "Poussette pliable : quel mécanisme ?", answer: "Le pliage une-main est indispensable quand vous portez bébé. Le pliage compact permet de ranger dans un petit coffre. Vérifiez qu'elle tient debout pliée." },
  ],
  "purificateur-air": [
    { question: "HEPA H13 ou H14 ?", answer: "H13 filtre 99.95% des particules de 0.3 microns — suffisant. H14 filtre 99.995% — utile pour les allergiques sévères. La différence de prix est de 20-30%." },
    { question: "Quelle surface pour un purificateur d'air ?", answer: "CADR = surface x 4. 20m² = CADR 80 m³/h. 40m² = CADR 160+. Dyson et Levoit sont les plus fiables." },
    { question: "Entretien et coût d'un purificateur ?", answer: "Filtre HEPA à remplacer tous les 6-12 mois (30-80€). Un pré-filtre lavable prolonge sa durée. Comptez 50-150€/an." },
  ],
  refrigerateur: [
    { question: "Américain ou combiné ?", answer: "L'américain offre 500-700 L avec distributeur d'eau mais prend plus de place. Le combiné est plus compact, moins cher, mieux adapté aux cuisines standards." },
    { question: "No Frost ou froid ventilé ?", answer: "No Frost = pas de givre mais aliments plus secs. Froid ventilé = meilleure conservation des légumes. Les meilleurs combinent les deux." },
    { question: "Quelle classe énergétique ?", answer: "C minimum sur la nouvelle étiquette (ex A+++). D+ à éviter. Un frigo C consomme 150-200 kWh/an contre 300+ pour un F." },
  ],
  "station-daccueil-usbc": [
    { question: "USB-C ou Thunderbolt : différence ?", answer: "Thunderbolt 4/5 : 40-80 Gbps, 100W+ PD, multi-écrans 4K/8K. USB-C classique (10-20 Gbps) suffit pour 1 écran 4K. Thunderbolt est 2-3x plus cher." },
    { question: "Combien de ports pour une station ?", answer: "Minimum : 1 HDMI 4K, 1 DP, 2-3 USB-A, 1 USB-C data, 1 USB-C PD, 1 Ethernet. Pour dual écran : vérifiez le support 2x 4K 60Hz." },
    { question: "Station avec charge : combien de watts ?", answer: "85-100W pour un laptop pro (MacBook Pro, Dell XPS). 65W suffisent pour un ultraportable. Vérifiez la puissance spécifique à votre modèle." },
  ],
  "station-charge-usb-c": [
    { question: "Station de charge USB-C : à quoi ça sert ?", answer: "Recharger tous vos appareils depuis un seul bloc. Les stations modernes gèrent la répartition intelligente de la puissance pour optimiser la charge." },
    { question: "Chargeur GaN : c'est quoi ?", answer: "Le nitrure de gallium (GaN) permet des chargeurs plus compacts, plus légers et moins chauds. C'est la technologie standard en 2026." },
    { question: "Quelle puissance par port ?", answer: "20W min par port USB-C pour charge rapide smartphone. 65W+ sur au moins un port pour laptop. Puissance totale partagée entre les ports." },
  ],
  "thermostat-connecte": [
    { question: "Thermostat connecté : combien d'économies ?", answer: "20-30% sur la facture de chauffage selon l'ADEME, soit 200-400€/an pour 100m². Amortissement en 6-12 mois." },
    { question: "Compatible avec ma chaudière ?", answer: "Oui pour la plupart (gaz, fioul, PAC, plancher chauffant). Vérifiez la compatibilité fil pilote pour radiateurs électriques. Depuis 2025, compatibilité Matter obligatoire." },
    { question: "Fils pilotes ou radio ?", answer: "Le fil pilote est le standard pour les radiateurs électriques en France. La radio (Zigbee, Thread) est plus flexible mais nécessite un hub." },
  ],
  trottinette: [
    { question: "Trottinette électrique : légale sans permis ?", answer: "Oui, classe EDPM. Obligations : assurance, limite 25 km/h, pas de passager, pas sur trottoir, casque recommandé. Amendes jusqu'à 1500€." },
    { question: "Quelle autonomie pour une trottinette ?", answer: "15-25 km entrée de gamme, 30-50 km milieu, 60-80 km premium. L'autonomie réelle est 20-30% inférieure à l'annoncée." },
    { question: "Pneus pleins ou pneumatiques ?", answer: "Les pleins sont increvables mais moins confortables. Les pneumatiques offrent meilleure absorption mais peuvent crever. Les modèles 2026 intègrent du gel anti-crevaison." },
  ],
  "tv-oled": [
    { question: "OLED LG ou OLED Samsung ?", answer: "LG domine avec ses WOLED (G6, C5). Samsung rattrape avec QD-OLED (S95H) aux couleurs plus vives. LG meilleur pour le gaming, Samsung pour les couleurs." },
    { question: "Burn-in : encore un risque en 2026 ?", answer: "Beaucoup moins. Les dalles 2025-2026 ont des protections (décalage pixels, logo dimming). LG G6 couvre 5 ans contre le burn-in." },
    { question: "OLED ou QD-OLED : différence ?", answer: "WOLED utilise un filtre de couleur sur source blanche. QD-OLED utilise des points quantiques pour des couleurs plus pures (80%+ de volume colorimétrique)." },
  ],
  "ventilateur-classique": [
    { question: "Sur pied ou sur table : que choisir ?", answer: "Sur pied : plus puissant, brasse toute la pièce, idéal 20-40m². Sur table : compact, directionnel, parfait pour un bureau ou une chambre." },
    { question: "Ventilateur silencieux : quel niveau ?", answer: "25-30 dB en lente, 35-40 dB en moyenne, 45-50 dB en max. Les modèles design (Dyson, Duux) sont les plus silencieux." },
    { question: "Ventilateur avec télécommande : important ?", answer: "Oui, surtout la nuit. Fonctions utiles : minuterie, oscillation, mode nuit. Standard sur les modèles 100€+." },
  ],
  "ventilateur-colonne": [
    { question: "Colonne ou sur pied : que choisir ?", answer: "Le colonne est plus design, prend moins de place au sol (30 cm), flux d'air mieux réparti. Le sur pied est plus puissant et moins cher." },
    { question: "Ventilateur colonne silencieux : lequel ?", answer: "Duux Whisper Flex 2 et Rowenta VU5890F0 : 35 dB en mode normal. Les modèles à oscillation sans palpeur sont plus silencieux." },
    { question: "Consommation électrique ?", answer: "30-60W soit 3-6 cts/h. Très économique vs clim (1000-2000W). 8h/jour été = 20-30€. Une clim coûterait 200-400€." },
  ],
  "voiture-electrique": [
    { question: "Quelle autonomie réelle en 2026 ?", answer: "400-500 km WLTP standards (Tesla Model 3, Ioniq 6). 600-700 km grande autonomie (Model S, EQS). En conditions réelles : 70-80% du WLTP." },
    { question: "Wallbox ou prise domestique ?", answer: "Wallbox 7.4 kW : 40-50 km/h. Prise domestique 2.3 kW : 10-15 km/h. La Wallbox coûte 800-1500€ à installer." },
    { question: "Électrique ou hybride : que choisir ?", answer: "Électrique : 2-3€/100 km, moins d'entretien. Hybride rechargeable : flexibilité des longs trajets. Garage avec prise = électrique. Sinon = hybride." },
  ],
};
