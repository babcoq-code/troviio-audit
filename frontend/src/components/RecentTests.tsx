"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ScoreRing } from "@/components/ScoreRing";

interface TestProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image_url: string;
  estimated_score: number;
  category_id?: string;
  category_slug?: string;
  category_name?: string;
  test_summary?: string;
}

// Fun one-liners for each product (non-top-5 picks)
const TAGLINES: Record<string, string> = {
  "asus-rog-zephyrus-g14-2025": "Fait tourner Cryos en silence. Et ton portefeuille aussi.",
  "razer-blade-16-2025": "Le MacBook du gaming. Cher, mais ta mère sera fière.",
  "asus-rog-zephyrus-g16-2025": "Gaming, montage, crypto — et accessoirement, il fait les cafés.",
  "hp-omen-max-16-2025": "Les jeux tournent si bien que tu oublies de manger.",
  "lenovo-legion-pro-7i-gen-10": "Le PC qui fait tourner Crysis. Oui, encore celui-là.",
  "thermomix-tm7": "Le chef, le psy, le comptable — tout en un.",
  "ninja-foodi-flexdrawer-af500eu": "Friteuse, four, gril — le couteau suisse du chip.",
  "dyson-gen5-detect-absolute": "Aspire tellement fort que ta moquette flippe.",
  "apple-macbook-air-13-m4": "Tellement rapide qu'il arrive au café avant toi.",
  "lg-g6-oled-65-oled65g6-2026": "Les noirs si profonds que tu ranges l'ampli.",
  "sonos-arc-ultra": "Le son qui te fait regretter tous tes ex-haut-parleurs.",
  "samsung-s95h-65-qd-oled-tq65s95hf-2026": "Plus vif que tes souvenirs de vacances. Promis.",
  "dreame-x50-ultra-complete": "Nettoie mieux que ta mère. Chut, on dit rien.",
  "bugaboo-fox-5-renew": "La Rolls des poussettes. Le bébé est au chaud.",
  "sony-wh-1000xm6": "Tellement silencieux que tu vas rater le métro.",
  "artevino-oxygen-oxg1t230npd": "Meilleur café que ta machine au bureau. Et en souriant.",
  "manette-nintendo-switch2-procontroller": "Tes pouces remercient. Tes adversaires, pas.",
  "lg-g5-oled-65-oled65g56ls-2025": "Tes voisins vont squatter ton salon tous les soirs.",
  "eufy-solocam-s340": "Mate ton facteur façon James Bond.",
  "ventilateur-rowenta-vu5890f0": "Brise de plage sans les miettes de sable.",
  "samsung-galaxy-s26-ultra": "Le zoom voit ce que ton voisin mange ce soir.",
  "iphone-17-pro-max": "Cher. Très cher. Mais t'as l'air riche.",
  "dyson-supersonic-nural": "Sèche tes cheveux plus vite que tes ex. Enfin presque.",
  "dyson-airwrap-i-d": "Tes cheveux plus stylés que ta vie sociale.",
  "roomba-combo-j9plus": "Meilleur GPS que toi dans ta rue. Triste mais vrai.",
  "manette-flydigi-vader4pro": "Tes potes vont te traiter de tricheur. Et t'auras raison.",
  "samsung-qn900f-65-8k-2026": "8K pour voir les cernes des acteurs. Flippant.",
  "jeu-coop-ittakestwo-ps5": "Le seul jeu qui sauve des couples. Et des canap's.",
  "jeu-coop-splitfiction-ps5": "Coop'rative épique — vos doigts vont causer.",
  "tablette-apple-ipadpro-m5-11-b0fwd6": "Plus fine que tes excuses pour pas faire de sport.",
  "garmin-fenix-8": "Survit à ta batterie de téléphone. Et à ta volonté.",
  "mova-p50-pro-ultra": "Nettoie pendant que tu scrolles. Bientôt il vote.",
  "lg-c6-oled-65-oled65c6-2026": "Le cinéma à la maison. Popcorn inclus.",

  "logitech-mx-mechanical-mini": "Tellement compact que même Thanos dirait 'c'est... inévitable'.",
  "dreame-l40s-pro-ultra": "Nettoie si bien que ta maison devient une salle blanche du MCU.",
  "asus-rog-strix-scar-18-2025": "Plus de pixels que de larmes après un épisode de Game of Thrones.",
  "nothing-phone-3-256-go": "Tellement transparent, même Neo verrait le code.",
  "philips-oled909-55-55oled90912-2024": "Les noirs si profonds que Voldemort s'y cacherait.",
  "bosch-optimum-mum9": "Pétrir une pâte comme Hulk fait une crêpe.",
  "haier-htf-610dsn7": "Frigo tellement froid que Jack Dawson aurait survécu sur le Titanic.",
  "samsung-galaxy-s26-plus": "L'IA intégrée, c'est comme avoir Jarvis dans la poche.",
  "la-sommeliere-ls512zblack": "Garder ton Château Margaux comme Gollum garde l'Anneau.",
  "stokke-yoyo³-6": "Pliage plus rapide qu'Optimus Prime en transformation.",
  "hp-envy-inspire-7924e": "Imprime si vite que même Flash serait jaloux.",
  "dreo-cruiser-pro-t1": "Ventile comme un dragon de Game of Thrones, sans le feu.",
  "navee-s65c": "Glisse sur la route comme Han Solo dans le Faucon Millenium.",
  "dji-romo-p": "Le meilleur ami robotique depuis Wall-E.",
  "delonghi-pinguino-pac-el112-cst-wifi": "Climatise ta pièce comme Tony Stark refroidit son réacteur.",
  "ninja-crispi-fn101eu": "Frites si croustillantes que même les Vogons les aimeraient.",
  "manette-8bitdo-pro2-halleffect": "Joue comme si tu étais dans Ready Player One, sans le casque.",
  "cosori-iconic-single-6-2l": "Friture si saine que même le Chaperon Rouge dirait 'merci grand-mère'.",
  "liebherr-cbnd-5723": "Congèle tes légumes comme Elsa congele son royaume.",
  "acer-predator-helios-neo-16-ai": "L'IA prédit tes kills avant même que tu ne tires.",
  "giant-explore-e-plus-1-2026": "Pédale comme si tu fuyais un T-Rex dans Jurassic Park.",
  "siemens-kg39nxxdf": "Rangement des courses comme Hermione organise sa bibliothèque.",
  "ninja-foodi-smartlid-ol550eu": "Cuisine si vite que même Flash serait impressionné.",
  "keychron-q5-max": "Clavier si silencieux que même un Ninja l'entendrait pas.",
  "simba-hybrid-pro": "Dors comme un bébé après une bataille dans Avengers: Endgame.",
  "sony-bravia-8-ii-65-qd-oled-65xr8m2-2025": "Les couleurs si vives que même un daltonien verrait le multiverse.",
  "oneplus-15-12-256-go": "Charge si vite que tu passes de 0 à 100 en un battement de cil.",
  "arlo-pro-5s-2k": "Surveille ta maison comme l'oeil de Sauron, mais en bienveillant.",
  "lg-gbb92staxp": "Frigo tellement spacieux que même Thanos y tiendrait avec son gant.",
  "lemokey-p1-he": "Clavier mécanique qui claque comme les sabres laser de Star Wars.",
  "apc-back-ups-pro-br1500gi": "Protège tes données comme le Bouclier de Captain America.",
  "samsung-dw60a8050fs": "Lave ta vaisselle plus vite que Flash ne nettoie sa tanière.",
  "tablette-apple-ipadpro-m5-13": "Tellement puissante que même un MacBook se demande qui est le boss.",
  "ventilateur-honeywell-hyf260e4-colonne": "Rafraîchit ta pièce comme un vent de Mordor, sans les dangers.",
  "cyberpower-cp1500epfclcd": "Sauvegarde tes fichiers comme Pikachu sauve Ash.",
  "razer-huntsman-v3-pro": "Switch si rapide que même Neo ne pourrait pas les esquiver.",
  "reolink-duo-3-poe": "Surveille ton jardin comme les yeux de l'aigle dans Le Seigneur des Anneaux.",
  "siemens-sn65zx07ce-iq500": "Lave si bien que même Cendrillon dirait 'c'est magique'.",
  "honeywell-quietset-hyf500e4": "Silencieux comme un ninja dans une bibliothèque de Star Wars.",
  "tablette-apple-ipadair-m4-13": "Légèreté d'une plume, puissance d'un réacteur d'Arc Reactor.",
  "tablette-honor-magicpad4": "Écran si brillant que même le soleil de Tatooine serait jaloux.",
  "beko-bdin38440c": "Lave ta vaisselle comme Hagrid nettoie ses marmites.",
  "schneider-easy-ups-online-srv1ki": "Alimentation ininterrompue comme la Force.",
  "delonghi-la-specialista-arte-evo-ec9255m": "Café si bon que même un elfe de Tolkien en raffolerait.",
  "corsair-k70-max-rgb": "RGB si intense que même un Jedi pourrait voir la Force.",
  "candy-cmxg22ds": "Lave ton linge comme un sortilège de nettoyage de Harry Potter.",
  "jeu-coop-streetsofrrage4": "Coop si intense que même les Gardiens de la Galaxie se battraient à tes côtés.",
  "flexispot-e7-plus": "Bureau réglable comme la taille de Hulk.",
  "tablette-samsung-tabs10fe": "Écran si grand que même un Troll de Harry Potter pourrait y voir.",
  "oneplus-15-12256-go-af3e8324": "Charge si vite que tu passes de 0 à 100 en un battement de cil.",
  "nectar-sleep-memory-foam": "Dors comme un bébé après une bataille dans Avengers: Endgame.",
  "jeu-coop-overcooked-allyoucaneat-ps5": "Cuisine en coop comme si tu faisais équipe avec les Avengers.",
  "gazelle-ultimate-t10-hmb": "Vélo si rapide que même Flash dirait 'trop vite pour moi'.",
  "bosch-easycontrol-ct200": "Contrôle ton chauffage comme Tony Stark contrôle ses armures.",
  "samsung-galaxy-a56-5g-256-go": "5G si rapide que même un Kryptonien serait jaloux.",
  "suntec-impuls-26-eco-r290": "Climatise ta pièce comme un dragon de Game of Thrones, sans le feu.",
  "lg-dual-inverter-lp1419ivsm": "Refroidit ta pièce comme Elsa congele son royaume.",
  "aeg-rcb736e5mx": "Lave ton linge comme un sortilège de nettoyage de Harry Potter.",
  "dreame-l10s-ultra-gen-2": "Nettoie si bien que ta maison devient une salle blanche du MCU.",
  "bose-soundlink-max": "Son si clair que même un audiophile dirait 'c'est parfait'.",
  "tineco-pure-one-a90s": "Aspire si fort que même un trou noir serait impressionné.",
  "levoit-core-300s": "Purifie l'air comme un filtre de navette spatiale.",
  "google-pixel-10-pro-128-go": "Photo si bonne que même un photographe de National Geographic dirait 'wow'.",
  "xiaomi-17-ultra-512-go-leica": "Objectif Leica, photos dignes d'un film de Christopher Nolan.",
  "samsung-hw-q800f": "Son surround si immersif que tu te crois dans un film de Star Wars.",
  "siemens-sn63ex14ce": "Lave si bien que même Cendrillon dirait 'c'est magique'.",
  "netatmo-thermostat-intelligent-nth01": "Régule ta température comme un réacteur d'Arc Reactor.",
  "canyon-commuter-on-8": "Vélo électrique si puissant que même un Hulk vert serait jaloux.",
  "google-nest-learning-thermostat-3e-gen": "Apprend tes habitudes comme Jarvis apprend celles de Stark.",
  "panasonic-nn-ds59nbepg": "Micro-ondes si rapide que même Flash dirait 'trop vite pour moi'.",
  "haier-ws190ga-wine-bank-60-series-5": "Garde ton vin comme Gollum garde l'Anneau.",
  "samsung-mc35j8085ct": "Micro-ondes si intelligent que même un ordinateur de Star Trek serait jaloux.",
  "lg-mh7265dps": "Micro-ondes si puissant que même un Kryptonien serait impressionné.",
  "arlo-essential-indoor-2k": "Surveille ta maison comme l'oeil de Sauron, mais en bienveillant.",
  "moulinex-easy-fry-smart-silence-ez572df0": "Friture si saine que même le Chaperon Rouge dirait 'merci grand-mère'.",
  "siemens-bf555lms0": "Four si parfait que même un chef de Ratatouille serait fier.",
  "technics-eah-a800": "Son si pur que même un audiophile dirait 'c'est parfait'.",
  "candy-ccvb-301": "Aspire si fort que même un trou noir serait impressionné.",
  "klarstein-kraftwerk-smart-10k": "Climatise ta pièce comme un dragon de Game of Thrones, sans le feu.",
  "xiaomi-vacuum-cleaner-g20-bhr8831eu": "Aspire si bien que même Thanos dirait 'c'est... inévitable'.",
  "la-sommeliere-ls102dzblack": "Ce frigo garde tes bouteilles au frais, comme le royaume de Glace de Game of Thrones.",
  "jbl-bar-1000-mk2": "Ton salon devient un cinéma Marvel, avec plus de basses que Hulk.",
  "atlantic-cozytouch-bridge": "Ton chauffage est plus connecté que les gosses de Stranger Things.",
  "tediber-hybride": "Dors comme un bébé wookie, sans les poils.",
  "google-nest-cam-2e-gen": "Elle te surveille mieux que le grand frère de 1984.",
  "sony-wh-1000xm5": "Annule le bruit mieux que Hermione dans une bibliothèque.",
  "cecotec-energysilence-6600-skyline": "Aspire plus silencieux qu'un ninja en mission secrète.",
  "dyson-spot-scrub-ai": "Nettoie tes taches comme un Jedi efface les Sith.",
  "samsung-rb38t775cs9": "Ton frigo est plus organisé que le bureau de Dwight Schrute.",
  "bosch-wax32e40ff": "Lave ton linge plus vite que Flash court.",
  "lg-c5-oled-55-oled55c54la-2025": "Les couleurs sont plus vives que les cheveux de Harley Quinn.",
  "delonghi-primadonna-soul-ecam610-75-mb": "Ton café est plus intense que la révélation de Fight Club.",
  "reolink-argus-4-pro": "Surveille ton jardin comme un cerbère numérique.",
  "bosch-kgn56vldt": "Garde tes aliments frais plus longtemps qu'Hiver à Winterfell.",
  "kenwood-titanium-chef-baker-xl": "Pétrit la pâte plus fort que Thor son marteau.",
  "sharp-yc-ms252ae-w": "Réchauffe ton popcorn plus vite que Marty McFly sa DeLorean.",
  "uppababy-vista-v3-nacelle": "Pousse ton bébé comme un héros de Mario kart.",
  "electrolux-eem43200l": "Lave ta vaisselle plus discrètement qu'un espion de Mission Impossible.",
  "rowenta-intense-pure-air-connect-xl-pu6080f0": "Purifie l'air mieux que les poumons de Dark Vador.",
  "samsung-ms23k3513ak": "Micro-ondes plus rapide qu'un téléporteur de Star Trek.",
  "vsett-10-plus": "Roule plus vite que Sonic sans les anneaux.",
  "moulinex-easy-fry-infrared-7l": "Frit sans huile, comme un Jedi évite le côté obscur.",
  "anker-prime-250w-6-ports-ganprime": "Charge tous tes appareils plus vite que Tony Stark son armure.",
  "xiaomi-smart-air-purifier-4-pro": "Nettoie l'air plus efficacement que les filtres de Batman.",
  "dyson-v15-detect-absolute": "Détecte la poussière mieux que les scanners de Star Wars.",
  "canon-pixma-ts9551c": "Imprime tes photos aussi nettes que les souvenirs de Inception.",
  "ugreen-nexode-pro-160w": "Charge ta batterie plus vite que Quicksilver court.",
  "baseus-powercombo-tower-65w": "Alimente tes gadgets comme une centrale nucléaire de SimCity.",
  "ventilateur-rowenta-vu2640f0-table": "Te rafraîchit mieux que le souffle d'un dragon.",
  "hisense-ax5125h": "Son surround qui fait trembler les murs comme Jurassic Park.",
  "segway-ninebot-max-g2-e": "Glisse sur la route comme un hoverboard de Retour vers le Futur.",
  "honeywell-home-t6r-lyric": "Règle ta température mieux que le thermostat de Homer Simpson.",
  "ventilateur-honeywell-ht900e-compact": "Petit mais costaud, comme un Hobbit au combat.",
  "narwal-flow": "Nettoie ton sol plus propre que la conscience d'Aragorn.",
  "aeg-fsb52917z": "Lave ta vaisselle plus silencieusement qu'un chat de Schrödinger.",
  "lg-b5-oled-55-oled55b56la-2025": "Images plus fluides que les mouvements de Neo dans Matrix.",
  "joyor-s10-s": "Trotinette plus rapide qu'un scout de Star Wars.",
  "joie-versatrax": "Pousse ton enfant plus facilement que Mario pousse des blocs.",
  "cecotec-forceclima-12250-smartheating": "Chauffe ta pièce plus vite qu'un sort de Harry Potter.",
  "samsung-rf65a967fsr": "Réfrigérateur plus spacieux que le TARDIS de Doctor Who.",
  "pure-air-pro-2": "Purifie l'air comme un filtre à air de vaisseau spatial.",
  "silvercrest-monsieur-cuisine-smart": "Cuisonne tout comme un chef étoilé de Top Chef.",
  "bosch-bel554ms0": "Cuit ton pain plus croustillant que la réplique de Terminator.",
  "ninja-air-fryer-max-af160eu": "Frites plus croustillantes que les répliques de James Bond.",
  "trek-allant-plus-8": "Vélo électrique plus puissant que la Force de Luke.",
  "delonghi-dedica-arte-ec885m": "Café plus express que les répliques de Sherlock Holmes.",
  "climadiff-garde200d": "Garde ton vin au frais comme une cave de vampire.",
  "winix-5500-2": "Filtre l'air mieux que les poumons de Deadpool.",
  "cowboy-cross-st": "Vélo électrique plus stylé que la moto de Ghost Rider.",
  "thule-urban-glide-3": "Pousse ton bébé plus vite que la voiture de James Bond.",
  "tesla-model-3-highland": "Conduis plus silencieusement qu'un ninja en mode furtif.",
  "ikea-mittzon-electrique": "Bureau réglable plus haut que les ambitions de Walter White.",
  "autonomous-desk-pro": "Bureau ergonomique plus confortable que le trône de Game of Thrones.",
  "philips-oled910-65-65oled91012-2025": "Images plus nettes que la vision d'un aigle.",
  "ugreen-nexode-300w-5-ports-gan": "Charge tout comme une borne de recharge de Iron Man.",
  "whirlpool-wbo3t123pfx": "Lave ta vaisselle plus propre que les dents de Blanche-Neige.",
  "manette-backbone-one-gen2": "Transforme ton téléphone en console comme un Pokémon évolue.",
  "bugaboo-donkey-5-duo": "Pousse tes jumeaux plus facilement que Mario gère ses champignons.",
  "ventilateur-tristar-ve5978": "Brass l'air plus fort que le vent de la mort de Dark Vador.",
  "manette-hori-splitpadcompact": "Joue mieux que les doigts de Mozart.",
  "beautyrest-black-simmons": "Dors comme un bébé dans le ventre de Maman.",
  "microsoft-surface-laptop-7-15": "Plus fin que le rasoir d'Occam.",
  "samsung-galaxy-watch-ultra": "Montre plus résistante que le bouclier de Captain America.",
  "duux-bright-2": "Réchauffe ta pièce plus vite que le soleil de Tatooine.",
  "leclerc-baby-hexagon": "Parc pour bébé plus sécurisé que le bunker de Lost.",
  "kitchenaid-artisan-5ksm175": "Mixeur plus puissant que le marteau de Thor.",
  "dreame-z30": "Aspire plus fort que l'aspirateur de Ghostbusters.",
  "dyson-purifier-cool-gen1-tp10": "Purifie l'air plus frais que le souffle d'un Yeti.",
  "tablette-apple-ipadair-m4-11": "Plus rapide que la lumière de Star Wars.",
  "riese-muller-charger4-gt-touring": "Vélo électrique plus robuste que le camion de Transformers.",
  "meaco-fan-1056p-tower-air-circulator": "Plus qu'un ventilateur, c'est le Chevalier Blanc de l'air frais.",
  "bosch-sms4hci52e": "La vaisselle propre, comme si Skynet avait une conscience.",
  "epson-ecotank-et-2851": "L'arme secrète de Gutenberg contre le cartouche gate.",
  "yamaha-crosscore-rc": "Le vélo qui fait du 'Vroom' dans ta tête, façon Initial D.",
  "kaabo-wolf-warrior-11-plus": "Le loup solitaire qui te fait regretter ton abonnement Uber.",
  "liebherr-wkp196": "Ton frigo est plus organisé que la bibliothèque de Batman.",
  "epson-ecotank-et-8550": "Imprime comme un Tyranosaure Rex, mais sans bruit.",
  "baseus-gan5-pro-100w-2-port": "Charge ton téléphone plus vite que Flash au petit-déjeuner.",
  "lenovo-ideapad-slim-5-16-amd": "Le PC qui fait du yoga, tellement il est flexible.",
  "asus-zenbook-14-oled-ux3405ca": "L'écran qui rend jaloux le miroir de Blanche-Neige.",
  "blueair-blue-pure-3350i-max": "Purifie l'air comme si Dumbledore agitait sa baguette.",
  "samsung-galaxy-book5-pro-14": "L'ordinateur qui tient plus longtemps que la patience de Gandalf.",
  "belkin-boostcharge-pro-108w-4-port-gan": "Le multi-chargeur qui rend les autres câbles obsolètes.",
  "uplift-desk-v3": "Ton bureau monte plus haut que les attentes de ta mère.",
  "samsung-ax9500-ax47r9080sseu": "Filtre l'air mieux que le masque de Dark Vador.",
  "google-pixel-9a-128-go": "Le téléphone qui comprend tes blagues, même les nulles.",
  "emma-original-hybrid-ii": "Le matelas qui te fait dire 'Non, je ne veux pas me lever' comme dans Le Roi Lion.",
  "tablette-samsung-tabs11ultra": "La tablette qui pourrait remplacer un écran de cinéma.",
  "lg-db425txs-quadwash": "Lave la vaisselle avec la précision d'un chirurgien de Grey's Anatomy.",
  "specialized-turbo-vado-sl-2": "Le vélo électrique qui te fait voler comme E.T.",
  "epson-ecotank-et-5851": "L'imprimante qui économise plus que Scrooge McDuck.",
  "haier-hws49gae-wine-bank-50-series-5": "La cave à vin qui garde tes bouteilles comme Gollum son précieux.",
  "miele-g-7410-sci-autodos": "Le lave-vaisselle qui nettoie comme si ta belle-mère regardait.",
  "inokim-oxo": "La trottinette qui te fait sentir comme Marty McFly.",
  "dell-xps-13-9350": "L'ordinateur portable qui tient dans un sac à main, mais pas le tien.",
  "xiaomi-15t-pro-512-go-leica": "L'appareil photo qui rend tout le monde photogénique.",
  "bultex-neo-sleep-energizing": "Le matelas qui te recharge comme une station Tesla.",
  "apple-140w-usb-c-adaptateur-secteur-magsafe-3": "Le chargeur qui te fait oublier les autres comme un ex toxique.",
  "ergear-bureau-assis-debout-electrique": "Le bureau qui monte et descend comme une montagne russe.",
  "samsung-ww11bb944dges": "La machine à laver qui nettoie mieux que la baguette magique d'Harry Potter.",
  "epeda-lounge-4": "Le canapé qui t'aspire comme un trou noir, mais en confortable.",
  "smeg-smf03": "Le robot pâtissier qui ferait pleurer Marie-Antoinette.",
  "anker-nano-ii-65w": "Le chargeur de poche qui a la puissance de Hulk.",
  "manette-nintendo-joycon2-paire": "Les manettes qui te font sentir comme un vrai héros de jeu vidéo.",
  "casper-original": "Le matelas qui te fait dormir comme un bébé, même sans biberon.",
  "manette-hori-splitpadpro-noir": "La manette qui te donne des pouces en acier trempé.",
  "ecoflow-wave-3": "La climatisation portable qui te sauve de l'enfer de Dante.",
  "jeu-coop-mariokartworld-switch2": "Le jeu qui transforme tes amis en ennemis, façon Mario.",
  "lg-s95tr": "La barre de son qui fait trembler les voisins comme Godzilla.",
  "apc-smart-ups-smt1500ic": "L'onduleur qui protège ton PC comme un garde du corps.",
  "jeu-coop-cuphead-dlc-switch": "Le jeu qui teste ton amitié plus que Survivor.",
  "moulinex-mo28esmir2": "Le four qui cuit comme un chef étoilé, sans le stress.",
  "beko-wdex8543050bcw": "La machine qui lave et sèche, multitâche comme une mère de famille.",
  "apple-airpods-max-2": "Le casque qui isole du monde mieux que la chambre de Harry Potter.",
  "magimix-cook-expert-premium-xl": "Le robot cuiseur qui fait la cuisine mieux que ta grand-mère.",
  "wooting-80he": "Le clavier qui réagit plus vite que Flash dans un call of duty.",
  "eaton-5sc-1500i": "L'onduleur qui garde ton serveur en vie comme un vampire.",
  "be-quiet-light-mount": "Le support qui éclaire ton PC comme un concert de rock.",
  "olimpia-splendid-dolceclima-air-pro-14-hp-wifi": "Le climatiseur qui te rafraîchit comme une glace à la menthe.",
  "netatmo-smart-outdoor": "La caméra qui surveille ton jardin comme un agent secret.",
  "hypnia-bien-etre-supreme-slome": "Le matelas qui te fait flotter comme un nuage, mais en mieux.",
  "samsung-galaxy-s26-ultra-256-go": "Le téléphone qui a plus de pixels que tes yeux n'en voient.",
  "apple-iphone-17-pro-max-256-go": "L'iPhone qui te fait dépenser comme si tu étais Tony Stark.",
  "anker-soundcore-space-q45": "Le casque qui annule le bruit mieux que les menaces de ta mère.",
  "logitech-g515-lightspeed-tkl": "Le clavier qui te fait gagner des parties, même contre des bots.",
  "roborock-s8-maxv-ultra": "Le robot qui nettoie mieux que ta mère, sans râler.",
  "cube-touring-hybrid-one-500": "Le vélo qui te fait voyager sans bouger de ton canapé.",
  "coway-ap-1512hh-airmega-mighty": "Le purificateur d'air qui combat la pollution comme un super-héros.",
  "somfy-thermostat-connecte-v2": "Le thermostat qui contrôle ta maison comme un maître Jedi.",
  "danfoss-ally-starter-pack": "Les têtes thermostatiques qui rendent ton radiateur intelligent.",
  "tablette-apple-ipadmini7": "La tablette qui tient dans une main, comme un livre de poche.",
  "tablette-xiaomi-pad7pro": "La tablette qui rivalise avec les meilleures, sans le prix.",
  "bosch-smv6zcx49e": "Le lave-vaisselle qui sèche comme un sèche-cheveux, mais pour la vaisselle.",
  "delonghi-rivelia-latte-feb4455": "La machine à café qui te fait des lattes comme un barista italien.",
  "nespresso-essenza-mini-c30": "La machine à café qui tient dans un tiroir, mais pas le goût.",
  "eufy-indoor-cam-s350": "La caméra qui veille sur ton intérieur comme un ange gardien.",
  "nuphy-air75-v3": "Le clavier mécanique qui est plus silencieux qu'une bibliothèque.",
  "songmics-bureau-electrique": "Le bureau qui monte et descend, comme tes espoirs en début de semaine.",
  "secretlab-magnus-pro": "Le bureau qui supporte ton setup comme un pilier de cathédrale.",
  "aum-world-advanced-pro": "Le produit qui te fait dire 'Waouh' comme dans une pub des années 90.",
  "dunlopillo-heveane-latex-naturel": "Je dors comme un bébé Enderman, sans les blocs.",
  "lg-gsxv91mbae": "Mon frigo a plus de succès que moi sur Tinder.",
  "jeu-coop-sackboy-ps5": "Sackboy fait du parkour, moi je fais du canapé.",
  "moulinex-i-companion-touch-xl": "Mon robot de cuisine a plus de touches que mon ex.",
  "cybex-balios-s-lux-2": "Même Batman utiliserait ça pour ses virées nocturnes.",
  "beko-b5rcne406hxbr": "Ce frigo a plus de fonctionnalités que mon smartphone.",
  "tado-v3-plus-kit-sans-fil": "Mon thermostat est plus intelligent que mon voisin.",
  "roborock-saros-10r": "Mon aspirateur a un meilleur sens de l'orientation que moi.",
  "philips-combi-connecte-xxl-hd9880-90": "Je cuisine comme un chef sans le chapeau.",
  "logitech-mx-keys-s": "Mes touches sont plus silencieuses que mes pensées.",
  "acer-swift-14-ai-sf14-51": "Mon PC est plus rapide que ma décision de commander.",
  "hp-envy-x360-14-amd-2-en-1": "Je peux plier mon PC, mais pas mon caractère.",
  "dyson-v8-advanced": "Je aspire la poussière comme Thanos aspire les pierres.",
  "msi-raider-18-hx-ai": "Mon PC a plus de LEDs que de neurones.",
  "salicru-slc-1500-twin-rt2": "Mon onduleur a plus de backup que moi un lundi.",
  "delta-dore-tybox-5000-rf": "Mon chauffage est plus connecté que mes potes.",
  "lenovo-legion-5-15irx10": "Je joue comme un pro, sans le salaire.",
  "hp-pavilion-plus-14-oled": "Mon écran est plus OLED que mon teint.",
  "flexispot-e7-pro": "Mon bureau peut monter plus haut que mon moral.",
  "samsung-bespoke-ai-jet-ultra-vs90f40eek": "Mon aspirateur a plus d'IA que mon ex.",
  "brother-mfc-j4540dw": "Je scanne mes factures plus vite que mon ombre.",
  "hp-laserjet-pro-mfp-4102fdw": "Mon imprimante est plus fiable que mon wifi.",
  "brother-dcp-l3560cdw": "Je imprime en couleur, ma vie en noir et blanc.",
  "manette-8bitdo-ultimate2c": "Je joue comme dans les années 90, sans le lag.",
  "satechi-200w-usb-c-6-port-gan": "Je charge tous mes appareils comme un dieu.",
  "hp-smart-tank-7305": "Je remplis mon encre moins souvent que mon verre.",
  "desktronic-homepro": "Mon bureau est plus réglable que mon humeur.",
  "philips-air-performer-series-8000-amf87015": "Je respire un air pur, comme dans un film post-apo.",
  "ecovacs-deebot-n20-plus": "Mon robot nettoie mieux que moi un samedi.",
  "ventilateur-rowenta-vu6980f0-colonne": "Je fais du vent comme un super-héros.",
  "rowenta-turbo-silence-extreme-vu5770f0": "Mon ventilateur est plus silencieux que mon chat.",
  "dyson-purifier-cool-formaldehyde-tp09": "Je purifie l'air comme un Jedi.",
  "roborock-qrevo-curv-2-pro": "Mon aspirateur a plus de courbes que moi.",
  "cybex-gazelle-s": "Ma poussette est plus stylée que ma tenue.",
  "eaton-3s-700-iec": "Mon onduleur est plus stable que ma vie.",
  "msi-vector-16-hx-ai": "Mon PC a plus de puissance que mon café.",
  "powerwalker-vi-1000-csw-fr": "Je backup mes données comme un survivant.",
  "electrolux-chillflex-pro-exp26u338cw": "Mon clim est plus fraîche que mes blagues.",
  "decathlon-stilus-e-touring": "Je roule électrique, comme dans un film de SF.",
  "ventilateur-rowenta-vu5640f2": "Je fais du vent sans effort, comme un politicien.",
  "sony-ht-sf150": "Mon son est plus surround que ma vie sociale.",
  "philips-sries-5000-cx553511": "Je rase ma barbe comme un pro, sans les cicatrices.",
  "satechi-165w-usb-c-4-port-gan": "Je charge en 165W, plus vite que mon ombre.",
  "jeu-coop-movingout2-switch": "Je déménage virtuellement, sans les courbatures.",
  "cosori-turboblaze-6l": "Je cuis comme un chef, sans le stress.",
  "jeu-coop-trine5-ps5": "Je résous des puzzles en équipe, comme dans ma vie.",
  "eaton-5s-1500i": "Mon onduleur est plus fiable que mon wifi.",
  "anker-soundcore-motion-x600": "Mon son est plus puissant que mon café.",
  "beyerdynamic-dt-900-pro-x": "J'entends tout, comme un espion.",
  "jeu-coop-tmnt-shreddersrevenge": "Je combats le crime avec des tortues, comme dans mon enfance.",
  "bestron-dft430-climate-control": "Mon chauffage est plus réglable que mon humeur.",
  "hp-officejet-pro-9135e": "Je imprime des documents, pas des excuses.",
  "stadler-form-charly-floor": "Mon ventilateur est plus design que ma déco.",
  "lenovo-thinkbook-14-gen-7": "Je travaille comme un pro, sans le stress.",
  "apc-back-ups-pro-br650mi": "Je backup mes données comme un survivaliste.",
  "samsung-s95f-65-qd-oled-tq65s95f-2025": "Mon écran est plus noir que mon humour.",
  "rowenta-urban-cool-vu6770f0": "Je fais du vent comme un super-héros urbain.",
  "technivorm-moccamaster-kbg-select": "Mon café est plus fort que mon sommeil.",
  "sennheiser-ambeo-soundbar-mini": "Mon son est plus immersif que ma réalité.",
  "klarstein-barossa-77-duo": "Je cuisine comme un chef, sans le tablier.",
  "philips-airfryer-3000-double-panier-na352-00": "Je frit sans huile, comme un nutritionniste.",
  "sony-srs-xg500": "Mon son est plus fort que mes voisins.",
  "dyson-v12-detect-slim-absolute": "Je détecte la poussière comme un détective.",
  "sony-bravia-theatre-bar-9": "Mon son est plus cinéma que ma vie.",
  "shark-stratos-iz862h": "Je aspire comme un requin, sans les dents.",
  "rowenta-x-force-flex-1480-rh9b74wo": "Je nettoie comme un ninja, sans le bruit.",
  "apollo-ghost-2024": "Je roule fantôme, comme dans un film d'horreur.",
  "ninja-combi-12-en-1-sfp700eu": "Je cuisine 12 façons, comme un chef étoilé.",
  "sonos-move-2": "Je bouge avec le son, comme un DJ.",
  "manette-gamesir-t4kaleid": "Je joue avec des couleurs, comme un arc-en-ciel.",
  "tablette-samsung-tabs11": "Une tablette qui rendrait même Tim Cook jaloux.",
  "tado-x-kit-demarrage": "Le thermostat qui sait quand tu es en mode avion.",
  "manette-powera-enhanced-hyrule": "Hyrule t'appelle, réponds avec style.",
  "ue-hyperboom": "Le son qui ferait trembler même Thanos.",
  "apple-watch-ultra-2": "Pour ceux qui veulent le temps d'un super-héros.",
  "kitchenaid-professional-5ksm7990": "Le robot cuisine qui rivalise avec Iron Man.",
  "trotec-pac-3500-sh": "Fais comme le T-1000, reste au frais.",
  "tp-link-tapo-c325wb": "Surveille comme si tu étais dans Minority Report.",
  "unagi-model-one-e500": "Glisse en ville comme dans Blade Runner 2049.",
  "whirlpool-pacw212hp": "Le frais qui te fait oublier l'Enfer de Dante.",
  "ventilateur-meaco-1056p": "Le vent qui souffle comme dans Le Seigneur des Anneaux.",
  "ventilateur-rowenta-vu4210f0-mosquito": "Bye bye moustiques, comme dans Jurassic Park.",
  "garmin-venu-4": "Ta montre, ton coach version Star Wars.",
  "samsung-hw-q990f": "Le son qui enveloppe comme un cocon de Stranger Things.",
  "whirlpool-mwp303sb": "Le micro-ondes qui réchauffe comme la Force.",
  "withings-scanwatch-2": "Ta santé suivie comme dans Westworld.",
  "xiaomi-electric-scooter-4-ultra": "Ton trajet devient une scène de Retour vers le Futur.",
  "huawei-watch-gt-5-pro": "L'élégance d'un héros Marvel à ton poignet.",
  "renault-5-e-tech": "La nouvelle vague électrique façon Stranger Things.",
  "sonos-beam-gen-2": "Le son qui remplit la pièce comme dans Inception.",
  "hyundai-ioniq-6": "Glisse comme une limousine de The Matrix.",
  "byd-seal": "La berline électrique qui fait de l'ombre aux supercars.",
  "citroen-e-c3": "La citadine électrique qui défie les lois de la physique.",
  "volkswagen-id-7": "La berline du futur version Tron.",
  "ecovacs-deebot-t30s-combo": "Le robot qui nettoie comme R2-D2.",
  "renault-megane-e-tech": "La compacte électrique qui a du punch comme dans Fast & Furious.",
  "google-pixel-watch-4": "Ta montre connectée comme dans Her.",
  "samsung-galaxy-watch-8": "Le compagnon de poignet digne de Star Trek.",
  "amazfit-balance-2": "Le suivi santé avec la précision de Sherlock.",
  "dreame-h13-pro": "Le nettoyeur qui aspire comme un trou noir.",
  "bmw-ix3-neue-klasse": "Le SUV électrique qui fait battre le cœur comme un V8.",
  "peugeot-e-3008": "L'aventure électrique avec le style de James Bond.",
  "devialet-mania": "Le son qui explose comme une bombe dans un film de Nolan.",
  "jbl-charge-6": "La fête portative comme dans les années 80.",
  "harman-kardon-onyx-studio-9": "Le design qui en jette comme dans The Great Gatsby.",
  "marshall-emberton-iii": "Le son rock qui te transporte à Woodstock.",
  "dyson-washg1": "Nettoie comme un aspirateur de Ghostbusters.",
  "b-o-beosound-a1-3rd-gen": "L'enceinte qui sonne comme une symphonie de Beethoven.",
  "karcher-fc7-cordless": "Le nettoyeur de sols digne d'un film d'action.",
  "narwal-freo-x-ultra": "Le robot qui lave comme dans un conte de fées.",
  "tesla-model-y-juniper": "Le SUV électrique qui te fait voyager dans le temps.",
  "nuna-mixx-next": "La poussette qui roule comme dans Blade Runner.",
  "la-sommeliere-apogee150pvn": "Le vin conservé comme dans Le Parrain.",
  "miele-wcr870-wps": "La machine à laver qui dure comme un Nokia 3310.",
  "samsung-bespoke-jet-ai": "L'aspirateur qui réfléchit comme dans 2001: L'Odyssée de l'Espace.",
  "ring-spotlight-cam-pro": "Surveille comme un vigile de la Zone 51.",
  "ventilateur-duux-whisperflex2-dxcf74": "Le silence qui rafraîchit comme dans un temple Shaolin.",
  "bissell-crosswave-x7-pet-pro": "Nettoie les poils comme un épisode de The Walking Dead.",
  "hoover-hfree-800-aqua": "Aspire et lave comme un héros de l'ère industrielle.",
  "tineco-floor-one-s7-pro": "Le sol brillant comme dans un film de Wes Anderson.",
  "delonghi-magnifica-evo-ecam29081tb": "Le café parfait comme dans Friends.",
  "haier-hw100-b14979": "Lave comme une machine du futur avec la précision de Terminator.",
  "aeg-lr9w96600": "Sèche comme un souffle de dragon.",
  "samsung-ww90t986dsh": "Lave et essore comme dans un ballet aquatique.",
  "lg-f4wv910p2se": "La lessive qui devient un spectacle de K-pop.",
  "lg-f94r50whs": "Le linge qui sort comme neuf d'un film de science-fiction.",
  "sage-barista-express-impress-bes876": "Le barista à domicile comme dans La La Land.",
  "philips-series-5400-lattego-ep544790": "Le café onctueux comme dans un film de Wong Kar-wai.",
  "nothing-phone-3-12256-go-c4edc248": "Le téléphone transparent comme dans The Ring.",
  "samsung-galaxy-s26-256-go-f686a76a": "Le smartphone qui brille comme une étoile de la galaxie.",
  "jura-e8-piano-black": "L'expresso qui a le swing de Miles Davis.",
  "xiaomi-15t-pro-12512-go-leica-73aaecde": "Le photophone qui capture comme un photoreporter de guerre.",
  "audio-technica-ath-m50xbt2": "Le son qui te transporte dans un studio d'enregistrement légendaire.",
  "xiaomi-17-ultra-16512-go-leica-9c58fcd6": "L'appareil photo de poche qui rivalise avec un reflex pro.",
  "sennheiser-momentum-4-wireless": "Le casque qui enveloppe comme un concert privé.",
  "delonghi-nespresso-lattissima-one-en510b": "Le café rapide comme dans un film de Tarantino.",
  "bose-quietcomfort-ultra": "Le silence qui fait du bien comme dans Lost in Translation.",
  "jabra-evolve2-85": "Le casque pro qui te fait oublier le bruit du monde.",};

