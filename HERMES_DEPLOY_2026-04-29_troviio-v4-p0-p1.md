# HERMES DEPLOY — TROVIIO V4 — 2026-04-29
## Log de déploiement — P0 + P1

---

## RÉSUMÉ

**Projet** : Troviio V4 — corrections Cicéron (audit live)
**Date** : 2026-04-29
**Statut** : ✅ APPLIQUÉ EN PRODUCTION

---

## P0 — BLOQUANTS (résolus)

### P0.1 — Routes `/categorie/*` (CRITIQUE)
- **Cause** : Dossier `app/` à la racine du frontend (contenant uniquement `api/chat/route.ts`) écrasait `src/app/`. Next.js 15.3 priorise `app/` racine sur `src/app/`.
- **Fix** : Supprimé le dossier `app/` racine. Remplacé l'appel API backend (`fetchProductsByCategorySSR`) par un fetch Supabase REST direct (la route backend `/api/products/?category=` n'existait pas).
- **Dégâts collatéraux** : Tous les `onMouseEnter`/`onMouseLeave`/`onClick` dans `Header.tsx`, `Footer.tsx`, `guide/page.tsx` remplacés par CSS `hover:` (Next.js 15.3.1 interdit les event handlers en Server Component).
- **Vérification** : 5 slugs passent en 200 ✅

### P0.2 — Logo light mode
- **N/A** : Le site utilise un thème 100% dark. Le composant `Logo.tsx` a déjà un système de variant light/dark fonctionnel.

### P0.3 — Amazon reflex dans la copy
- **Fichier** : `resultats/[id]/page.tsx` (3 remplacements)
  - "Voir le prix sur Amazon" → "Voir les offres disponibles"
  - Aria-labels nettoyés
  - Texte de bas de page neutralisé
- **affiliate.ts** : inchangé (la fonction construit des URLs Amazon — c'est le comportement attendu)

### P0.4 — Loading messages chat IA
- **Fichier** : `HeroChatWidget.tsx`
- 5 messages rotatifs toutes les 2.5s pendant la génération IA
- Messages validés Cicéron (ton "humour fin" Troviio)

---

## P1 — STRUCTURELS (résolus)

### P1.1 — Types TypeScript
- **Fichier** : `src/types/recommendation.ts`
- Types ajoutés : `Offer`, `Recommendation`, `UIState`
- Types existants conservés : `RecommendationItem`, `RecommendationResult`

### P1.2 — Composant Top3List
- **Fichier** : `src/components/Top3List.tsx`
- Top 3 avec code couleur (emerald/blue/slate)
- Section "À éviter si..." repliable
- Délègue les offres à OfferList

### P1.3 — Composant OfferList
- **Fichier** : `src/components/OfferList.tsx`
- Multi-marchands avec badges (best_price, best_availability, balanced_choice)
- Statut disponibilité (rupture, stock limité)
- `rel="noopener noreferrer sponsored"`

### P1.4 — ReformulationBlock
- **Fichier** : `src/components/ReformulationBlock.tsx`
- Résumé + boutons "C'est ça" / "Corriger"
- État loading

### P1.5 — SystemStates
- **Fichier** : `src/components/SystemStates.tsx`
- LoadingState, EmptyState, ErrorState, PartialMatchBanner
- Textes validés Cicéron

### P1.6 — Copy complète
- Tagline : "Le bon choix, sans le bruit."
- CTA : ✦ au lieu de ✨
- Metadata OG/Twitter mises à jour
- Hero subtitle : "Quelque part, le bon choix vous attend déjà."

---

## FICHIERS MODIFIÉS

```
frontend/src/app/categorie/[slug]/page.tsx    → fetch Supabase direct
frontend/src/app/page.tsx                      → copy hero, CTAs
frontend/src/app/layout.tsx                    → metadata OG
frontend/src/app/guide/page.tsx                → event handlers → CSS
frontend/src/app/resultats/[id]/page.tsx       → Amazon reflex → neutre
frontend/src/components/Header.tsx             → event handlers → CSS
frontend/src/components/Footer.tsx             → "use client" + CSS
frontend/src/components/HeroChatWidget.tsx     → loading messages + ✦
frontend/src/components/Top3List.tsx           → NOUVEAU
frontend/src/components/OfferList.tsx          → NOUVEAU
frontend/src/components/ReformulationBlock.tsx → NOUVEAU
frontend/src/components/SystemStates.tsx       → NOUVEAU
frontend/src/types/recommendation.ts           → types Offer/Recommendation/UIState
```

---

## VÉRIFICATION POST-DÉPLOIEMENT

| Check | Statut |
|---|---|
| `/categorie/aspirateur-robot` → 200 | ✅ |
| `/categorie/barre-de-son` → 200 | ✅ |
| `/categorie/smartphone` → 200 | ✅ |
| `/categorie/tv` → 200 | ✅ |
| `/guide` → 200 | ✅ |
| `/` → 200 | ✅ |
| `Picksy` occurrences dans le build | 0 ✅ |
| Tagline "Le bon choix, sans le bruit" dans le build | ✅ |
| Loading messages dans le build | ✅ |

---

*Fichier généré par Hermes Agent — déploiement des corrections Cicéron*
*Session : 2026-04-29 06:47 → 09:02 UTC*
