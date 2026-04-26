# PICKSY — État des lieux complet pour Cicéron

> **Date :** 26 avril 2026  
> **Stack :** FastAPI + DeepSeek V4 Pro + Supabase + Redis + Celery + Firecrawl + Next.js 15 + Tailwind v4  
> **VPS :** Hostinger KL (Debian) — 96GB SSD, 70% utilisé  
> **Domaine :** `picksy.babcoq.tech` via Cloudflare Tunnel  
> **Repo :** `babcoq-code/Picksy` (privé) sur GitHub  
> **Dossier racine :** `/opt/picksy/`  

---

## 1. STRUCTURE COMPLÈTE DU PROJET

```
/opt/picksy/
├── docker-compose.yml          (66 lignes) — 6 services
├── .env                        (34 lignes) — toutes les variables d'env
│
├── backend/                    (~1 200 lignes)
│   ├── Dockerfile              (10 lignes) — python:3.12-slim + uvicorn --reload
│   ├── requirements.txt        (28 lignes) — 14 dépendances
│   ├── app/
│   │   ├── main.py             (49 lignes) — point d'entrée FastAPI
│   │   ├── celery_app.py       (42 lignes) — Celery app + schedule
│   │   ├── celery_config.py    (1 ligne)   — import d'app
│   │   ├── api/routes/
│   │   │   ├── chat.py         (352 lignes) — route principale chat IA
│   │   │   ├── products.py     (51 lignes)  — CRUD produits
│   │   │   └── newsletter.py   (73 lignes)  — inscription/confirmation newsletter
│   │   ├── services/
│   │   │   ├── chat_service.py (207 lignes) — service chat v1 (non utilisé par la route actuelle)
│   │   │   └── firecrawl_service.py (118 lignes) — scraping Firecrawl + extraction DeepSeek
│   │   └── tasks/
│   │       ├── scraper.py      (160 lignes) — tâche Celery scraping hebdo
│   │       ├── prices.py       (36 lignes)  — mise à jour prix Amazon
│   │       └── newsletter_task.py (78 lignes) — newsletter hebdo via Resend
│
├── frontend/                   (~1 100 lignes)
│   ├── Dockerfile              (38 lignes) — node:20-alpine, standalone output
│   ├── package.json            (29 lignes) — Next 15.3.1, React 19, Tailwind v4, framer-motion
│   ├── next.config.ts          (27 lignes) — standalone, rewrites /api/* → localhost:8000
│   ├── tailwind.config.ts      (47 lignes) — config Tailwind legacy (DUPLIQUÉ avec globals.css)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx      (21 lignes) — RootLayout, meta, fonts Google
│   │   │   ├── page.tsx        (517 lignes) — UNE SEULE page : home + chat + newsletter
│   │   │   └── globals.css     (141 lignes) — theme Tailwind v4 + animations CSS
│   │   ├── components/
│   │   │   ├── ChatBubble.tsx   (28 lignes) — bulle de chat user/ai
│   │   │   ├── ProductCard.tsx  (101 lignes) — carte produit avec ScoreRing
│   │   │   └── ScoreRing.tsx    (84 lignes) — anneau de score SVG pur (pas de framer-motion)
│   │   └── lib/
│   │       ├── api.ts           (43 lignes) — client API (fetch vers picksy.babcoq.tech/api)
│   │       └── types.ts         (39 lignes) — types TypeScript Product, ChatResponse, etc.
│
├── scripts/
│   ├── scraper_v2.py           (345 lignes) — scraping par article (prompts spécifiques par catégorie)
│   └── scraper_massif.py       (279 lignes) — scraping massif multi-sources (42 sources)
│
└── supabase/migrations/
    ├── 001_initial.sql          (237 lignes) — schema initial : categories, products, reviews, prices, etc.
    └── 002_scores_and_categories.sql (79 lignes) — colonnes scores + vue v_products_published + catégories
```

---

## 2. INFRASTRUCTURE DOCKER

### docker-compose.yml — 6 services