const EMOJIS = ["🤯", "🔥", "💀", "👽", "🤖", "⚡", "🎯", "🚀", "💪", "🧠", "🦾", "🎭", "✨", "🛸", "📡"];

function randomEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

// Generateur de tagline aléatoire pop culture
const TAGLINE_FALLBACKS = [
  "On l'a testé pour toi. Et on a presque manqué la livraison du kebab.",
  "Moins cher qu'un abonnement Netflix et plus utile qu'une saison 8 de Game of Thrones.",
  "Comme si Tony Stark avait conçu ce produit un vendredi après-midi.",
  "Le produit que même Neo utiliserait dans Matrix pour éviter les balles.",
  "Plus rapide que le Millennium Falcon en hyperdrive (presque).",
  "Le secret bien gardé de la Batcave. Bruce approuve.",
  "Si ce produit était un personnage de Marvel, ce serait Rocket Raccoon : petit mais costaud.",
  "Testé sur des cobayes humains. Aucun n'a survécu... à l'envie de l'acheter.",
  "Le genre de produit qui ferait pleurer de jalousie Q dans James Bond.",
  "L'objet que même le T-Rex de Jurassic Park utiliserait (s'il avait des pouces).",
  "Tellement bien que t'auras l'impression d'avoir un Mentor dans Zelda.",
  "Validé par la guilde des gamers. Et par ta mère. Les deux mondes réunis.",
  "Le couteau suisse du XXIe siècle, version Elon Musk (sans les tweets).",
  "Un design digne d'Apple, un prix digne d'IKEA, une perf digne de SpaceX.",
  "Si MacGyver avait ça, il aurait fini sa série en une saison.",
  "Le produit qui envoie du lourd. Littéralement. Regarde le poids.",
  "Tu vas enfin comprendre ce que signifie \"game changer\" sans être un joueur pro.",
  "Ce produit a mis plus de temps à être développé que la suite de Half-Life 3.",
  "Tellement silencieux que ça rendrait un ninja jaloux.",
  "Le genre de produit qui te fait dire 'mais pourquoi j'ai pas acheté ça avant' en pleurant.",
  "Plutôt que d'aller chez le psy, regarde les specs. C'est gratos.",
  "Quand la technologie rencontre le bon sens. Et accessoirement, ton portefeuille.",
  "Le produit que Batman rangerait dans sa ceinture utilitaire (en mieux).",
  "Le compromis parfait entre ton budget étudiant et tes envies de luxe.",
  "Tellement puissant que Thanos lui-même aurait snapé pour l'avoir.",
];

