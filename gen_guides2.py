#!/usr/bin/env python3
"""Genere les guides Troviio - version robuste"""

import http.client, json, os, re, sys

DEEPSEEK_KEY = os.environ.get('DEEPSEEK_KEY', 'sk-6a6c69e0b17849a5b1618c9d71ccb0cc')

with open('/root/troviio-ciceron/prompt_template.txt', 'r') as f:
    PROMPT_TEMPLATE = f.read()

def deepseek(prompt):
    conn = http.client.HTTPSConnection("api.deepseek.com")
    payload = json.dumps({
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "Tu rediges des guides d'achat humoristiques en francais pour Troviio. Style : sarcastique, pop culture, punchlines."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.85,
        "max_tokens": 3500
    })
    conn.request("POST", "/v1/chat/completions", payload, {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + DEEPSEEK_KEY
    })
    data = json.loads(conn.getresponse().read().decode())
    return data["choices"][0]["message"]["content"]

def esc(s):
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

GUIDES = [
    # aspirateur-robot
    ("aspirateur-robot", "maison-etage", "Robot aspirateur pour maison a etage : les meilleurs modeles 2026", "Quel robot aspirateur pour une maison avec escaliers et plusieurs niveaux ?"),
    ("aspirateur-robot", "parquet-fragile", "Robot aspirateur pour parquet fragile : les modeles qui rayent pas", "Parquet qui se raye au moindre choc ? Decouvrez les robots avec roues caoutchouc et brosses douces."),
    ("aspirateur-robot", "silencieux-appartement", "Robot aspirateur silencieux pour appartement 2026", "Voisins, bebe, teletravail : les modeles les plus silencieux pour nettoyer sans deranger."),
    # tv
    ("tv", "65-pouces-recul-3m", "TV OLED 65 pouces pour recul de 3 metres : le guide 2026", "3 metres entre le canape et la TV ? La taille ideale c'est 65 pouces."),
    ("tv", "sport-foot-2026", "TV OLED pour le sport et la coupe du monde 2026", "Voir le ballon filer sans flou ? Guide des meilleures TV sport : OLED 120Hz."),
    ("tv", "gaming-120hz-pas-cher-ps5", "TV OLED 120Hz pas chere pour PS5 et Xbox : guide budget 2026", "120Hz sur PS5 sans vendre un rein ? TV OLED 120Hz les moins cheres."),
    # machine a cafe
    ("machine-a-cafe", "debutant", "Machine a cafe grain pour debutant : laquelle choisir en 2026 ?", "Premiere machine expresso broyeur ? Les plus simples pour se lancer sans stress."),
    ("machine-a-cafe", "silencieuse", "Machine a cafe grain silencieuse pour la maison et le bureau", "Marre du bruit de broyeur qui reveille tout le monde ? Machines a cafe les plus silencieuses."),
    ("machine-a-cafe", "moins-400e", "Machine a cafe grain a moins de 400 euros : meilleur rapport qualite-prix", "Expresso broyeur pour moins de 400 euros, c'est possible. Selection des meilleurs."),
    # friteuse air
    ("friteuse-air", "famille-4-personnes", "Friteuse a air pour famille de 4 personnes : quel modele choisir ?", "Vous etes 4 a la maison ? Les meilleures friteuses a air de 6L et plus."),
    ("friteuse-air", "studio-etudiant", "Friteuse a air pour etudiant ou studio : petit budget, petit espace", "Studio 20m2, budget serre ? Friteuses a air compactes 3-4L pour manger sain."),
    # purificateur air
    ("purificateur-air", "allergie-pollen-ete", "Purificateur d'air anti-allergie et pollen : lequel choisir pour l'ete 2026 ?", "Allergies saisonnieres ? Le bon purificateur peut changer vos etes."),
    ("purificateur-air", "chambre-bebe", "Purificateur d'air pour chambre de bebe : le guide essentiel", "L'air que respire votre bebe est crucial. Purificateurs silencieux sans ozone."),
]

print("Total guides: " + str(len(GUIDES)))

