#!/usr/bin/env python3
"""Génère des guides statiques Troviio (pages Next.js TSX) avec contenu unique + sélection produits adaptée."""

import http.client
import json
import re
import os

DEEPSEEK_KEY = "sk-6a6c69e0b17849a5b1618c9d71ccb0cc"

GUIDES_BY_SLUG = {
    "aspirateur-robot": [
        {
            "page_slug": "maison-etage",
            "h1": "Robot aspirateur pour maison à étage : les meilleurs modèles 2026",
            "meta_title": "Robot aspirateur pour maison à étage 2026 - Sélection Troviio",
            "meta_desc": "Quel robot aspirateur pour une maison avec escaliers et plusieurs niveaux ? Sélection des modèles avec cartographie multi-étages."
        },
        {
            "page_slug": "parquet-fragile",
            "h1": "Robot aspirateur pour parquet fragile : les modèles qui rayent pas",
            "meta_title": "Robot aspirateur pour parquet fragile 2026 - Guide Troviio",
            "meta_desc": "Parquet qui se raye au moindre choc ? Découvrez les robots avec roues caoutchouc, brosses douces et capteurs de pression."
        },
        {
            "page_slug": "silencieux-appartement",
            "h1": "Robot aspirateur silencieux pour appartement 2026",
            "meta_title": "Robot aspirateur silencieux pour appartement - Top 2026 | Troviio",
            "meta_desc": "Voisins, bébé, télétravail : les modèles les plus silencieux (sous 65 dB) pour nettoyer sans déranger."
        },
    ],
    "tv": [
        {
            "page_slug": "65-pouces-recul-3m",
            "h1": "TV OLED 65 pouces pour recul de 3 mètres : le guide 2026",
            "meta_title": "TV 65 pouces recul 3 mètres - Guide d'achat 2026 | Troviio",
            "meta_desc": "3 mètres entre le canapé et la TV ? La taille idéale c'est 65 pouces. Sélection des meilleurs OLED pour cette distance."
        },
        {
            "page_slug": "sport-foot-2026",
            "h1": "TV OLED pour le sport et la coupe du monde 2026",
            "meta_title": "Meilleure TV pour le sport 2026 - Foot, F1, Rugby | Troviio",
            "meta_desc": "Vous voulez voir le ballon filer sans flou ? Guide des meilleures TV sport : OLED 120Hz, temps de réponse, compensation de mouvement."
        },
        {
            "page_slug": "gaming-120hz-pas-cher-ps5",
            "h1": "TV OLED 120Hz pas chère pour PS5 et Xbox : le guide budget 2026",
            "meta_title": "TV OLED 120Hz pas cher pour PS5/Xbox 2026 | Troviio",
            "meta_desc": "120Hz sur PS5 sans vendre un rein ? Sélection des TV OLED 120Hz les moins chères avec HDMI 2.1 et VRR."
        },
    ],
    "machine-a-cafe": [
        {
            "page_slug": "debutant",
            "h1": "Machine à café grain pour débutant : laquelle choisir en 2026 ?",
            "meta_title": "Machine à café grain débutant 2026 - Guide Troviio",
            "meta_desc": "Première machine expresso broyeur ? Notre sélection des modèles les plus simples d'utilisation pour se lancer sans se prendre la tête."
        },
        {
            "page_slug": "silencieuse",
            "h1": "Machine à café grain silencieuse pour bureau et早起",
            "meta_title": "Machine à café silencieuse 2026 - Top modèles discrets | Troviio",
            "meta_desc": "Vous en avez marre du bruit de broyeur qui réveille tout le monde ? Découvrez les machines à café les plus silencieuses du marché."
        },
        {
            "page_slug": "moins-400e",
            "h1": "Machine à café grain à moins de 400€ : le meilleur rapport qualité-prix 2026",
            "meta_title": "Machine à café grain moins de 400€ - Top 2026 | Troviio",
            "meta_desc": "Un bon expresso broyeur pour moins de 400€ c'est possible. Notre sélection des meilleurs rapports qualité-prix pour un café fraîchement moulu sans se ruiner."
        },
    ],
    "friteuse-air": [
        {
            "page_slug": "famille-4-personnes",
            "h1": "Friteuse à air pour famille de 4 personnes : quel modèle choisir ?",
            "meta_title": "Friteuse à air pour famille 4 personnes - Guide 2026 | Troviio",
            "meta_desc": "Vous êtes 4 à la maison et votre friteuse actuelle est trop petite ? Notre sélection des air fryer de 6L+ pour toute la famille."
        },
        {
            "page_slug": "studio-etudiant",
            "h1": "Friteuse à air pour étudiant ou studio : petit budget, petit espace",
            "meta_title": "Friteuse à air étudiante petit budget - Guide 2026 | Troviio",
            "meta_desc": "Studio de 20m², budget serré ? Les meilleures friteuses à air compactes (3-4L) pour manger sain sans envahir ta cuisine."
        },
        {
            "page_slug": "double-compartiment",
            "h1": "Friteuse à air double compartiment : utile ou gadget ? Notre avis 2026",
            "meta_title": "Friteuse double compartiment utile ou gadget ? Avis Troviio 2026",
            "meta_desc": "Deux paniers pour cuire des aliments différents en même temps : vraie révolution ou simple argument marketing ? On a testé."
        },
    ],
    "purificateur-air": [
        {
            "page_slug": "allergie-pollen-ete",
            "h1": "Purificateur d'air anti-allergie et pollen été 2026 : lequel choisir ?",
            "meta_title": "Purificateur d'air anti-pollen été 2026 - Guide Troviio",
            "meta_desc": "Allergies saisonnières ? Le bon purificateur d'air peut changer vos étés. Notre sélection avec filtre HEPA, CADR et capture des pollens."
        },
        {
            "page_slug": "chambre-bebe",
            "h1": "Purificateur d'air pour chambre de bébé : le guide essentiel",
            "meta_title": "Purificateur d'air chambre bébé 2026 - Guide Troviio",
            "meta_desc": "L'air que respire votre bébé est crucial. Découvrez les purificateurs silencieux, sans ozone, avec filtres HEPA adaptés aux chambres d'enfant."
        },
        {
            "page_slug": "silencieux-chambre",
            "h1": "Purificateur d'air silencieux pour chambre : dormez mieux en 2026",
            "meta_title": "Purificateur d'air silencieux chambre - Top 2026 | Troviio",
            "meta_desc": "Un purificateur d'air qui fait du bruit en dormant ? Pas question. Notre sélection des modèles les plus silencieux (< 30 dB) pour la chambre."
        },
    ],
    "velo-electrique": [
        {
            "page_slug": "ville-autonomie-100km",
            "h1": "Vélo électrique ville avec 100km d'autonomie : les meilleurs VAE 2026",
            "meta_title": "VAE 100km autonomie ville - Top 2026 | Troviio",
            "meta_desc": "Peur de tomber en panne ? Découvrez les vélos électriques avec plus de 100km d'autonomie réelle pour vos trajets urbains quotidiens."
        },
    ],
}

