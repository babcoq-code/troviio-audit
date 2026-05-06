#!/usr/bin/env python3
"""Genere les pages duels X vs Y et pages /tops pour Troviio"""

import http.client as httplib, json, os, re, sys

DEEPSEEK_KEY = os.environ.get('DEEPSEEK_KEY', 'sk-6a6c69e0b17849a5b1618c9d71ccb0cc')

DUEL_PROMPT = """Tu rediges une page de duel comparatif pour Troviio, un comparateur qui ne prend pas les consommateurs pour des jambons.

THEME : {theme}

STYLE OBLIGATOIRE (encore plus que d'habitude) :
- Ton : pote un peu cynique, style "bon alors, on tranche ce duel comme du jambon"
- Humour : references pop culture (Matrix, Star Wars, Marvel, Kaamelott, OSS 117, The Office, etc.)
- Declenche un sourire au moins 3 fois dans le texte
- Interdit : langage robotique, phrases generiques, "d'autre part", "en revanche"

Tu réponds en français. Structure ta réponse avec UNIQUEMENT ces sections :

=== INTRO ===
(3-4 phrases. Punchy. Ex: "C'est le combat du siècle : d'un cote le Jedi de la performance, de l'autre le Sith du rapport qualite-prix. Deux aspirateurs entrent, un seul sort.")

=== TABLEAU ===
(Comparatif rapide en texte. 4-5 criteres importants + qui gagne sur chaque critere.)

=== PRODUIT_1 ===
(Nom du 1er produit. Pourquoi il dechire. Pourquoi il peut etre chiant. 4-5 phrases avec humour.)

=== PRODUIT_2 ===
(Nom du 2e produit. Meme structure.)

=== VERDICT ===
(Qui gagne et pourquoi. Avec une metaphore pop culture. Ex: "Le Dreame X50, c'est Neo dans Matrix : il voit tout, il anticipe tout. Mais le Roborock, c'est Morpheus : il te propose la pillule rouge du rapport qualite-prix.")

=== POUR_QUI_1 ===
(2 profils pour qui le produit 1 est le meilleur choix)

=== POUR_QUI_2 ===
(2 profils pour qui le produit 2 est le meilleur choix)
"""

TOP_PROMPT = """Tu rediges une page TOP 3 pour Troviio, pour la categorie {categorie}.

STYLE OBLIGATOIRE :
- Introduction punchy, drole, pop culture
- Chaque produit a un "Pourquoi lui ?" drole et pertinent
- Un paragraphe "Le grand perdant" (le modele qu'on attendait mais qui decoit)
- Le verdict final : LE meilleur choix absolu

Structure :
=== INTRO ===
(4-5 phrases droles sur la categorie)

=== PRODUIT_1 ===
(Nom du #1. Pourquoi lui et pas les autres. Avec humour.)

=== PRODUIT_2 ===
(Nom du #2. Ses forces, ses faiblesses.)

=== PRODUIT_3 ===
(Nom du #3. Pour qui il est fait.)

=== LE_GRAND_PERDANT ===
(Un modele connu mais qui merite pas sa place dans le top)

=== VERDICT ===
(Le mot de la fin. La recommendation ultime. Avec une reference pop culture.)

Infos produits :
{products_info}
"""

def deepseek(prompt, sys_prompt, temp=0.85):
    conn = httplib.HTTPSConnection("api.deepseek.com")
    payload = json.dumps({
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": temp,
        "max_tokens": 3500
    })
    conn.request("POST", "/v1/chat/completions", payload, {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + DEEPSEEK_KEY
    })
    data = json.loads(conn.getresponse().read().decode())
    return data["choices"][0]["message"]["content"]

