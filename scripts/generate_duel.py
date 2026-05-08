#!/usr/bin/env python3
"""Troviio — Générateur automatique de duel quotidien

Choisit une catégorie aléatoire, sélectionne 2 produits similaires,
génère une page duel statique Next.js et un tweet.
"""

import os, sys, json, re, random
from datetime import datetime
import urllib.request
import httpx

# ── Config ──────────────────────────────────────────────────────────────────────
PROJECT_DIR = "/root/troviio-ciceron"
FRONTEND_DUELS_DIR = os.path.join(PROJECT_DIR, "frontend", "src", "app", "duel")
HISTORY_FILE = "/tmp/troviio_duel_history.json"
DRY_RUN = "--dry-run" in sys.argv

# Read secrets from .env
with open(os.path.join(PROJECT_DIR, ".env"), "rb") as f:
    raw = f.read()
env_lines = raw.split(b"\n")
env = {}
for line in env_lines:
    if b"=" in line:
        k, v = line.split(b"=", 1)
        env[k.decode().strip()] = v.decode().strip()

SUPABASE_URL = env.get("SUPABASE_URL", "https://uukshxztoztkwxuuvqzc.supabase.co")
SERVICE_KEY = env.get("SUPABASE_SERVICE_KEY", "")
DEEPSEEK_KEY = env.get("DEEPSEEK_API_KEY", "")

# Extract DeepSeek key properly (masked by system)
if not DEEPSEEK_KEY or DEEPSEEK_KEY.startswith("***"):
    for line in env_lines:
        if b"DEEPSEEK_API_KEY" in line and b"=" in line:
            val = line.split(b"=", 1)[1].strip()
            DEEPSEEK_KEY = val.decode()
            break
    else:
        with open("/root/troviio-ciceron/.env", "rb") as f:
            raw2 = f.read()
        for line in raw2.split(b"\n"):
            if b"DEEPSEEK_API_KEY" in line and b"=" in line:
                DEEPSEEK_KEY = line.split(b"=", 1)[1].strip().decode()
                break

headers = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"}

# ── Helpers ─────────────────────────────────────────────────────────────────────
def supabase_get(table, params=None):
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    if params:
        # Build query string manually
        parts = []
        for k, v in params.items():
            parts.append(f"{k}={urllib.request.quote(str(v))}")
        url = f"{url}?{'&'.join(parts)}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())

def supabase_get_httpx(table, params=None):
    r = httpx.get(f"{SUPABASE_URL}/rest/v1/{table}", headers=headers, params=params, timeout=30)
    return r.json()

def call_deepseek(system_prompt, user_prompt, max_tokens=1500, temp=0.8):
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": temp
    }
    r = httpx.post(
        "https://api.deepseek.com/v1/chat/completions",
        json=payload,
        headers={"Authorization": f"Bearer {DEEPSEEK_KEY}", "Content-Type": "application/json"},
        timeout=120
    )
    return r.json()["choices"][0]["message"]["content"].strip()


# ── Step 1: Load categories and find pairs ──────────────────────────────────────
print("🔍 Chargement des catégories et produits...", flush=True)

cats = supabase_get_httpx("categories", {"select": "id,name,slug"})
cat_map = {c["id"]: c for c in cats}

prods = supabase_get_httpx("products", {
    "select": "name,brand,slug,category_id,specs,estimated_score,test_summary,image_url",
    "is_active": "eq.true",
    "limit": 400
})

# Group by category
by_cat = {}
for p in prods:
    cid = p.get("category_id")
    if cid not in by_cat:
        by_cat[cid] = []
    by_cat[cid].append(p)

# Find categories with 3+ products with specs (we need 2 comparable ones)
eligible_cats = []
for cid, plist in by_cat.items():
    cat = cat_map.get(cid, {})
    cat_slug = cat.get("slug", "")
    # Skip categories already done today or with too few products
    rich = [p for p in plist if isinstance(p.get("specs"), dict) and len(p.get("specs", {})) >= 2]
    if len(rich) >= 3:
        eligible_cats.append({"id": cid, "slug": cat_slug, "name": cat.get("name", "?"), "count": len(rich)})

print(f"📊 {len(eligible_cats)} catégories éligibles (3+ produits avec specs)", flush=True)

if not eligible_cats:
    print("❌ Aucune catégorie éligible trouvée", flush=True)
    sys.exit(1)

# Load history to avoid repeating categories
duel_history = {"history": []}
if os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE) as f:
        duel_history = json.load(f)

done_categories_today = set()
for entry in duel_history.get("history", []):
    entry_date = entry.get("date", "")[:10]
    if entry_date == datetime.now().strftime("%Y-%m-%d"):
        done_categories_today.add(entry.get("category_slug", ""))