def get_category_id(slug):
    conn = http.client.HTTPSConnection("uukshxztoztkwxuuvqzc.supabase.co")
    headers = {
        'apikey': os.environ.get("SUPABASE_SERVICE_KEY", ""),
        'Authorization': f'Bearer {os.environ.get("SUPABASE_SERVICE_KEY", "")}'
    }
    conn.request("GET", f"/rest/v1/categories?select=id&slug=eq.{slug}", headers=headers)
    data = json.loads(conn.getresponse().read().decode())
    return data[0]['id'] if data else None

def get_top_products(cat_slug, limit=6):
    cat_id = get_category_id(cat_slug)
    if not cat_id:
        return []
    conn = http.client.HTTPSConnection("uukshxztoztkwxuuvqzc.supabase.co")
    headers = {
        'apikey': os.environ.get("SUPABASE_SERVICE_KEY", ""),
        'Authorization': f'Bearer {os.environ.get("SUPABASE_SERVICE_KEY", "")}'
    }
    conn.request("GET", f"/rest/v1/products?select=id,slug,name,brand,estimated_score,image_url,description,pros,cons,amazon_asin,merchant_links&category_id=eq.{cat_id}&order=estimated_score.desc.nullslast&limit={limit}", headers=headers)
    data = json.loads(conn.getresponse().read().decode())
    products = []
    for p in data:
        ml = p.get('merchant_links') or []
        amazon_url = ""
        if isinstance(ml, list) and len(ml) > 0:
            first = ml[0]
            amazon_url = first.get('affiliate_url') or first.get('url') or ""
        if not amazon_url and p.get('amazon_asin'):
            amazon_url = f"https://www.amazon.fr/dp/{p['amazon_asin']}?tag=troviio-21"
        products.append({
            "slug": p['slug'],
            "name": p['name'],
            "brand": p.get('brand', ''),
            "score": p.get('estimated_score') or 0,
            "image_url": p.get('image_url') or '',
            "desc": (p.get('description') or '')[:200],
            "pros": (p.get('pros') or [])[:3],
            "cons": (p.get('cons') or [])[:2],
            "amazon_url": amazon_url,
            "asin": p.get('amazon_asin') or '',
        })
    return products

