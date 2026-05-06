#!/usr/bin/env python3
"""Genere les 7 nouveaux guides Troviio - style humoristique renforce"""

import http.client, json, os, re, sys, http.client as httplib

DEEPSEEK_KEY = os.environ.get('DEEPSEEK_KEY', 'sk-6a6c69e0b17849a5b1618c9d71ccb0cc')

# Prompt avec instructions humoristiques fortes
GUIDE_PROMPT = """Tu rediges un guide d'achat humoristique pour Troviio, un comparateur qui ne prend pas les consommateurs pour des jambons.

STYLE OBLIGATOIRE :
- Ton : pote cynique mais bienveillant, qui balance des verites qui fachent
- Humour : references pop culture (films, series, memes), comparaisons absurdes mais justes
- Objectif : declarher un sourire AU MOINS 2 fois dans le guide
- Interdit : langage robotique, phrases generiques

Tu réponds en français. Structure ta réponse avec UNIQUEMENT ces sections, chaque section commence par "=== NOM_SECTION ===" :

=== INTRO ===
(4-5 phrases d'accroche. Humour tout de suite. Ex: "T'as craque pour un aspirateur qui parle a Alexa ? T'es soit un geek assume, soit quelqu'un qui veut impressionner son chat.")

=== TABLEAU_RAPIDE ===
(Reponse rapide si on a pas le temps de tout lire. 2-3 phrases utiles + 3 recommandations genereuses avec nom approximatif et prix. Precis mais pas de blagues ici.)

=== CRITERES ===
(3-4 paragraphes sur les criteres importants. Tone leger, pas technique barbant.)

=== VERDICT_1 ===
(Meilleur choix. Decris-le avec humour. Nom, marque, pourquoi. 3-4 phrases.)

=== VERDICT_2 ===
(Meilleur rapport qualite/prix. 3-4 phrases.)

=== VERDICT_3 ===
(Option premium ou petit budget. 3-4 phrases.)

=== PROFILS ===
(3 profils types avec recommandation, sous format texte.)

=== ERREURS ===
(3 erreurs a eviter - facon "arrete de faire le novice".)

=== FAQ ===
(5 questions au format Q: question|reponse. La reponse peut avoir de l'humour.)

Important : les noms de produits cites doivent etre des modeles qui existent vraiment. Tu cites des marques et modeles reels.
"""

def deepseek(prompt):
    conn = httplib.HTTPSConnection("api.deepseek.com")
    payload = json.dumps({
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": GUIDE_PROMPT},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.9,
        "max_tokens": 4000
    })
    conn.request("POST", "/v1/chat/completions", payload, {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + DEEPSEEK_KEY
    })
    data = json.loads(conn.getresponse().read().decode())
    return data["choices"][0]["message"]["content"]