def esc(s):
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${").replace("&", "&amp;").replace("'", "&apos;")

def gen_duel_page(title, h1, meta_desc, slug, p1_name, p2_name, theme):
    print(f"  Duel: {p1_name} vs {p2_name}...", end=" ", flush=True)
    
    prompt = DUEL_PROMPT.format(theme=theme)
    text = deepseek(prompt, "Tu rediges des pages de duel comparatif humoristiques en francais pour Troviio. Style sarcastique, pop culture, punchlines. Format sections === NOM ===", 0.9)
    
    sections = {}
    current = None
    for line in text.split("\n"):
        s = line.strip()
        m = re.match(r'^===?\s*(.+?)\s*===?$', s)
        if m:
            current = m.group(1).lower().strip()
            sections[current] = []
        elif current:
            sections[current].append(line)
    
    for k in sections:
        sections[k] = "\n".join(sections[k]).strip()
    
    intro = esc(sections.get("intro", ""))
    tableau = esc(sections.get("tableau", ""))
    p1 = esc(sections.get("produit_1", ""))
    p2 = esc(sections.get("produit_2", ""))
    verdict = esc(sections.get("verdict", ""))
    pour1 = esc(sections.get("pour_qui_1", ""))
    pour2 = esc(sections.get("pour_qui_2", ""))
    
    jsx = f'''import Link from "next/link";
import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: "{h1} | Troviio",
  description: "{meta_desc}",
  alternates: {{ canonical: "https://www.troviio.com/duel/{slug}" }},
}};

export default function DuelPage() {{
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white font-medium">Duel : {title}</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">{h1}</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">{meta_desc}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">{intro}</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{tableau}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥇 Produit #1</p>
            <h3 className="text-xl font-bold mb-4">{p1_name}</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{p1}</p>
          </div>
          <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">🥈 Produit #2</p>
            <h3 className="text-xl font-bold mb-4">{p2_name}</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{p2}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">🏆 Verdict Troviio</p>
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">{verdict}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">🎯 {p1_name} est fait pour toi si...</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{pour1}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <h3 className="text-lg font-bold mb-4">🎯 {p2_name} est fait pour toi si...</h3>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{pour2}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir les TOP 3 &rarr;</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
          </div>
        </div>
      </section>
    </main>
  );
}}
'''
    return jsx

def gen_top_page(title, h1, meta_desc, slug, categorie, products_info_text):
    print(f"  Top: {title}...", end=" ", flush=True)
    
    prompt = TOP_PROMPT.format(categorie=categorie, products_info=products_info_text)
    text = deepseek(prompt, "Tu rediges des pages TOP 3 humoristiques en francais pour Troviio. Style sarcastique, pop culture, punchlines. Sections === NOM ===", 0.9)
    
    sections = {}
    current = None
    for line in text.split("\n"):
        s = line.strip()
        m = re.match(r'^===?\s*(.+?)\s*===?$', s)
        if m:
            current = m.group(1).lower().strip()
            sections[current] = []
        elif current:
            sections[current].append(line)
    
    for k in sections:
        sections[k] = "\n".join(sections[k]).strip()
    
    intro_text = esc(sections.get("intro", ""))
    p1_text = esc(sections.get("produit_1", ""))
    p2_text = esc(sections.get("produit_2", ""))
    p3_text = esc(sections.get("produit_3", ""))
    perdant = esc(sections.get("le_grand_perdant", ""))
    verdict_text = esc(sections.get("verdict", ""))
    
    jsx = f'''import Link from "next/link";
import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: "{h1} | Troviio",
  description: "{meta_desc}",
  alternates: {{ canonical: "https://www.troviio.com/tops/{slug}" }},
}};

export default function TopsPage() {{
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white font-medium">Top 3 : {title}</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">🏆 Top 3 Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">{h1}</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">{meta_desc}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">{intro_text}</p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#3ED6A3]">🥇 Numéro 1</p>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{p1_text}</p>
          </div>
          <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥈 Numéro 2</p>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{p2_text}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#8B8FA3]">🥉 Numéro 3</p>
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{p3_text}</p>
          </div>
        </div>

        {perdant and f'''
        <div className="rounded-2xl border border-[#FF6B5F]/30 bg-[#2E1A1A] p-6 mb-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#FF6B5F]">💀 Le grand perdant</p>
          <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{perdant}</p>
        </div>
        ''' or ''}

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6 mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B5F] mb-2">🔥 Le mot de Troviio</p>
          <p className="text-base leading-7 text-[#C9CCDA] whitespace-pre-line">{verdict_text}</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Autres comparatifs</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
            <Link href="/" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Accueil Troviio</Link>
          </div>
        </div>
      </section>
    </main>
  );
}}
'''
    return jsx


# ─── DUELS ───────────────────────────────────────────────────────
DUELS = [
    ("aspirateur-robot", "dreame-x50-ultra-vs-roborock-qrevo-curv-2-pro",
     "Dreame X50 Ultra vs Roborock Qrevo Curv 2 Pro : le duel des aspirateurs robots 2026",
     "Qui est le boss des aspirateurs robots en 2026 ? Le Dreame X50 Ultra affronte le Roborock Qrevo Curv 2 Pro dans un duel sans merci.",
     "Dreame X50 Ultra vs Roborock Qrevo Curv 2 Pro",
     "Dreame X50 Ultra Complete", "Roborock Qrevo Curv 2 Pro",
     "Deux monstres de l'aspiration : le Dreame X50 contre le Roborock Qrevo Curv 2. Lequel nettoyeur de genoux meritait ton salon ?"),

    ("casque-audio", "sony-wh-1000xm6-vs-bose-qc-ultra",
     "Sony WH-1000XM6 vs Bose QC Ultra : le duel des casques audio 2026",
     "Sony ou Bose ? Le combat des titans du casque audio sans fil reprend en 2026.",
     "Sony WH-1000XM6 vs Bose QuietComfort Ultra",
     "Sony WH-1000XM6", "Bose QuietComfort Ultra Headphones",
     "Le casque Sony contre le Bose. Un duel qui divise les audiophiles depuis des annees. 2026 tranche."),

    ("tv", "lg-g6-oled-vs-samsung-s95h-qd-oled",
     "LG G6 OLED vs Samsung S95H QD-OLED : quelle TV 2026 est la meilleure ?",
     "La TV OLED 2026 la plus chere et la plus impressionnante. LG G6 ou Samsung S95H ? Verdict.",
     "LG G6 OLED vs Samsung S95H QD-OLED",
     "LG G6 OLED 65\"", "Samsung S95H 65\" QD-OLED",
     "Les deux TVs les plus chere de 2026 s'affrontent. LG ou Samsung ? Le match des geants."),

    ("machine-a-cafe", "jura-e8-vs-sage-barista-express",
     "Jura E8 vs Sage Barista Express : la machine à café qui va changer vos matins",
     "Machine automatique ou manuelle ? Jura E8 ou Sage Barista Express ? Quel type de buveur de cafe es-tu ?",
     "Jura E8 vs Sage Barista Express",
     "Jura E8 Piano Black", "Sage Barista Express Impress BES876",
     "Le duel des machines a cafe premium : Jura la suisse automatique contre Sage la barista pour passionnes."),

    ("friteuse-air", "ninja-foodi-flexdrawer-vs-cosori-turboblaze",
     "Ninja Foodi FlexDrawer vs Cosori TurboBlaze : la meilleure friteuse à air 2026",
     "Friteuse a air : la Ninja FlexDrawer ou la Cosori TurboBlaze ? Le duel des friteuses les plus populaires.",
     "Ninja Foodi FlexDrawer vs Cosori TurboBlaze",
     "Ninja Foodi FlexDrawer AF500EU", "Cosori TurboBlaze 6L",
     "Ninja ou Cosori ? Les deux marques les plus populaires de friteuses a air s'affrontent."),

    ("aspirateur-balai", "dyson-gen5-vs-samsung-bespoke-jet",
     "Dyson Gen5 Detect vs Samsung Bespoke Jet : l'aspirateur balai ultime 2026",
     "Dyson ou Samsung ? Le duel des aspirateurs balais haut de gamme en 2026.",
     "Dyson Gen5 Detect vs Samsung Bespoke Jet",
     "Dyson Gen5 Detect Absolute", "Samsung Bespoke AI Jet Ultra VS90F40EEK",
     "Dyson contre Samsung. Le match des aspirateurs balais les plus avances du marche."),
]

print("=== GENERATION DUELS ===")
for cat, slug, title, meta_desc, h1, p1, p2, theme in DUELS:
    dir_path = f"/root/troviio-ciceron/frontend/src/app/duel/{slug}"
    os.makedirs(dir_path, exist_ok=True)
    filepath = f"{dir_path}/page.tsx"
    
    try:
        jsx = gen_duel_page(title, h1, meta_desc, slug, p1, p2, theme)
        with open(filepath, "w") as f:
            f.write(jsx)
        print(f"OK -> {filepath}")
    except Exception as e:
        print(f"ERREUR: {e}")

print("\n=== GENERATION TOPS ===")
# On va chercher les produits via Supabase pour les injecter dans le prompt

# Les données produits par catégorie (top 5)
CAT_PRODUCTS = {
    "aspirateur-robot": """1. Dreame X50 Ultra Complete - 96/100 - 426€ - Le roi de la performance
2. Roborock Qrevo Curv 2 Pro - 94/100 - 499€ - Le champion du rapport qualite-prix
3. Roborock S8 MaxV Ultra - 93/100 - 1299€ - Le premium qui en veut pour son argent
4. Dreame L40 Ultra - 90/100 - 346€ - Le petit budget qui cartonne
5. Eufy X10 Pro Omni - 88/100 - 418€ - Le choix malin""",

    "casque-audio": """1. Sony WH-1000XM6 - 94/100 - 379€ - Le maitre de l'annulation de bruit
2. Bose QuietComfort Ultra - 92/100 - 429€ - Le confort absolu
3. Sennheiser Momentum 4 Wireless - 91/100 - 349€ - Le son audiophile
4. Apple AirPods Pro 2 - 91/100 - 249€ - Le roi de l'ecosysteme
5. Bowers & Wilkins Px7 S2e - 88/100 - 299€ - Le chic british""",

    "tv": """1. LG G6 OLED 65" - 95/100 - 3599€ - Le roi de l'image
2. Samsung S95H QD-OLED 65" - 94/100 - 3599€ - La luminosite extreme
3. LG C6 OLED 65" - 93/100 - 2699€ - Le meilleur rapport qualite-prix
4. Sony Bravia 8 OLED 65" - 90/100 - 2799€ - Le traitement d'image Sony
5. Philips OLED+959 65" - 89/100 - 3299€ - L'ambiance lumineuse""",

    "machine-a-cafe": """1. Jura E8 Piano Black - 92/100 - 1499€ - L'aristocrate suisse
2. Technivorm Moccamaster KBG Select - 91/100 - 190€ - La reference filtrees
3. Sage Barista Express Impress BES876 - 90/100 - 799€ - La barista a la maison
4. Delonghi Magnifica S - 88/100 - 399€ - Le meilleur rapport qualite-prix
5. Philips Series 5400 - 87/100 - 599€ - Le tout-en-un malin""",

    "robot-cuisine": """1. Vorwerk Thermomix TM7 - 96/100 - 1599€ - Le roi inconteste
2. KitchenAid Artisan 5KSM175 - 91/100 - 499€ - Le classique indepassable
3. Magimix Cook Expert XL - 88/100 - 1299€ - Le challenger francais
4. Moulinex i-Companion Touch XL - 86/100 - 699€ - Le polyvalent
5. Kenwood Cooking Chef Gourmet - 82/100 - 99€ - L'alternative""",

    "friteuse-air": """1. Ninja Foodi FlexDrawer AF500EU - 94/100 - 249€ - La championne
2. Ninja Air Fryer Max AF160EU - 91/100 - 173€ - La classique
3. Cosori TurboBlaze 6L - 89/100 - 166€ - Le meilleur rapport qualite-prix
4. Philips Essential Airfryer XL - 87/100 - 99€ - L'entree de gamme fiable
5. Moulinex Easy Fry Max - 84/100 - 79€ - Le budget""",

    "aspirateur-balai": """1. Dyson Gen5 Detect Absolute - 96/100 - 166€ - Le leader
2. Samsung Bespoke AI Jet Ultra - 93/100 - 196€ - L'innovation coreenne
3. Dyson V15 Detect Absolute - 91/100 - 792€ - L'ancien roi
4. Philips Aqua 8000 Series - 87/100 - 299€ - Le 2-en-1
5. Bosch Unlimited 7 - 85/100 - 249€ - L'allemand solide""",
}

TOPS = [
    ("aspirateur-robot", "meilleur-aspirateur-robot",
     "Meilleur aspirateur robot 2026 : le top 3 definitif",
     "Le classement des 3 meilleurs aspirateurs robots de 2026 teste et approuve par Troviio."),

    ("casque-audio", "meilleur-casque-audio",
     "Meilleur casque audio 2026 : le top 3 qui va changer vos oreilles",
     "Casque sans fil, annulation de bruit, confort : notre top 3 des meilleurs casques audio de 2026."),

    ("tv", "meilleure-tv",
     "Meilleure TV 2026 : le top 3 des televisions qui changent tout",
     "OLED, QD-OLED, Mini-LED : notre selection des 3 meilleures TVs pour le salon en 2026."),

    ("machine-a-cafe", "meilleure-machine-a-cafe",
     "Meilleure machine a cafe 2026 : le top 3 pour bien commencer la journee",
     "Grain, dosettes, filtre : notre selection des meilleures machines a cafe pour 2026."),

    ("robot-cuisine", "meilleur-robot-cuisine",
     "Meilleur robot cuiseur 2026 : le top 3 qui cuisine a votre place",
     "Thermomix ou pas ? Notre top 3 des robots cuiseurs multifonction les plus performants."),

    ("friteuse-air", "meilleure-friteuse-air",
     "Meilleure friteuse a air 2026 : le top 3 pour manger sain sans se prendre la tete",
     "Friteuse a air : notre selection des 3 meilleures pour une cuisine saine et croustillante."),

    ("aspirateur-balai", "meilleur-aspirateur-balai",
     "Meilleur aspirateur balai 2026 : le top 3 qui aspire tout sur son passage",
     "Aspirateur balai sans fil : notre top 3 des meilleurs pour un sol impeccable en 2026."),
]

for cat, slug, title, meta_desc in TOPS:
    dir_path = f"/root/troviio-ciceron/frontend/src/app/tops/{slug}"
    os.makedirs(dir_path, exist_ok=True)
    filepath = f"{dir_path}/page.tsx"
    
    products_info = CAT_PRODUCTS.get(cat, "")
    
    try:
        jsx = gen_top_page(title, title, meta_desc, slug, cat.replace("-", " "), products_info)
        with open(filepath, "w") as f:
            f.write(jsx)
        print(f"OK -> {filepath}")
    except Exception as e:
        print(f"ERREUR: {e}")

print("\n=== GENERATION TERMINEE ===")
