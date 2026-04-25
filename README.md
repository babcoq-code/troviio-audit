# Picksy 🏡✨
> L'IA anti-regret pour tes achats maison

Application mobile + web de recommandation produit par IA — robots aspirateurs, TV OLED, machines à café.

## Stack
- **Backend** : FastAPI + DeepSeek V4
- **Frontend** : Next.js 15 + Tailwind CSS 4
- **Base de données** : Supabase (PostgreSQL)
- **Cache / Queue** : Redis + Celery
- **Scraping** : Firecrawl
- **Newsletter** : Resend
- **Hébergement** : VPS Ubuntu + Docker

## Lancer en local

```bash
cp .env.example .env
# Remplir les valeurs dans .env
docker compose up -d --build
```

Frontend : http://localhost:3000
API : http://localhost:8000/docs

## Structure
```
picksy/
├── backend/        FastAPI + Celery
├── frontend/       Next.js 15
├── nginx/          Reverse proxy config
├── supabase/       Migrations SQL
└── docker-compose.yml
```