def generate_guide_text(h1, category, subject):
    conn = http.client.HTTPSConnection("api.deepseek.com")
    prompt = f"""Tu es le rédacteur en chef de Troviio, site comparateur produit IA français. Style humoristique, pop culture, sarcasme utile. Ton: "ton pote geek qui te dit la vérité".

Génère pour ce guide d'achat : "{h1}"

STRUCTURE EXACTE (séparée par des marqueurs === SECTION ===) :

=== INTRO ===
Paragraphe d'accroche humoristique (120-150 mots). Présente le problème, donne le ton.

=== TABLEAU_RAPIDE ===
3 meilleurs choix au format Marque Produit (Score/100): description rapide.

=== CRITERES ===
4 critères importants pour choisir. Un par ligne. Format: **Critere** : explication 1-2 phrases.

=== PRODUIT_1_VERDICT ===
Nom du produit #1 : verdict 2-3 phrases humoristique. Pour qui ? A eviter si ?

=== PRODUIT_2_VERDICT ===
Meme format pour le #2

=== PRODUIT_3_VERDICT ===
Meme format pour le #3

=== PROFILS ===
3 profils type avec recommandation. Un par ligne. Format: **Pour les {description}** : {recommandation}

=== ERREURS ===
3 erreurs a eviter. Format: **Erreur : titre** — explication

=== FAQ ===
5 questions avec reponses. Format: Q: {question} / R: {reponse}

IMPORTANT: 
- Utilise des vraies references pop culture (Matrix, Kaamelott, Star Wars, OSS 117, Le Seigneur des Anneaux)
- Reste dans 1200-1500 mots
- Pas de prix fixes mentionnes
- Appelle le lecteur "tu"
- Sois drole mais utile"""

    payload = json.dumps({
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "Tu rédiges des guides d'achat humoristiques en français pour Troviio. Style : sarcastique, pop culture, punchlines. Format : sections marquées === SECTION ===."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.85,
        "max_tokens": 3500
    })
    conn.request("POST", "/v1/chat/completions", payload, {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DEEPSEEK_KEY}"
    })
    res = conn.getresponse()
    data = json.loads(res.read().decode())
    return data["choices"][0]["message"]["content"]

def parse_sections(text):
    sections = {}
    current_section = None
    for line in text.split('\n'):
        stripped = line.strip()
        if stripped.startswith('=== ') and stripped.endswith(' ==='):
            current_section = stripped[4:-4].strip().lower().replace(' ', '_').replace('é', 'e').replace('è', 'e')
            sections[current_section] = []
        elif current_section:
            sections[current_section].append(line)
    for k in sections:
        sections[k] = '\n'.join(sections[k]).strip()
    return sections