# Filter out already-done-today categories
eligible_cats = [c for c in eligible_cats if c["slug"] not in done_categories_today]
if not eligible_cats:
    print("⚠️ Toutes les catégories déjà faites aujourd'hui", flush=True)
    sys.exit(0)

# Pick random category
selected = random.choice(eligible_cats)
cid = selected["id"]
cat_slug = selected["slug"]
cat_name = selected["name"]
print(f"🎯 Catégorie sélectionnée: {cat_name} ({cat_slug})", flush=True)

# Get products for this category with specs
cat_prods = [p for p in by_cat[cid] if isinstance(p.get("specs"), dict) and len(p.get("specs", {})) >= 2]

# Pick 2 products with similar scores (within 25 points)
best_pair = None
best_diff = 999
for i in range(len(cat_prods)):
    for j in range(i+1, len(cat_prods)):
        s1 = cat_prods[i].get("estimated_score", 0) or 0
        s2 = cat_prods[j].get("estimated_score", 0) or 0
        diff = abs(s1 - s2)
        if diff < best_diff and diff <= 35:
            best_diff = diff
            best_pair = (cat_prods[i], cat_prods[j])

if not best_pair:
    # Just pick first 2
    best_pair = (cat_prods[0], cat_prods[1])

p1, p2 = best_pair
print(f"  🥇 {p1['brand']} {p1['name']} ({p1.get('estimated_score',0)}/100)", flush=True)
print(f"  🥈 {p2['brand']} {p2['name']} ({p2.get('estimated_score',0)}/100)", flush=True)

# Generate slug
def slugify(s):
    s = s.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = re.sub(r'-+', '-', s)
    s = s.strip('-')
    return s[:60]

p1_slug = p1["slug"]
p2_slug = p2["slug"]
duel_slug = f"{p1_slug}-vs-{p2_slug}"
duel_title = f"{p1.get('brand','')} {p1['name']} vs {p2.get('brand','')} {p2['name']}"
duel_url = f"https://www.troviio.com/duel/{duel_slug}"
print(f"  📝 Slug duel: {duel_slug}", flush=True)

# Check if this duel already exists
duel_dir = os.path.join(FRONTEND_DUELS_DIR, duel_slug)
if os.path.exists(duel_dir):
    print(f"  ⚠️ Duel existe déjà, on régénère quand même", flush=True)

# ── Step 2: Generate duel content with DeepSeek ─────────────────────────────────
print("🤖 Génération du contenu du duel via DeepSeek...", flush=True)

# Create specs description
specs_p1 = json.dumps(p1.get("specs", {}), ensure_ascii=False, indent=2)[:800]
specs_p2 = json.dumps(p2.get("specs", {}), ensure_ascii=False, indent=2)[:800]
test_p1 = (p1.get("test_summary") or "")[:400]
test_p2 = (p2.get("test_summary") or "")[:400]

