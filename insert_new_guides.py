#!/usr/bin/env python3
import os, json, http.client

SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
SUPABASE_URL = "uukshxztoztkwxuuvqzc.supabase.co"

guides = [
    {
        "category_slug": "lave-vaisselle",
        "page_slug": "silencieux-cuisine-ouverte",
        "h1": "Lave-vaisselle silencieux pour cuisine ouverte : les meilleurs 2026",
        "meta_title": "Lave-vaisselle silencieux cuisine ouverte 2026 | Troviio",
        "meta_description": "Vous avez une cuisine ouverte sur le salon ? Le bruit du lave-vaisselle peut vite devenir gênant. Notre sélection des modèles les plus silencieux (40 dB) pour une cuisine sans nuisance sonore.",
        "intro_text": "Cuisine ouverte = salon + salle a manger + cuisine dans la meme piece. Concret : vous regardez Netflix pendant que le lave-vaisselle tourne. Et si vous entendez votre vaisselle plus que les dialogues, c'est qu'il est temps de changer. Les meilleurs lave-vaisselle 2026 descendent a 40 dB, soit le bruit d'une bibliotheque. Voici ceux qui nettoient en silence.",
        "faq_json": [
            {"question": "Quel niveau sonore pour une cuisine ouverte ?", "answer": "Visez 40-42 dB maximum. A 44 dB, le bruit est perceptible mais pas genant pour une conversation. Au-dela de 46 dB, vous devrez monter le volume de la TV. Les Miele et Bosch silence sont les references."},
            {"question": "Les lave-vaisselle silencieux sont-ils moins performants ?", "answer": "Non, le silence vient de l'isolation phonique et de la conception du moteur (moteur a induction), pas d'une puissance reduite. Un Miele 40 dB lave aussi bien qu'un entree de gamme de 48 dB."},
            {"question": "Quel prix pour un lave-vaisselle 40 dB ?", "answer": "Comptez 800-1200EUR pour un modele silencieux de qualite (Bosch Silence Plus, Miele G7000). Les moins chers descendent rarement sous 44 dB."},
            {"question": "Faut-il un lave-vaisselle avec moteur a induction ?", "answer": "Oui, les moteurs a induction (ou sans balais) sont plus silencieux, plus fiables et plus economes. C'est la norme sur tous les modeles recents."}
        ],
        "keywords": ["lave-vaisselle silencieux 40 dB", "lave-vaisselle cuisine ouverte", "lave-vaisselle pas bruyant", "lave-vaisselle silence salon"]
    },
    {
        "category_slug": "purificateur-air",
        "page_slug": "allergies-pollen-ete",
        "h1": "Purificateur d'air anti-allergies et pollen : le guide complet 2026",
        "meta_title": "Purificateur air allergies pollen 2026 - Guide Troviio",
        "meta_description": "Allergique au pollen ? Le purificateur d'air est votre allie. Notre selection des meilleurs modeles avec filtre HEPA H13/H14 pour les allergies saisonnieres et les acariens.",
        "intro_text": "Le printemps arrive. Les arbres fleurissent, les pres verdissent... et vous eternuez comme si vous aviez snife du poivre. Le pollen c'est beau de loin, moins de pres quand il colonise vos sinus. Un bon purificateur d'air peut reduire les symptomes de 50 a 80%. Mais pas n'importe lequel : il faut du HEPA H13 minimum et un CADR suffisant pour votre piece.",
        "faq_json": [
            {"question": "HEPA H13 ou H14 pour les allergies ?", "answer": "H13 filtre 99.95% des particules de 0.3 microns (pollen, acariens, moisissures). H14 monte a 99.995%. Pour les allergies saisonnieres, le H13 est parfait. Le H14 est reserve aux asthmatiques severes."},
            {"question": "Quel CADR pour une chambre de 20 m2 ?", "answer": "Un CADR d'au moins 200 m3/h pour une chambre de 20 m2. La regle : CADR = surface x 4 (hauteur sous plafond). Un CADR trop faible = filtration inefficace."},
            {"question": "Purificateur UV ou ozone : efficaces contre le pollen ?", "answer": "L'ozone est dangereux pour les poumons et interdit dans les purificateurs en Europe. Les UV tuent les bacteries mais n'arretent pas le pollen. Le seul vrai filtre anti-pollen c'est le HEPA."},
            {"question": "Faut-il un purificateur 24h/24 ?", "answer": "En periode de pollinisation, oui. Les modeles recents ont des capteurs qui ajustent automatiquement la puissance. En veille, un purificateur consomme 10-30W, soit quelques euros par mois."}
        ],
        "keywords": ["purificateur air allergies pollen", "purificateur air hepa allergies", "anti pollen purificateur", "purificateur air asthme acariens"]
    },
    {
        "category_slug": "montre-connectee",
        "page_slug": "meilleure-montre-sport",
        "h1": "Meilleure montre connectee pour le sport et la course a pied 2026",
        "meta_title": "Montre connectee sport running 2026 - Top Troviio",
        "meta_description": "Coureur debutant ou marathonien aguerri ? Notre guide des meilleures montres connectees pour le sport avec GPS, cardio precis, autonomie et resistance a l'eau.",
        "intro_text": "Votre smartphone dans la poche qui gigote a chaque foule, c'est fini. Une montre de sport, c'est le coach au poignet : GPS, cardio, suivi de sommeil, et meme la musique si vous avez oublie vos ecouteurs (non, ca n'existe pas). Mais entre Garmin, Apple Watch, Coros et Polar, difficile de s'y retrouver. On a trie pour vous.",
        "faq_json": [
            {"question": "Garmin ou Apple Watch pour le sport ?", "answer": "Garmin est le leader pour le running et le trail : GPS plus precis, autonomie 7-14 jours, fonctions avancees d'entrainement. L'Apple Watch Ultra est meilleure pour le quotidien + sport occasionnel. Pour un coureur regulier : Garmin."},
            {"question": "GPS double bande : est-ce utile ?", "answer": "Oui si vous courez en ville (entre les immeubles) ou en foret. Le GPS double bande (L1+L5) corrige les erreurs de signal. Sur un 10 km en ville, un GPS simple peut ajouter 200-300 metres."},
            {"question": "Cardio au poignet vs ceinture : quelle difference ?", "answer": "Le cardio optique au poignet a progresse (Garmin Elevate V5, Apple Watch) mais reste moins precis qu'une ceinture cardiaque (Polar H10). Pour un entrainement serieux, la ceinture est recommandee."},
            {"question": "Quelle autonomie pour une montre running ?", "answer": "8-14 heures en mode GPS pour les modeles d'entree de gamme Garmin (Forerunner 165). 20-30h pour les modeles milieu de gamme (Forerunner 265). Jusqu'a 60h pour les ultra (Fenix 8, Enduro 3)."}
        ],
        "keywords": ["montre connectee sport", "montre running GPS", "meilleure montre course a pied", "Garmin ou Apple Watch sport", "montre trail running"]
    },
    {
        "category_slug": "robot-cuisine",
        "page_slug": "multifonction-grande-famille",
        "h1": "Robot cuisine multifonction pour grande famille : lequel choisir en 2026 ?",
        "meta_title": "Robot cuisine grande famille 2026 - Guide Troviio",
        "meta_description": "Vous cuisinez pour 5 personnes et plus ? Notre guide des robots cuiseurs multifonctions avec grande capacite (5L+), puissance suffisante et accessoires pour les familles nombreuses.",
        "intro_text": "Cuisiner pour une famille de 5+ personnes, c'est comme faire la cantine tous les jours. Les portions doivent et genereuses, les plats varies, et personne ne veut passer 2 heures en cuisine le soir. Un robot cuiseur multifonction peut tout changer : il coupe, petrit, mijote, cuit a la vapeur et pese les ingredients. Pour les grandes tables, la capacite et la puissance sont les vrais criteres.",
        "faq_json": [
            {"question": "Quelle capacite pour une famille de 5+ personnes ?", "answer": "Visez un bol de 4 a 6 litres minimum. Le Thermomix TM7 (4.5L) peut cuire pour 4 personnes. Pour 5-6, preferez le Magimix Cook Expert XL (5.2L) ou le Monsieur Cuisine Smart (6L)."},
            {"question": "Robot cuiseur ou robot patissier pour une famille ?", "answer": "Les deux sont utiles. Le cuiseur (Thermomix, Magimix) prepare les repas du quotidien. Le patissier (KitchenAid, Kenwood) est meilleur pour les gateaux et le pain. La solution : un cuiseur + un patissier si le budget le permet."},
            {"question": "Quelle puissance pour cuisiner en grande quantite ?", "answer": "1200-1500W minimum pour petrir 1 kg de pain sans forcer. Les modeles comme le Kenwood Cooking Chef (1500W) ou le Magimix (1500W) sont parfaits pour les grosses preparations."},
            {"question": "Connecte ou pas : utile pour une famille ?", "answer": "Oui, les recettes guidees sont un gain de temps enorme. Le Thermomix TM7 et le Monsieur Cuisine Smart proposent des recettes etape par etape qui s'adaptent au nombre de personnes."}
        ],
        "keywords": ["robot cuisine grande famille", "robot cuiseur 5 personnes", "robot multifonction famille nombreuse", "robot cuisine 6 litres", "robot cuiseur familial"]
    },
]

conn = http.client.HTTPSConnection(SUPABASE_URL)
headers = {
    'apikey': SERVICE_KEY,
    'Authorization': f'Bearer {SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
}

for g in guides:
    body = json.dumps(g)
    conn.request('POST', '/rest/v1/seo_pages', body=body, headers=headers)
    res = conn.getresponse()
    status = res.status
    body_out = res.read().decode()[:100]
    key = f"{g['category_slug']}/{g['page_slug']}"
    if status in (200, 201):
        print(f"OK  {key}")
    else:
        print(f"ERR {status} {key} -> {body_out}")

print("Done.")