def create_page_file(cat_slug, guide, products, text):
    page_slug = guide['page_slug']
    h1 = guide['h1']
    meta_title = guide['meta_title']
    meta_desc = guide['meta_desc']

    sections = parse_sections(text)
    intro = sections.get('intro', "Pas d'intro générée.")
    tableau_rapide = sections.get('tableau_rapide', "")
    criteres = sections.get('criteres', "")
    profils = sections.get('profils', "")
    erreurs = sections.get('erreurs', "")
    faq = sections.get('faq', "")

    # Produits pour le top 3 et les verdicts
    top3 = products[:3]

    # Création du dossier
    dir_path = f"/root/troviio-ciceron/frontend/src/app/guide-longtail/{cat_slug}/{page_slug}"
    os.makedirs(dir_path, exist_ok=True)

    filepath = f"{dir_path}/page.tsx"

    page_content = f'''import Link from "next/link";
import type {{ Metadata }} from "next";

export const dynamic = "force-dynamic";

const metaTitle = `{meta_title}`;
const metaDesc = `{meta_desc}`;

export const metadata: Metadata = {{
  title: metaTitle,
  description: metaDesc,
  openGraph: {{ title: metaTitle, description: metaDesc }},
}};

function AmazonBtn({{ url, label = "Voir le prix sur Amazon →" }}: {{ url: string; label?: string }}) {{
  if (!url) return null;
  return (
    <a
      href={{url}}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className="block w-full text-center bg-gradient-to-r from-[#FF6B5F] to-[#E5554A] text-white py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 shadow-lg shadow-[#FF6B5F]/20"
    >
      {{label}}
    </a>
  );
}}

function ProsCons({{ pros, cons }}: {{ pros: string[]; cons: string[] }}) {{
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <h4 className="text-sm font-semibold text-[#3ED6A3]">✅ Points forts</h4>
        <ul className="mt-2 space-y-1 text-sm text-[#8B8FA3]">
          {{pros.map((p, i) => <li key={{i}} className="flex gap-2"><span className="text-[#3ED6A3] shrink-0">+</span><span>{{p}}</span></li>)}}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[#FF6B5F]">⚠️ Limites</h4>
        <ul className="mt-2 space-y-1 text-sm text-[#8B8FA3]">
          {{cons.map((c, i) => <li key={{i}} className="flex gap-2"><span className="text-[#8B8FA3] shrink-0">•</span><span>{{c}}</span></li>)}}
        </ul>
      </div>
    </div>
  );
}}

export default function GuidePage() {{
  return (
    <main className="min-h-screen bg-[#0E1020] text-white">
      {/* Hero */}
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="flex items-center gap-2 text-sm text-[#8B8FA3] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/c/{cat_slug}" className="hover:text-white transition-colors">{cat_slug.replace("-", " ").replace("tv", "TV").replace(/\\b\\w/g, c => c.toUpperCase())}</Link>
            <span>/</span>
            <span className="text-white font-medium">{h1}</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#3ED6A3]">Guide d&apos;achat Troviio</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">{{h1}}</h1>
            <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">{meta_desc}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Intro */}
        <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
          <p className="text-base leading-7 text-[#8B8FA3] whitespace-pre-line">{{intro}}</p>
        </div>

        {/* Réponse rapide */}
        {tableau_rapide && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ La réponse rapide</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {{top3.length > 0 && top3[0] && (
                <div className="rounded-2xl border border-white/5 bg-[#161827] p-5">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#FF6B5F] mb-2">🏆 Meilleur choix global</span>
                  <h3 className="text-lg font-bold">{{top3[0].name}}</h3>
                  <p className="text-sm text-[#8B8FA3] mt-1">{{top3[0].brand}} · {{top3[0].score}}/100</p>
                  <div className="mt-4"><AmazonBtn url="{{top3[0].amazon_url}}" /></div>
                </div>
              )}}
              {{top3.length > 1 && top3[1] && (
                <div className="rounded-2xl border border-white/5 bg-[#161827] p-5">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#3ED6A3] mb-2">💰 Meilleur rapport Q/P</span>
                  <h3 className="text-lg font-bold">{{top3[1].name}}</h3>
                  <p className="text-sm text-[#8B8FA3] mt-1">{{top3[1].brand}} · {{top3[1].score}}/100</p>
                  <div className="mt-4"><AmazonBtn url="{{top3[1].amazon_url}}" /></div>
                </div>
              )}}
              {{top3.length > 2 && top3[2] && (
                <div className="rounded-2xl border border-white/5 bg-[#161827] p-5">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#8B8FA3] mb-2">💸 Petit budget</span>
                  <h3 className="text-lg font-bold">{{top3[2].name}}</h3>
                  <p className="text-sm text-[#8B8FA3] mt-1">{{top3[2].brand}} · {{top3[2].score}}/100</p>
                  <div className="mt-4"><AmazonBtn url="{{top3[2].amazon_url}}" /></div>
                </div>
              )}}
            </div>
          </div>
        )}

        {/* Critères importants */}
        {criteres && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight font-display mb-6">📋 Les critères importants</h2>
            <div className="space-y-4">
              {{criteres.split('\\n').filter(l => l.trim()).map((c, i) => (
                <div key={{i}} className="rounded-xl border border-white/5 bg-[#161827] p-5">
                  <p className="text-sm leading-7 text-[#8B8FA3]">{{c}}</p>
                </div>
              ))}}
            </div>
          </div>
        )}

        {/* Sélection détaillée */}
        <h2 className="text-2xl font-bold tracking-tight font-display mb-6">🎯 Notre sélection détaillée</h2>
        <div className="space-y-6 mb-12">
          {{products.slice(0, 3).map((p, i) => (
            <article key={{p.slug}} className="rounded-3xl border border-white/5 bg-[#161827] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gradient-to-r from-[#FF6B5F] to-[#E5554A] px-3 py-1 text-xs font-bold text-white">#{{i + 1}}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#8B8FA3]">Score {{p.score}}/100</span>
                  </div>
                  <h3 className="text-xl font-bold">{{p.brand}} {{p.name}}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#8B8FA3]">{{p.desc}}</p>
                  <ProsCons pros={{p.pros}} cons={{p.cons}} />
                </div>
                <div className="shrink-0 w-48">
                  <AmazonBtn url="{{p.amazon_url}}" />
                  <p className="mt-2 text-xs leading-5 text-[#6B6B7A]">Prix et disponibilité sur Amazon.</p>
                </div>
              </div>
            </article>
          ))}}
        </div>

        {/* Profils */}
        {profils && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight font-display mb-6">🎯 Quel modèle selon votre profil</h2>
            <div className="space-y-3">
              {{profils.split('\\n').filter(l => l.trim()).map((p, i) => (
                <div key={{i}} className="rounded-xl border border-white/5 bg-[#161827] p-4">
                  <p className="text-sm leading-7 text-[#8B8FA3]">{{p}}</p>
                </div>
              ))}}
            </div>
          </div>
        )}

        {/* Erreurs */}
        {erreurs && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight font-display mb-6">🚨 Les erreurs à éviter</h2>
            <div className="space-y-3">
              {{erreurs.split('\\n').filter(l => l.trim()).map((e, i) => (
                <div key={{i}} className="rounded-xl border border-white/5 bg-[#161827] p-4">
                  <p className="text-sm leading-7 text-[#8B8FA3]">{{e}}</p>
                </div>
              ))}}
            </div>
          </div>
        )}

        {/* FAQ */}
        {faq && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight font-display mb-6">❓ Questions fréquentes</h2>
            <div className="divide-y divide-white/10 rounded-3xl border border-white/5 bg-[#161827]">
              {{faq.split('\\n').filter(l => l.trim().startsWith('Q:')).map((q, i) => {
                const parts = q.substring(2).split('R:');
                const question = parts[0]?.trim() || '';
                const answer = parts[1]?.trim() || '';
                if (!question) return null;
                return (
                  <details key={{i}} className="p-5 group">
                    <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between">
                      <span>{{question}}</span>
                      <span className="text-[#8B8FA3] group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-[#8B8FA3]">{{answer}}</p>
                  </details>
                );
              })}}
            </div>
          </div>
        )}

        {/* Liens internes */}
        <div className="rounded-2xl border border-white/5 bg-[#1A1D2E] p-6">
          <h2 className="text-lg font-bold mb-4">📚 Pour aller plus loin</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/c/{cat_slug}" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">
              Voir tous les produits de la catégorie →
            </Link>
            <Link href="/tops" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">
              🏆 Le Top 3 Troviio
            </Link>
            <Link href="/catalogue" className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-[#8B8FA3] hover:text-white transition-colors">
              📋 Tout le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs leading-6 text-[#6B6B7A]">
            * Les prix indiqués sont susceptibles de varier. Troviio participe au Programme d&apos;Associés d&apos;Amazon EU, 
            un programme d&apos;affiliation qui nous permet de percevoir une commission sur les achats effectués via nos liens, 
            sans surcoût pour vous.
          </p>
        </div>
      </section>
    </main>
  );
}}
'''

    with open(filepath, 'w') as f:
        f.write(page_content)
    print(f"  ✅ {cat_slug}/{page_slug} — {h1[:50]}...")
    return filepath

# MAIN
print("=== GÉNÉRATION DES GUIDES STATIQUES TROVIIO ===\\n")

category_subjects = {
    "aspirateur-robot": "aspirateurs robots",
    "tv": "téléviseurs OLED",
    "machine-a-cafe": "machines à café grain",
    "friteuse-air": "friteuses à air",
    "purificateur-air": "purificateurs d'air",
    "velo-electrique": "vélos électriques",
}

for cat_slug, guides in GUIDES_BY_SLUG.items():
    subject = category_subjects.get(cat_slug, cat_slug)
    print(f"\\n--- {cat_slug} ({len(guides)} guides) ---")
    
    products = get_top_products(cat_slug)
    print(f"  Produits chargés: {len(products)}")
    
    for guide in guides:
        print(f"\\n  Génération: {guide['h1']}")
        try:
            text = generate_guide_text(guide['h1'], cat_slug, subject)
            print(f"  Texte généré: {len(text)} chars")
            filepath = create_page_file(cat_slug, guide, products, text)
        except Exception as e:
            print(f"  ❌ ERREUR: {e}")

print("\\n\\n=== GÉNÉRATION TERMINÉE ===")