def esc(s):
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${").replace("&", "&amp;").replace("'", "&apos;")

GUIDES = [
    ("machine-a-cafe", "espresso-pas-cher", "Machine a espresso pas chere : le guide pour boire bon sans se ruiner", "Tu veux un vrai espresso sans vendre un organe ? Les meilleures machines a espresso abordables."),
    ("friteuse-air", "sans-huile-grande-capacite", "Friteuse a air sans huile grande capacite : pour les vraies familles", "Friteuse a air 8L+ pour nourrir toute la tribu sans se prendre la tete avec l'huile."),
    ("aspirateur-robot", "connecte-alexa", "Robot aspirateur connecte Alexa : le guide du geek propre", "Commander son aspirateur a la voix en regardant Netflix ? Guide des robots compatibles Alexa et Google Home."),
    ("tv", "salon-tres-lumineux", "TV pour salon tres lumineux : le guide anti-reflets 2026", "Fenetres plein sud, reflets de m*rde ? Les TV avec traitement anti-reflet et luminosite de ouf."),
    ("cafe-grain", "bureau-entreprise", "Machine cafe grain pour bureau et entreprise : le guide pro 2026", "Une machine a cafe qui tient 40 cafés par jour sans faire grincer les dents des comptables."),
    ("robot-cuisine", "grand-famille-6-personnes", "Robot cuiseur pour grande famille (6 personnes et plus) : capacite max", "Thermomix trop petit pour ta tribu ? Les robots cuiseurs 5L+ qui nourrissent tout le monde."),
    ("robot-cuisine", "toutes-options-multifonction", "Robot cuiseur multifonction : le couteau suisse de la cuisine 2026", "Cuire, mixer, peser, mijoter, fermenter... Le robot qui fait tout sauf tes impots."),
]

for idx, (cat, slug, h1, meta_desc) in enumerate(GUIDES):
    print(f"\n=== [{idx+1}/{len(GUIDES)}] {cat}/{slug} ===")
    
    cat_display = cat.replace("-", " ").title()
    
    prompt = f"THEME : {h1}"
    print("  Appel DeepSeek...", end=" ")
    sys.stdout.flush()
    
    try:
        text = deepseek(prompt)
        print(f"{len(text)} chars")
    except Exception as e:
        print(f"ERREUR: {e}")
        continue
    
    # Parser les sections
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
    
    # Generer FAQ JSX
    faq_jsx = ""
    faq_text = sections.get("faq", "")
    for line in faq_text.split("\n"):
        line = line.strip()
        if line.startswith("Q:"):
            parts = line[2:].split("|")
            q = parts[0].strip() if parts else ""
            r = parts[1].strip() if len(parts) > 1 else ""
            if q:
                eq = esc(q)
                er = esc(r)
                faq_jsx += '<details className="p-5 group">\n'
                faq_jsx += '  <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">\n'
                faq_jsx += f'    <span>{eq}</span>\n'
                faq_jsx += '    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>\n'
                faq_jsx += '  </summary>\n'
                faq_jsx += f'  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">{er}</p>\n'
                faq_jsx += '</details>\n'
    
    intro = esc(sections.get("intro", ""))
    tableau = esc(sections.get("tableau_rapide", ""))
    criteres = esc(sections.get("criteres", ""))
    v1 = esc(sections.get("verdict_1", ""))
    v2 = esc(sections.get("verdict_2", ""))
    v3 = esc(sections.get("verdict_3", ""))
    profils = esc(sections.get("profils", ""))
    erreurs = esc(sections.get("erreurs", ""))
    
    # JSX template
    jsx = f'''import Link from "next/link";

export const dynamic = "force-dynamic";

export default function GuidePage() {{
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">

      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/c/{cat}" className="hover:text-white transition-colors">{cat_display}</Link>
            <span>/</span>
            <span className="text-white font-medium">{h1}</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">{h1}</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">{meta_desc}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {{/* Intro */}}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">{intro}</p>
        </div>

        {{/* Reponse rapide */}}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">R&eacute;ponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{tableau}</p>
          </div>
        </div>

        {{/* Criteres */}}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les crit&egrave;res importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{criteres}</p>
          </div>
        </div>

        {{/* Verdicts */}}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre s&eacute;lection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{v1}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{v2}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{v3}</p>
          </div>
        </div>

        {{/* Profils */}}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel mod&egrave;le selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{profils}</p>
          </div>
        </div>

        {{/* Erreurs */}}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs &agrave; &eacute;viter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">{erreurs}</p>
          </div>
        </div>

        {{/* FAQ */}}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions fr&eacute;quentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            {faq_jsx}
          </div>
        </div>

        {{/* Liens internes */}}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/{cat}" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits &rarr;</Link>
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Top 3 Troviio</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
          </div>
        </div>

      </section>

      {{/* Disclaimer */}}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiqu&eacute;s sont susceptibles de varier. Troviio participe au Programme d&apos;Associ&eacute;s d&apos;Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}}
'''
    
    dir_path = f"/root/troviio-ciceron/frontend/src/app/guide-longtail/{cat}/{slug}"
    os.makedirs(dir_path, exist_ok=True)
    filepath = f"{dir_path}/page.tsx"
    
    with open(filepath, "w") as f:
        f.write(jsx)
    
    print(f"  -> {filepath}")

print("\n=== GENERATION TERMINEE ===")