| Service | Image | Port | Dépend | Commande | Notes |
|---|---|---|---|---|---|
| `backend` | builds `./backend` | 8000 | redis | uvicorn --reload | Traefik labels pour /api/* |
| `frontend` | builds `./frontend` | 3000 | - | node server.js | Traefik labels pour tout sauf /api |
| `celery_worker` | builds `./backend` | - | redis | celery worker | volume mount ./backend:/app (HOT RELOAD) |
| `celery_beat` | builds `./backend` | - | redis | celery beat | volume mount ./backend:/app |
| `redis` | `redis:7-alpine` | 6379 | - | - | volume persistant redis-data |
| Traefik | `traefik:latest` (hors compose) | 80/443 | - | network_mode: host | Lancé depuis `/docker/traefik/` |

### Réseau
- Tous les services picksy sont sur le même réseau Docker (par défaut)
- Traefik est en `network_mode: host` (pas de réseau Docker)
- Communication inter-services : `backend:8000`, `redis:6379`

### Volumes Docker
- `picksy_redis-data` — persistance Redis

---

## 3. ROUTING RÉSEAU

### Cloudflare Tunnel
- **Binaire :** `cloudflared` (service systemd actif)
- **Config :** `/etc/cloudflared/config.yml`
- **Tunnel ID :** `001fc37c-3de5-497a-9922-0ae4771af06b`
- **Creds :** `/root/.cloudflared/001fc37c-3de5-497a-9922-0ae4771af06b.json`

```
picksy.babcoq.tech
  ├── /api/*  →  http://localhost:8000
  └── /*      →  http://localhost:3000
```

### Traefik (running, mais PAS utilisé pour le routing externe)
- Les labels Traefik dans docker-compose existent mais ne servent pas car le tunnel Cloudflare route directement sur les ports 3000 et 8000.
- Le Traefik en `network_mode: host` écoute sur 443 avec Let's Encrypt mais ne reçoit pas le trafic (Cloudflare proxy désactivé, grey cloud).

### Problème résolu : le `/api/*` via tunnel
- Le backend écoute sur `/health`, `/api/chat/`, `/api/products/`, `/api/newsletter/`
- Le tunnel envoie `/api/health` → `localhost:8000/api/health` → 404 si le endpoint n'existe pas
- **Fix appliqué :** `@app.get("/api/health")` ajouté en plus de `@app.get("/health")`

---

## 4. SUPABASE — ÉTAT DE LA BASE

### Connexion
- **URL :** `https://uukshxztoztkwxuuvqzc.supabase.co`
- **Clé service :** `SUPABASE_SERVICE_KEY_PLACEHOLDER`
- **Clé anon :** `REDACTED_SECRET`

### Tables créées par le schema SQL (001 + 002)
| Table | Lignes | Statut |
|---|---|---|
| `products` | **51** | ✅ Active — seule table avec des données |
| `categories` | **24** | ✅ Active |
| `reviews` | 0 | ⚠️ Vide (jamais peuplée) |
| `prices` | 0 | ⚠️ Vide |
| `price_history` | - | ❌ Erreur (table absente — script SQL pas exécuté ?) |
| `chat_sessions` | 0 | ✅ Créée mais vide |
| `top5` | 0 | ✅ Créée mais vide |
| `scrape_jobs` | 0 | ✅ Créée mais vide |
| `newsletter_subscribers` | 0 | ✅ Créée mais vide |
| `user_profiles` | - | ❌ Table absente |
| `price_alerts` | - | ❌ Table absente |
| `wishlists` | - | ❌ Table absente |
| `embeddings` | - | ❌ Table absente |

### Vue
- `v_products_published` — jointure products × categories, 51 lignes
- Colonnes : `id, name, brand, model, image_url, estimated_score, price_eur, use_case_scores, specs, affiliate_url, amazon_asin, source_url, category_slug, category_name, category_emoji`

### RLS Policies
- Products, categories, reviews, prices, top5 : lecture publique
- user_profiles, chat_sessions, price_alerts, wishlists : proprio uniquement
- **Problème :** Plusieurs tables RLS activées mais absentes de la base réelle

### Colonnes clés de `products`
- `id` (UUID PK), `name`, `brand`, `model`, `ean`, `image_url`, `release_year`
- `category_id` (UUID FK → categories) — PAS de `category_slug` directe
- `status` : `published` | `pending_review`
- `estimated_score` (DECIMAL 4,1) — score Picksy 0-10
- `price_eur` (INTEGER)
- `use_case_scores` (JSONB) — scores par usage : `{"parquet": 8.5, "animaux": 7.0, ...}`
- `specs` (JSONB) — specs techniques + verdict/pros/cons
- `affiliate_url` (TEXT), `amazon_asin` (TEXT)
- `source_url`, `source_title`, `source_date`
- `is_active` (BOOLEAN), `created_at`, `updated_at`

### Contenu des données — 51 aspirateurs robots
**Prix :** 150€ à 1850€ | **Scores :** 6/10 à 10/10

Distribution :
- 150-300€ : 5 modèles (budget/S1)
- 300-600€ : 9 modèles (moyen/S2)
- 600-1000€ : 11 modèles (premium/S3)
- 1000-1850€ : 26 modèles (ultra/S4)

Marques : Roborock (9), Dreame (6), Ecovacs (4), MOVA (3), iRobot (3), Eufy (3), Narwal (3), Xiaomi (2), Lefant (1), TP-Link Tapo (1), SwitchBot (1), Yeedi (1), Miele (1), Rowenta (1), Shark (1), Dyson (2), DJI (1), Samsung (1), Matic (1)

### Catégories (24)
Seulement 1 catégorie avec des produits : `robot-aspirateur` (51 produits)
Les 23 autres catégories sont vides : aspirateur-balai, tv-oled, smartphone, ordinateur-etudiant, machine-cafe, casque-audio, lave-linge, refrigerateur, ordinateur-gaming, purificateur-air, barre-son, lave-vaisselle, seche-linge, domotique-hub, camera-securite, thermostat-connecte, friteuse-air, serrure-connectee, ampoule-connectee, imprimante, trottinette, velo-electrique, four-micro-onde

---

## 5. API BACKEND — ENDPOINTS

### Route principale : `/api/chat/` (352 lignes)

**Méthodes :** `POST /api/chat/` et `POST /api/chat` (avec et sans slash)

**Request body :**
```json
{
  "message": "string",
  "history": [{"role": "string", "content": "string"}],
  "user_id": "string (default: anonymous)"
}
```

**Response :**
```json
{
  "reply": "string",
  "is_scope": true,
  "action": "search|null",
  "profile": {"categorie": "...", "budget_max": 500, "criteres": [...], "resume": "..."},
  "recommendations": [{"name":"...","brand":"...","rank_label":"...","score":8.5,...}]
}
```

**Flow interne :**
1. Vérification hors-scope (mots-clés blacklist)
2. Appel DeepSeek V4 Pro avec SYSTEM_PROMPT → 3-5 tours de questions
3. DeepSeek répond avec `{"action":"search","profile":{...}}`
4. `query_db()` → interroge `v_products_published` avec slug catégorie + budget
5. `rank_with_ai()` → DeepSeek classe top 3 avec `thinking:disabled` + `json_object`
6. `format_recs()` → formate en texte markdown pour l'utilisateur
7. `ai_fallback()` → si DB vide, DeepSeek génère de mémoire

**Bug fixé :** DeepSeek V4 Pro mettait sa réponse dans `reasoning_content` au lieu de `content`. Solution : `extra_body={"thinking": {"type": "disabled"}}` + `response_format={"type": "json_object"}` + fallback sur `reasoning_content`.

### Autres endpoints

| Route | Méthode | Description |
|---|---|---|
| `/health` | GET | Health check simple |
| `/api/health` | GET | Health check via tunnel |
| `/products/` | GET | Liste produits (query: category, limit) |
| `/products/top5/{category}` | GET | Top 5 par catégorie |
| `/products/{product_id}` | GET | Détail produit |
| `/newsletter/subscribe` | POST | Inscription newsletter + email Resend |
| `/newsletter/confirm` | GET | Confirmation token |
| `/newsletter/unsubscribe` | GET | Désinscription token |

### Problème connu sur `/products/`
- Filtre par `category` (string) au lieu de `category_id` (UUID) → ne fonctionne pas avec les données actuelles
- La colonne `category` n'existe pas dans `products`, c'est `category_id`

---

## 6. FRONTEND — ÉTAT

### Page unique : `page.tsx` (517 lignes)
La homepage contient tout :
1. **Header** — logo + tagline
2. **Hero** — "Pas le meilleur. Le tien." + badges
3. **Chat** — zone de chat + input + suggestions (3 catégories)
4. **Section ADN** — 3 cartes (Ne compare pas, Ne liste pas, N'achète pas)
5. **Section Produits** — grid de ProductCards (chargés via fetchTopProducts)
6. **Section Bannière** — "C'est l'objet qui s'adapte à TOI"
7. **Section Newsletter** — input email + subscribe
8. **Section Différenciation** — 4 colonnes
9. **Section Témoignages** — statique
10. **CTA Final** — "Trouve le mien ✨"
11. **Footer** — logo + copyright

### Ce qui MANQUE dans le frontend :
- ❌ Pas de pages légales (`/mentions-legales`, `/politique-confidentialite`, etc.)
- ❌ Pas de pages produit individuelles (`/produit/[slug]`)
- ❌ Pas de pages catégories (`/categorie/robot-aspirateur`)
- ❌ Pas de routing Next.js (app router utilisé mais pas de routes autres que `/`)
- ❌ Pas de layout pour le SEO (meta tags basiques seulement)
- ❌ framer-motion présent dans package.json mais NE PAS UTILISER (crash SSR hydration)

### Design System
- **Couleurs :** Coral (#FF6B5F), Mint (#3ED6A3), Blueberry/Blue (#4257FF), Night (#0E1020), Cream (#FFF7ED)
- **Fonts :** Sora (titres), Inter (corps), Nunito (scores)
- **Animations CSS :** pulse-glow, slide-up, badge-pop, score-ring (pur CSS, pas framer-motion)
- **Globals.css :** theme Tailwind v4 `@theme` + keyframes CSS
- **tailwind.config.ts :** DUPLICATION des couleurs Tailwind (v3 style) — devrait être supprimé car Tailwind v4 utilise globals.css uniquement

### Composants React
- `ChatBubble` — motion.div (framer-motion) → **RISQUE :** chargé via `dynamic()`, ssr:false
- `ProductCard` — motion.article (framer-motion) → **RISQUE :** même problème potentiel
- `ScoreRing` — SVG pur, pas de framer-motion → OK

---

## 7. SCRAPING — ÉTAT

### Script scraper_massif.py (279 lignes)
- **42 sources** (Tier 1 + Tier 2) couvrant 11 catégories
- Utilise Firecrawl v2 API (`firecrawl-py`) + DeepSeek pour extraction
- Prompt d'extraction avec `use_case_scores` JSONB
- Déduplication par nom (ilike)
- Logging dans `scrape_jobs`
- **Dernier run :** 7 nouveaux produits, 11 erreurs (sites bloqués, parsing échoué)
- **Container `picksy-scraper` :** exited (a run une fois, pas en daemon)

### Script scraper_v2.py (345 lignes)
- Version alternative avec prompts par catégorie (plus précis)
- Utilise aussi Firecrawl + DeepSeek
- Sources article-style uniquement (pas pages catégories JS)

### Tâche Celery `scraper.run_weekly_discovery`
- Programmé : dimanche 3h00
- 6 sources RTINGS + Les Numériques (3 catégories seulement)
- Le prompt d'extraction ne correspond PAS aux scripts standalone (moins de données extraites)
- **Problème :** la tâche Celery scrape les mêmes sources que les scripts standalone mais avec un prompt différent → incohérence

### Sources qui fonctionnent bien
- RTINGS (robot vacuum, TV, soundbar, air purifier)
- Vacuum Wars
- The Spruce
- Les Numériques (guides d'achat)
- Wirecutter (certaines pages)

### Sources qui échouent
- FlatpanelsHD (bloque Firecrawl)
- PCMag (bloque)
- What Hi-Fi? (JS lourd)
- AVCesar (extraction JSON échoue)
- The Ambient (contenu insuffisant)

---

## 8. CELERY — TÂCHES PLANIFIÉES

| Tâche | Nom | Schedule | Statut |
|---|---|---|---|
| Scraping hebdo | `app.tasks.scraper.run_weekly_discovery` | Dim 3h00 | ⚠️ Tourne mais peu de nouvelles données |
| Newsletter | `app.tasks.newsletter_task.send_weekly_weekly` | Lun 9h00 | ⚠️ DB vide (0 subscribers) |
| Prix Amazon matin | `app.tasks.prices.update_amazon_prices` | 7h00 chaque jour | ⚠️ DB vide (0 produits avec ASIN) |
| Prix Amazon soir | `app.tasks.prices.update_amazon_prices` | 19h00 chaque jour | ⚠️ DB vide |

Le Celery Beat et Worker tournent avec un volume mount `./backend:/app` → hot reload du code.

---

## 9. PROBLÈMES ET BUGS IDENTIFIÉS

### Bloquants
1. **⚠️ 1 seule catégorie sur 24** a des produits. Tout le reste du chat (TV, café, etc.) tombe en `ai_fallback()`. Le scraping n'a pas encore été relancé pour les autres catégories.
2. **⚠️ Route `/products/` cassée** : utilise `.eq("category", category)` mais la colonne `category` n'existe pas dans `products` (c'est `category_id` UUID). Le filtre ne marche pas.
3. **⚠️ Newsletter fonctionnelle mais inutile** : 0 subscribers, pas de page `/newsletter/confirm` ou `/newsletter/unsubscribe` dans le frontend.
4. **⚠️ `DeepSeek V4 Pro` coûte $20** — config partagée avec Oscar ? La clé DeepSeek est dans `/opt/oscar/deepseek.key` et dans `/opt/picksy/.env`.

### Sérieux
5. **⚠️ `user_id="anonymous"` dans chat.py** — jamais connecté à Supabase Auth. Toutes les sessions sont anonymes.
6. **⚠️ RLS policies incohérentes** : le schema SQL active RLS sur des tables qui n'existent pas (user_profiles, price_alerts, wishlists). Les policies de lecture publique sont actives sur products mais le script de scraping utilise la clé service (bypass RLS).
7. **⚠️ Volume mount Celery** `./backend:/app` → en production, les modifications de code sont instantanées. C'est pratique pour le dev mais dangereux en prod (modification de code en live).
8. **⚠️ `--reload` dans uvicorn** en production (Dockerfile CMD). Le `--reload` est pour le développement seulement.

### Mineurs / Design
9. **⚠️ `chat_service.py` (207 lignes)** n'est PAS utilisé par la route `chat.py`. C'est un vestige de la v1. Duplication de code.
10. **⚠️ `firecrawl_service.py` (118 lignes)** non plus n'est pas appelé par la route actuelle.
11. **⚠️ `tailwind.config.ts` en double** avec `globals.css` — Tailwind v4 utilise `@theme` dans CSS, pas le fichier JS.
12. **⚠️ Aucune gestion d'erreur HTTP standardisée** — pas de middleware error handler.
13. **⚠️ Pas de rate limiting** sur le chat (un attaquant peut spammer l'API DeepSeek à $20).
14. **⚠️ Pas de cache** pour les appels DeepSeek (Redis est disponible mais pas utilisé comme cache).
15. **⚠️ Les noms de marque sont parfois dupliqués** dans les réponses DeepSeek : `"MOVA MOVA P10 Pro Ultra"` (marque + nom, mais la marque est aussi dans le nom).

### Sécurité
16. **⚠️ Clés API dans `.env`** accessibles depuis Docker. OK pour l'instant car mono-utilisateur.
17. **⚠️ Pas de validation des entrées** côté backend pour les produits (injection SQL Supabase ? Le client Supabase échappe mais les `ilike` sont sensibles).
18. **⚠️ Aucun log structuré** — tout est `print()`. Pas de niveaux (info/warn/error), pas de format JSON.

---

## 10. CE QUI MANQUE POUR LA PHASE 1 AFFILIATION

### Pages légales (0/6) — Blocage absolu
- [ ] `/mentions-legales` — SIRET, hébergeur, directeur publication
- [ ] `/politique-confidentialite` — RGPD, droits, sous-traitants
- [ ] `/cookies` — liste cookies, CMP
- [ ] `/affiliation` — disclosure "liens affiliés, commission sans surcoût"
- [ ] `/a-propos` — mission, méthodologie, pays
- [ ] `/contact` — formulaire + partnerships@picksy... (pas de domaine email)

### Pages produit (0/?) 
- [ ] Route `/produit/[slug]` — page individuelle avec score, specs, prix, lien affilié
- [ ] Images produits (Amazon PA-API ou placeholder)
- [ ] Liens affiliés Amazon Associates
- [ ] Comparaison côte-à-côte

### Réseaux d'affiliation (0/8 Batch 1)
- Non commencé. Nécessite les pages légales d'abord.

### Pipeline ingestion feeds (0/1)
- Non commencé. Kelkoo API gratuite disponible.

---

## 11. VARIABLES D'ENVIRONNEMENT

Récupérées du `.env` :

```
APP_ENV=production
APP_DEBUG=false
SECRET_KEY=*** [masqué]
ALLOWED_ORIGINS=http://localhost:3000,https://picksy.babcoq.tech,https://api.picksy.babcoq.tech

DEEPSEEK_API_KEY=*** [fichier: /opt/oscar/deepseek.key]
DEEPSEEK_MODEL=deepseek-v4-pro

SUPABASE_URL=https://uukshxztoztkwxuuvqzc.supabase.co
SUPABASE_KEY=REDACTED_SECRET
SUPABASE_SERVICE_KEY=SUPABASE_SERVICE_KEY_PLACEHOLDER

REDIS_URL=redis://redis:***@picksy.fr
DOMAIN=localhost

FIRECRAWL_API_KEY=*** [clé: fc-8e117a1377c64c0c866c35adc92e2d0d]

ICECAT_USERNAME=placeholder
ICECAT_PASSWORD=*** [placeholder]

AMAZON_AFFILIATE_TAG=picksy-21

RESEND_API_KEY=*** [dans .env]
```

**Note :** La clé Redis a un mot de passe en clair dans l'URL. `DOMAIN=localhost` est incorrect (devrait être `picksy.babcoq.tech`).

---

## 12. RECOMMANDATIONS PRIORITAIRES POUR CICÉRON

### Urgent (bloque tout le reste)
1. **Scrapper les autres catégories** — lancer scraper_massif.py ou scraper_v2.py pour TV, café, casque, lave-linge, etc.
2. **Créer les pages légales** dans le frontend Next.js (pages statiques)
3. **Corriger la route `/products/`** (filtre category → category_id)
4. **Changer la route newsletter** — DOMAIN doit être `picksy.babcoq.tech`

### Important
5. **Refactor `chat.py`** : nettoyer la duplication, supprimer le dead code (chat_service.py, firecrawl_service.py)
6. **Ajouter du cache Redis** pour les réponses DeepSeek (évite de re-scorer en boucle)
7. **Remplacer `--reload`** dans le Dockerfile backend par du mode production
8. **Migrer `deepseek-chat`** vers `deepseek-v4-pro` dans tous les scripts (deadline 24 juillet 2026)
9. **Ajouter pages produit** `/produit/[slug]`
10. **Créer formulaire de contact** fonctionnel avec Resend

### Stratégique
11. **Mettre en place le rate limiting** sur `/api/chat/` (Redis + token bucket)
12. **Logging structuré** (remplacer `print()` par `logging`)
13. **Supprimer `tailwind.config.ts`** (inutile avec Tailwind v4)
14. **Nettoyer les migrations Supabase** (certaines tables du schema 001 n'ont jamais été créées)
15. **Créer un script de seed** pour les tables de base (top5, homepage picks)

---

*Document généré par Hermes Agent — 26 avril 2026*
*À drop dans la mémoire de Cicéron pour révision complète.*
