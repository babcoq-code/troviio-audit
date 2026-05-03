# Plan : Scraping tests produit + Podium automatisé

## Goal
Construire un pipeline automatisé qui :
1. Scrape 3+ tests/avis pour chaque produit (366 produits, 15 catégories)
2. Synthétise ces tests en contenu structuré (pros/cons, verdict, scores, specs)
3. Met à jour Supabase avec les données enrichies
4. Scrape les top 3 de chaque catégorie chaque semaine (minimum 5 sources type top3)
5. Détecte les nouveaux produits manquants → crée automatiquement dans Supabase avec ASIN + liens affiliés + 3 tests

---

## Architecture

### 1. Sources de scraping
| Source | Type | Utilité |
|--------|------|---------|
| **Les Numériques** | Tests FR complets | Pros/cons, scores, prix |
| **RTINGS.com** | Tests techniques US | Scores objectifs, specs |
| **Amazon FR** | Avis clients + description | Verdict utilisateur, prix |
| **Que Choisir** | Tests labo FR | Scores fiabilité |
| **Blogs spécialisés** (Maison&Objet, 01net, etc.) | Articles comparatifs | Synthèse marché |

### 2. Pipeline proposé

```
[Celery Beat] Tous les dimanches 3h
       │
       ▼
[Scraper Coordinator] → Pour chaque catégorie :
       │
       ├── 1. Scraper 5 sources de "top 3 [catégorie]" 
       │       → Extraire les noms de produits recommandés
       │
       ├── 2. Comparer avec notre DB
       │       → Nouveaux produits → créer dans products
       │       → Trouver ASIN Amazon (recherche)
       │       → Créer merchant_links
       │
       ├── 3. Pour chaque produit (nouveau ET existant) :
       │       → Scraper 3 sources de test
       │       → Synthèse via DeepSeek (structured output)
       │       → Update DB : pros, cons, description, verdict,
       │         score, estimated_score, specs, price_eur
       │
       └── 4. Mettre à jour /api/tops
```

### 3. Ce qui existe déjà
- ✅ `celery_worker` + `celery_beat` opérationnels
- ✅ `Firecrawl` installé (API key manquante — à configurer)
- ✅ `DeepSeek API` déjà configurée dans le backend
- ✅ Structure Supabase : `products`, `categories`, `merchant_links`
- ✅ Tag Amazon : `troviio-21`
- ✅ Route `/api/tops` qui expose le podium

### 4. Ce qu'il faut créer/modifier

#### Backend — Nouveaux fichiers
```
backend/app/tasks/
├── scraper_top3.py        ← Scrape les top 3 hebdomadaires
├── scraper_tests.py       ← Scrape 3 tests par produit
├── synthesizer.py         ← Synthèse DeepSeek → données structurées
└── orchestrator.py        ← Coordination du pipeline hebdo
```

#### Backend — Modifications
- `backend/app/celery_app.py` → Ajouter les scheduled tasks (beat schedule)
- `backend/app/tasks/scraper.py` → Refactor pour utiliser les nouveaux modules
- `.env` → Ajouter `FIRECRAWL_API_KEY` (nécessaire)

#### Script d'amorçage (one-shot)
```
scripts/bootstrap-scraping.py
  → Pour chaque produit sans description/pros/cons :
      1. Chercher URL test
      2. Scraper contenu
      3. Synthèse IA → structuré
      4. Update DB
```

---

## Détail par étape

### Étape 1 : Scraper les top 3 hebdomadaires (celery beat)
**Fréquence** : Tous les dimanches 3h  
**Sources** : 
- Google Shopping "[catégorie] top 3 2026"
- Les Numériques "meilleur [catégorie] 2026"
- UFC Que Choisir comparatif
- Amazon "meilleures ventes [catégorie]"
- Blogs spécialisés

**Output** : Liste de noms de produits + URLs → stocké dans table `scraped_top_results`

### Étape 2 : Détection de nouveaux produits
- Comparer les noms scrapés avec notre DB (fuzzy match)
- Si nouveau produit trouvé :
  - Chercher ASIN Amazon (via recherche Firecrawl ou Amazon PAAPI)
  - Créer ligne dans `products`
  - Créer `merchant_links`
  - Planifier scraping de 3 tests

### Étape 3 : Scraping 3 tests par produit
**Méthode** :
1. Search " [produit] test avis 2026" → top 3 URLs
2. Pour chaque URL :
   - Firecrawl → contenu texte complet
   - Extraction des sections clés (verdict, pros/cons, scores, prix)
3. Si Firecrawl indispo → fallback Playwright stealth

### Étape 4 : Synthèse via DeepSeek
**Input** : 3 textes bruts de tests  
**Output structuré** (JSON) :
```json
{
  "pros": ["Mousseur lait exceptionnel", "Réglage mouture 30 positions"],
  "cons": ["Prix élevé", "Pas de connectivité"],
  "verdict": "Meilleure option si on hésite...",
  "scores": {"design": 8.5, "performance": 9.0, "value": 7.0},
  "specs": {"pression_bar": 9, "reservoir_l": 2},
  "estimated_score": 8.7,
  "why_perfect": "Pour les amateurs de latte...",
  "description": "..."
}
```

### Étape 5 : Update DB
- Mettre à jour `products` avec synthèse
- Mettre à jour `price_eur` et `merchant_links.priceEur`
- Recalculer les tops/podium

---

## Risques & Mitigations

| Risque | Mitigation |
|--------|-----------|
| Firecrawl API key coûteuse | Fallback Playwright stealth + rate limiting |
| Amazon bloque le scraping | Playwright stealth, residential proxies, rate limiting |
| DeepSeek rate limit | Queue avec backoff exponnentiel |
| Données inexactes (hallucination) | Validation croisée multi-source + confidence score |
| Site cible change de structure | Détection d'échec + retry avec fallback |

## Questions en suspens
1. **Budget Firecrawl ?** Actuellement pas de clé API. Abonnement nécessaire ou on passe en Playwright full ?
2. **Amorçage 366 produits** → estimé 15-20h de scraping (3 min/produit). Faire en batch parallèle ?
3. **Stockage des textes scrapés** → Garder les textes bruts en DB pour ré-synthèse future ?
4. **Priorité** → Commencer par 1 catégorie pilote (machine à café) pour valider le pipeline, puis dérouler ?