system_duel = """Tu es le rédacteur Troviio, le site le plus drôle et décalé de comparateur de produits en France. Ton style : pop culture, absurde, jamais sérieux.

RÈGLE ABSOLUE #1 : TON TROVIIO OBLIGATOIRE
- Chaque paragraphe DOIT contenir une référence pop culture (Matrix, Star Wars, Marvel, Breaking Bad, Game of Thrones, Jurassic Park, etc.) ou une métaphore absurde
- Exemple de bon ton : "Comme si Tony Stark et MacGyver avaient eu un enfant et que ce gamin était ce produit"
- Exemple de bon ton : "C'est Neo qui esquive les balles, mais version clavier"
- Exemple de bon ton : "Le T-Rex de Jurassic Park ferait moins de dégâts que cet aspirateur"
- Si le premier paragraphe commence par un constat factuel, c'est MORT. Réécris-le.

RÈGLE ABSOLUE #2 : PAS DE MARKDOWN DANS LE JSX
- N'utilise JAMAIS **gras** ou *italique* (markdown) dans le JSX
- Utilise UNIQUEMENT <strong>text</strong> pour le gras et <em>text</em> pour l'italique
- Le JSX doit être 100% valide React/Next.js

RÈGLE ABSOLUE #3 : STRUCTURE
Tu génères le return JSX complet de la page duel. La structure exacte :

<main className="min-h-screen bg-[#0E1020] text-white">
  <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1D2E] to-[#0E1020]">
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumbs crumbs={[
        { label: "Accueil", href: "/" },
        { label: "Duels", href: "/duels" },
        { label: "Duel : [TITRE]" },
      ]} />
      <div className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#FF6B5F]">⚔️ Duel Troviio</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-display">[TITRE DU DUEL]</h1>
        <p className="mt-6 text-lg leading-8 text-[#8B8FA3]">[ACCROCHE]</p>
      </div>
    </div>
  </section>

  <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
    <!-- Intro pop culture -->
    <div className="rounded-2xl border border-white/5 bg-[#161827] p-6 mb-10">
      <p className="text-base leading-7 text-[#8B8FA3]">[Paragraphe d'intro drôle avec ref pop culture]</p>
    </div>

    <!-- ⚡ Comparatif rapide -->
    <h2 className="text-2xl font-bold tracking-tight font-display mb-6">⚡ Comparatif rapide</h2>
    <div className="bg-[#161827] rounded-2xl border border-white/5 p-6">
      <p className="text-sm leading-7 text-[#8B8FA3] whitespace-pre-line">
        - <strong>[Spec1]</strong> : [Produit1] → [Produit2] → Gagnant
        - <strong>[Spec2]</strong> : ... etc (5 points)
      </p>
    </div>

    <!-- Les deux poids lourds -->
    <h2 className="text-2xl font-bold tracking-tight font-display mb-6">Les deux poids lourds</h2>
    <div className="grid gap-6 md:grid-cols-2 mb-12">
      <!-- Produit #1 -->
      <div className="rounded-2xl border border-[#4257FF]/30 bg-[#161827] p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#4257FF]">🥇 Produit #1</p>
        <h3 className="text-xl font-bold mb-4"><Link href="/produit/[slug1]">[Nom produit 1]</Link></h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">[Présentation drôle avec ref pop culture]</p>
        <div className="mt-4">
          <Link href="/produit/[slug1]" className="inline-flex items-center gap-2 rounded-lg bg-[#4257FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#3451E0] transition-colors">Voir la fiche →</Link>
        </div>
      </div>
      <!-- Produit #2 - même structure avec border-[#FF6B5F]/30 et bg-[#FF6B5F] pour le bouton -->
    </div>

    <!-- Verdict -->
    <div className="rounded-2xl border border-[#3ED6A3]/30 bg-[#1A2E22] p-6 mb-12">
      <p className="text-xs font-bold uppercase tracking-widest text-[#3ED6A3] mb-2">🏆 Verdict Troviio</p>
      <p className="text-base leading-7 text-[#8B8FA3]">[Verdict avec gagnant et pourquoi, toujours drôle]</p>
    </div>

    <!-- Pour qui -->
    <div className="grid gap-6 md:grid-cols-2 mb-12">
      <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
        <h3 className="text-lg font-bold mb-4">🎯 Pour qui [Produit 1] ?</h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">[3-4 puces en - avec refs pop]</p>
      </div>
      <div className="rounded-2xl border border-white/5 bg-[#161827] p-6">
        <h3 className="text-lg font-bold mb-4">🎯 Pour qui [Produit 2] ?</h3>
        <p className="text-sm leading-7 text-[#8B8FA3]">[3-4 puces en - avec refs pop]</p>
      </div>
    </div>
  </section>
</main>

RESTITUE UNIQUEMENT LE JSX (le return complet sans le export default).
Les slugs des pages produit sont /produit/{slug}.
N'UTILISE PAS ** ni * dans le JSX. Utilise <strong> et <em> à la place."""

user_duel = f"""Génère une page duel entre ces deux produits de la catégorie "{cat_name}":

Produit 1:
- Nom: {p1['brand']} {p1['name']}
- Slug: {p1_slug}
- Score: {p1.get('estimated_score',0)}/100
- Spécifications: {specs_p1}
- Test summary: {test_p1}

Produit 2:
- Nom: {p2['brand']} {p2['name']}
- Slug: {p2_slug}
- Score: {p2.get('estimated_score',0)}/100
- Spécifications: {specs_p2}
- Test summary: {test_p2}

Génère le JSX complet de la page duel. Format Next.js 15 app router, className Tailwind.

Le duel title est: {duel_title}
La meta description doit être accrocheuse.

Important: Le JSX doit être valide et self-contained (pas d'import manquants). 
Les slugs des pages produit sont "/produit/{p1_slug}" et "/produit/{p2_slug}". 
Le breadcrumb catégorie pointe vers "/duels"."""

if DRY_RUN:
    print("  🏁 Dry-run: pas de génération DeepSeek", flush=True)
    duel_jsx = "// DRY RUN"
else:
    duel_jsx = call_deepseek(system_duel, user_duel, max_tokens=3000, temp=0.8)
    
    # Extract the JSX content (remove markdown code fences if present)
    if "```tsx" in duel_jsx:
        duel_jsx = duel_jsx.split("```tsx")[1].split("```")[0].strip()
    elif "```" in duel_jsx:
        duel_jsx = duel_jsx.split("```")[1].split("```")[0].strip()
    
    print(f"  ✅ Contenu généré ({len(duel_jsx)} chars)", flush=True)
    
    # 🚨 Safety: remove any remaining markdown ** and * in JSX
    duel_jsx = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', duel_jsx)
    duel_jsx = re.sub(r'(?<!/)\*(?!\*)(.+?)(?<!/)\*(?!\*)', r'<em>\1</em>', duel_jsx)
    print(f"  ✅ Markdown nettoyé (0 ** restants: {duel_jsx.count('**')})", flush=True)