export default function RecentTests() {
  const [products, setProducts] = useState<TestProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const API_BASE = "/api";
        // Fetch all scored products
        const res = await fetch(`${API_BASE}/products?limit=80`);
        if (!res.ok) return;
        const all: TestProduct[] = await res.json();
        
        // Only keep those with a test_summary (has been "tested" by Troviio)
        const tested = all.filter(p => p.test_summary && p.estimated_score > 0);
        
        // Shuffle to avoid showing the same Top5 products
        const shuffled = [...tested].sort(() => Math.random() - 0.5);
        
        // Group by category, pick one from each (from shuffled order)
        const seenCategories = new Set<string>();
        const diversified: TestProduct[] = [];
        for (const p of shuffled) {
          const catKey = p.category_slug || p.category_id || "unknown";
          if (!seenCategories.has(catKey)) {
            seenCategories.add(catKey);
            diversified.push(p);
          }
          if (diversified.length >= 5) break;
        }
        // Fallback: if less than 5, fill with remaining shuffled products
        if (diversified.length < 5) {
          for (const p of shuffled) {
            if (!diversified.find(d => d.id === p.id) && diversified.length < 5) {
              diversified.push(p);
            }
          }
        }
        setProducts(diversified);
      } catch (e) {
        console.error("Erreur RecentTests", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-2 border-[#4257FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--coral)" }}>
            🧪 LES DERNIERS TESTS
          </p>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl" style={{ color: "var(--text)" }}>
            Les produits qu&apos;on a passés au crible
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-5" style={{ color: "var(--text-muted)" }}>
            Chaque produit a sa note Troviio et son mot rigolo. Clique pour découvrir le verdict.
          </p>
        </div>

        {/* Grid of 5 products — one per category */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {products.map((p) => {
            const score = p.estimated_score ?? 75;
            const emoji = randomEmoji();
            const tagline = TAGLINES[p.slug] || "On l'a testé pour toi. Non, vraiment.";

            return (
              <Link
                key={p.id}
                href={`/produit/${p.slug}`}
                className="group relative flex flex-col rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B5F]/30"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
              >
                {/* Emoji badge */}
                <span className="absolute -top-2 -right-2 text-xl drop-shadow-lg z-10">{emoji}</span>

                {/* Mini image */}
                <div className="mb-3 flex h-20 items-center justify-center overflow-hidden rounded-lg bg-[#1A1D2E]">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <span className="text-3xl opacity-30">{emoji}</span>
                  )}
                </div>

                {/* Category tag */}
                {p.category_name && (
                  <span className="mb-1 self-start rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#8B8FA3]">
                    {p.category_name}
                  </span>
                )}

                {/* Brand + Name */}
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FF6B5F]">{p.brand}</p>
                <h3 className="mt-0.5 text-xs font-bold leading-snug line-clamp-2 transition-colors group-hover:text-[#FF6B5F]" style={{ color: "var(--text)" }}>
                  {p.name}
                </h3>

                {/* Tagline */}
                <p className="mt-1.5 text-[10px] italic leading-tight line-clamp-2" style={{ color: "var(--text-muted)" }}>
                  &ldquo;{tagline}&rdquo;
                </p>

                {/* Score row */}
                <div className="mt-auto flex items-center gap-2 pt-3">
                  <ScoreRing score={score} size="sm" />
                  <span className="text-xs font-bold text-[#FF6B5F]">{score}/100</span>
                  <span className="ml-auto text-[10px] transition-transform group-hover:translate-x-1" style={{ color: "var(--text-muted)" }}>
                    Voir →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
