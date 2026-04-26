# 🏡✨ Picksy

> *"C'est l'objet qui s'adapte à TOI, pas l'inverse"*

**Picksy** est une application web de recommandation de produits maison par IA. Pas de avis bidons, pas de placements de produit. L'IA analyse des centaines de sources techniques, confronte les specs, et te sort une reco personnalisée — sans bullshit, sans affiliation cachée.

🔗 **Production** : [picksy.babcoq.tech](https://picksy.babcoq.tech)

---

## 📋 Statut du projet

| Phase | Statut | Détail |
|-------|--------|--------|
| 🧱 Infra | ✅ | Docker + Cloudflare Tunnel + Traefik |
| 🤖 Chat IA | ✅ | DeepSeek V4 Pro — 3 recos par requête |
| 🏠 Homepage | ✅ | Design V2 premium |
| 📄 Pages légales | ✅ | 7 pages (mentions, RGPD, cookies, affiliation, méthodo, à propos) |
| 🔍 Scraping | ✅ | Firecrawl — 24 catégories, 51 aspirateurs robots |
| 🗄️ Base de données | 🟡 | Schéma Supabase prêt, dataset aspirateurs chargé |
| 🧪 Tests | ❌ | Pas encore |
| 📱 Contact form | ❌ | À faire (Resend + rate limiting) |
| 🎯 Comparateur | ❌ | Phase 2 |
| 📬 Newsletter | ❌ | Phase 2 |

---

## 🏗️ Stack

### Backend
- **FastAPI** (Python 3.12)
- **DeepSeek V4 Pro** — inference IA (via `openai` SDK)
- **Celery + Redis** — tâches asynchrones + cache
- **Supabase** (PostgreSQL) — données produits + historique chat

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **TypeScript**

### Infra
- **VPS** Hostinger (Debian, KL)
- **Docker Compose**
- **Cloudflare Tunnel** (cloudflared)
- **Traefik** (reverse proxy, SSL via DNS Challenge Cloudflare)

---

## 🚀 Quick start (local)

```bash
git clone https://github.com/babcoq-code/Picksy.git
cd Picksy

cp .env.example .env
# Remplir les clés API dans .env

docker compose up -d --build
```

- **Frontend** : http://localhost:3000
- **API Docs** : http://localhost:8000/docs
- **Redis Insight** : http://localhost:5540

---

## 📁 Structure du projet

```
Picksy/
├── backend/                  # FastAPI + Celery
│   ├── app/
│   │   ├── api/             # Routes API
│   │   │   └── routes/      # chat.py, products.py, categories.py
│   │   ├── core/            # Config IA, config Supabase
│   │   ├── models/          # Pydantic schemas
│   │   └── services/        # Scraping, matching, ranking
│   ├── celery_app/          # Tâches Celery
│   ├── migrations/          # Alembic
│   └── requirements.txt
│
├── frontend/                 # Next.js 15
│   ├── src/
│   │   ├── app/
│   │   │   ├── (legal)/     # Pages légales (layout partagé)
│   │   │   │   ├── mentions-legales/
│   │   │   │   ├── politique-confidentialite/
│   │   │   │   ├── cookies/
│   │   │   │   ├── affiliation/
│   │   │   │   └── methodologie/
│   │   │   ├── a-propos/
│   │   │   ├── chat/
│   │   │   ├── categories/
│   │   │   └── ...
│   │   ├── components/      # Composants React
│   │   │   ├── legal/       # LegalPage, LegalNavigation
│   │   │   ├── chat/        # ChatInterface, ScoreRing
│   │   │   └── ui/          # Button, Hero, Navbar...
│   │   ├── lib/             # site.ts, utils
│   │   └── public/          # Logos, favicon
│   ├── Dockerfile
│   └── package.json
│
├── nginx/                   # Old reverse proxy (archivé)
├── supabase/                # Migrations SQL
│   └── migrations/
│       └── 001_initial.sql
├── docker-compose.yml
├── PICKSY_ETAT_DES_LIEUX_CICERON.md  # Inventaire projet pour Cicéron
└── README.md
```

---

## 🤝 Workflow avec Cicéron

**Cicéron** est notre agent multi-modèle (Gemini Pro + Mistral Large + GPT-5 + Deep Dive) qui review l'architecture et le code.

Le fichier [`PICKSY_ETAT_DES_LIEUX_CICERON.md`](PICKSY_ETAT_DES_LIEUX_CICERON.md) est l'état des lieux complet du projet — à transmettre à Cicéron pour review.

**Process recommandé :**
1. Hermes implémente une feature
2. Push sur GitHub
3. PR review par Cicéron
4. Corrections → Merge → Déploiement

---

## 🔑 Variables d'environnement requises

| Variable | Usage |
|----------|-------|
| `DEEPSEEK_API_KEY` | Inference IA (DeepSeek V4 Pro) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `FIRECRAWL_API_KEY` | Scraping produit |
| `CELERY_BROKER_URL` | Redis URL |
| `RESEND_API_KEY` | Emails transactionnels (à configurer) |

---

## 🧪 Services exposés

| Service | Port interne | URL publique |
|---------|-------------|--------------|
| Frontend | 3000 | `https://picksy.babcoq.tech` |
| API | 8000 | `https://picksy.babcoq.tech/api/*` |
| Redis | 6379 | Interne Docker |
| Traefik | 443 | Reverse proxy |

---

*Projet privé — © 2026 babcoq-code*
