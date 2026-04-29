# Plan: Page Tops + Accessoires dans produit + Chat accessoire IA

## Objectif
1. Créer une page `/tops` avec le top 3 de chaque catégorie en format podium visuel
2. Ajouter un lien "🏆 Tops" dans le Header
3. Intégrer `AccessoriesWidget` dans la page produit (`product-client.tsx`)
4. Intégrer le chat accessoire IA dans le flux de chat principal
5. Afficher les 3 meilleurs accessoires sur chaque page produit avec explications

---

## 1. Backend — Nouvelle route `/api/tops`

**Fichier**: `backend/app/api/routes/tops.py` (nouveau)

Route `GET /api/tops` :
- Interroge `categories` pour récupérer tous les slugs
- Pour chaque catégorie, SELECT top 3 produits par `estimated_score DESC`
- Retourne : `{ "tops": [{ "category": {slug, name}, "products": [{slug, name, brand, price_eur, estimated_score, pros, cons, image_url, affiliate_url, amazon_asin, merchant_links}] }] }`

**Fichier**: `backend/app/main.py`
- Ajouter `from app.api.routes import tops`
- `app.include_router(tops.router)`

**Fichier**: `backend/app/services/results_service.py` ou nouveau `backend/app/services/tops_service.py`
- Fonction `get_category_tops()` avec logique de cache (revalidate 1h)

---

## 2. Frontend — Page `/tops`

**Fichier**: `frontend/src/app/tops/page.tsx` (nouveau)
- SSR avec `dynamic = "force-dynamic"` (ou ISR 3600s)
- Fetch `GET /api/tops`
- Design **dark theme Troviio** (même charte que la page d'accueil)
- **Format podium** par catégorie :
  - Layout : une section par catégorie avec titre
  - Les 3 produits en cartes horizontales : médaille 🥇🥈🥉, image, nom, score, prix, pros/cons (max 3 puces), bouton "Voir sur Amazon" avec lien affilié
  - Score visuel (ScoreRing component)

**Fichier**: `frontend/src/components/TopsPodium.tsx` (nouveau)
- Composant client pour le podium interactif
- Props : `{ category: Category, products: ProductTop[] }`
- Design : carte large avec image à gauche, infos au centre, prix + CTA à droite

**Fichier**: `frontend/src/components/layout/Header.tsx`
- Ajouter lien `🏆 Tops` dans la navigation (entre "Catégories" et "Méthode")

---

## 3. Intégration AccessoiresWidget dans page produit

**Fichier**: `frontend/src/app/produit/[slug]/product-client.tsx`
- Importer `AccessoriesWidget` depuis `@/components/accessories/AccessoriesWidget`
- Ajouter `<AccessoriesWidget productId={product.id} productSlug={product.slug} productName={product.name} />` à la fin du contenu (après `<AudienceSection />`)
- Nécessite que `product.id` soit passé dans les props (déjà présent dans l'API)

---

## 4. Chat accessoire IA

**Fichier**: `frontend/src/app/produit/[slug]/product-client.tsx`
- Importer `AccessoriesChat` depuis `@/components/accessories/AccessoriesChat`
- Ajouter après `AccessoriesWidget`

Le chat accessoire IA existe déjà (`/api/accessories/chat` backend + `AccessoriesChat` frontend). Besoin de le brancher sur la page produit.

---

## 5. Top 3 accessoires dans produit (optionnel, déjà couvert par AccessoriesWidget)

AccessoriesWidget fetch déjà `/api/accessories/for-product/{productId}` et affiche les 6 premiers. Le "top 3" est implicite (les 3 premiers sont les mieux notés).

---

## Déploiement

- Rebuild backend + frontend
- `docker compose up -d`
- Tester la page `/tops`
- Tester la page produit avec accessoires visibles

---

## Fichiers modifiés/créés

| Fichier | Action |
|---------|--------|
| `backend/app/api/routes/tops.py` | **CRÉER** |
| `backend/app/main.py` | Modifier (importer + inclure tops router) |
| `frontend/src/app/tops/page.tsx` | **CRÉER** |
| `frontend/src/components/TopsPodium.tsx` | **CRÉER** |
| `frontend/src/components/layout/Header.tsx` | Modifier (ajouter lien Tops) |
| `frontend/src/app/produit/[slug]/product-client.tsx` | Modifier (ajouter AccessoriesWidget + AccessoriesChat) |
| `frontend/src/types/index.ts` | Peut-être (type ProductTop) |