for idx, (cat, slug, h1, meta_desc) in enumerate(GUIDES):
    print("\n=== [" + str(idx+1) + "/" + str(len(GUIDES)) + "] " + cat + "/" + slug + " ===")
    
    cat_name = cat.replace("machine-a-cafe", "Machine a cafe").replace("friteuse-air", "Friteuse a air").replace("purificateur-air", "Purificateur d'air").replace("tv", "TV")
    cat_name = " ".join(w.capitalize() for w in cat_name.split())
    
    # DeepSeek
    prompt = PROMPT_TEMPLATE.replace("THEME_PLACEHOLDER", h1)
    print("  Appel DeepSeek...", end=" ")
    sys.stdout.flush()
    
    try:
        text = deepseek(prompt)
        print(str(len(text)) + " chars")
    except Exception as e:
        print("ERREUR: " + str(e))
        continue
    
    # Sections
    sections = {}
    current = None
    for line in text.split("\n"):
        s = line.strip()
        if s.startswith("=== ") and s.endswith(" ==="):
            current = s[4:-4].strip().lower()
            sections[current] = []
        elif current:
            sections[current].append(line)
    
    for k in sections:
        sections[k] = "\n".join(sections[k]).strip()
    
    # Extraire FAQ
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
                faq_jsx += '    <span>' + eq + '</span>\n'
                faq_jsx += '    <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>\n'
                faq_jsx += '  </summary>\n'
                faq_jsx += '  <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">' + er + '</p>\n'
                faq_jsx += '</details>\n'
    
    intro = esc(sections.get("intro", ""))
    tableau = esc(sections.get("tableau_rapide", ""))
    criteres = esc(sections.get("criteres", ""))
    v1 = esc(sections.get("verdict_1", ""))
    v2 = esc(sections.get("verdict_2", ""))
    v3 = esc(sections.get("verdict_3", ""))
    profils = esc(sections.get("profils", ""))
    erreurs = esc(sections.get("erreurs", ""))
    
    # JSX complet - on ecrit directement
    jsx = '''import Link from "next/link";

export const dynamic = "force-dynamic";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">

      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/c/''' + cat + '''" className="hover:text-white transition-colors">''' + cat_name + '''</Link>
            <span>/</span>
            <span className="text-white font-medium">''' + h1 + '''</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">''' + h1 + '''</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">''' + meta_desc + '''</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">''' + intro + '''</p>
        </div>

        {/* Reponse rapide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Reponse rapide</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">''' + tableau + '''</p>
          </div>
        </div>

        {/* Criteres */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les criteres importants</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">''' + criteres + '''</p>
          </div>
        </div>

        {/* Verdicts */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Notre selection</h2>
        <div className="space-y-6 mb-12">
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">''' + v1 + '''</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">''' + v2 + '''</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">''' + v3 + '''</p>
          </div>
        </div>

        {/* Profils */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Quel modele selon votre profil</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">''' + profils + '''</p>
          </div>
        </div>

        {/* Erreurs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les erreurs a eviter</h2>
          <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
            <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">''' + erreurs + '''</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Questions frequentes</h2>
          <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
            ''' + faq_jsx + '''
          </div>
        </div>

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/''' + cat + '''" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Voir tous les produits →</Link>
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Top 3 Troviio</Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">Tout le catalogue</Link>
          </div>
        </div>

      </section>

      {/* Disclaimer */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs leading-6 text-[#6B6B7A]">* Les prix indiques sont susceptibles de varier. Troviio participe au Programme d&apos;Associes d&apos;Amazon EU...</p>
        </div>
      </section>

    </main>
  );
}
'''
    
    dir_path = "/root/troviio-ciceron/frontend/src/app/guide-longtail/" + cat + "/" + slug
    os.makedirs(dir_path, exist_ok=True)
    filepath = dir_path + "/page.tsx"
    
    with open(filepath, "w") as f:
        f.write(jsx)
    
    print("  -> " + filepath)

print("\n=== GENERATION TERMINEE ===")