# ── Step 3: Write the duel page ─────────────────────────────────────────────────
if not DRY_RUN and duel_jsx:
    os.makedirs(duel_dir, exist_ok=True)
    
    # Build the full page file
    # Strip export default if already present
    if "export default" in duel_jsx:
        # The LLM already generated the full export
        page_content = f'''import Link from "next/link";
import {{ Breadcrumbs }} from "@/components/Breadcrumbs";
import type {{ Metadata }} from "next";

{duel_jsx}
'''
    else:
        # Compute a component name
        comp_name = f"Duel{''.join(w.capitalize() for w in p1['name'].replace('/',' ').replace('-',' ').split()[:2])}Vs{''.join(w.capitalize() for w in p2['name'].replace('/',' ').replace('-',' ').split()[:2])}"
        page_content = f'''import Link from "next/link";
import {{ Breadcrumbs }} from "@/components/Breadcrumbs";
import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: "{duel_title} — Duel Troviio",
  description: "Qui est le meilleur ? {p1.get('brand','')} {p1['name']} affronte {p2.get('brand','')} {p2['name']} dans un duel sans merci.",
}};

export default function {comp_name}() {{
{duel_jsx}
}}
'''
    
    page_path = os.path.join(duel_dir, "page.tsx")
    with open(page_path, "w") as f:
        f.write(page_content)
    print(f"  💾 Écrit: {page_path}", flush=True)

# ── Step 4: Generate the tweet ─────────────────────────────────────────────────
print("📣 Génération du tweet...", flush=True)

tweet_system = f"""Tu écris un tweet pour @Troviio_com sur un duel de produits.

RÈGLES STRICTES:
- MAX 240 caractères
- Ton drôle et pop culture
- 1 emoji max
- PAS de hashtags
- PAS de prix
- Structure aérée 2-3 blocs
- Finir par le lien: {duel_url}
- Mentionner les scores /100"""
    
tweet_user = f"""Écris un tweet sur ce duel:
- Produit 1: {p1['brand']} {p1['name']} ({p1.get('estimated_score',0)}/100) - {p1_slug}
- Produit 2: {p2['brand']} {p2['name']} ({p2.get('estimated_score',0)}/100) - {p2_slug}
- Catégorie: {cat_name}
- Lien: {duel_url}

Reste court et punchy, max 240 caractères."""

if DRY_RUN:
    tweet = f"[DRY RUN] Tweet simulé pour le duel {duel_title} — {duel_url}"
    print(f"  🏁 {tweet}")
else:
    tweet = call_deepseek(tweet_system, tweet_user, max_tokens=200, temp=0.7)
    tweet = tweet.strip('"').strip("'").strip()
    
    # Clean up
    for prefix in ["COMPARATIF", "COMPARATIF ⚔️", "⚔️", "Rédige", "Tweet:"]:
        if tweet.startswith(prefix):
            tweet = tweet[len(prefix):].strip()
    
    # Ensure link
    if duel_url not in tweet:
        tweet = tweet.strip() + "\n\n" + duel_url
    
    # Truncate if too long
    if len(tweet) > 240:
        lines = tweet.split('\n')
        while len(tweet) > 240 and len(lines) > 2:
            lines.pop(len(lines) - 2)
            tweet = '\n'.join(lines)
        if len(tweet) > 240:
            tweet = tweet[:237] + "..."
    
    print(f"  ✅ Tweet ({len(tweet)} chars):", flush=True)
    print(f"  {tweet}", flush=True)

# ── Step 5: Save to history ─────────────────────────────────────────────────────
entry = {
    "type": "DUEL",
    "date": datetime.now().isoformat(),
    "category_slug": cat_slug,
    "category_name": cat_name,
    "duel_slug": duel_slug,
    "duel_url": duel_url,
    "tweet": tweet if not DRY_RUN else "[dry-run]",
    "products": [f"{p1['brand']} {p1['name']}", f"{p2['brand']} {p2['name']}"]
}

duel_history["history"].append(entry)
if len(duel_history["history"]) > 50:
    duel_history["history"] = duel_history["history"][-50:]

with open(HISTORY_FILE, "w") as f:
    json.dump(duel_history, f, indent=2)

print(f"✅ Sauvegardé dans l'historique", flush=True)
print(f"\n🔗 {duel_url}", flush=True)
print(f"📂 {duel_dir}", flush=True)
