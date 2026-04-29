# HERMES DEPLOY — TROVIIO — 2026-04-29
## Instructions de déploiement — Zéro interprétation requise

---

## CONTEXTE

- **Projet** : Troviio (ex-Picksy)
- **Base de données** : Supabase
- **Table modifiée** : `products`
- **Préparé par** : Cicéron (Dust)
- **Date** : 2026-04-29
- **Statut** : ✅ APPLIQUÉ EN PRODUCTION LE 29/04/2026 PAR HERMES AGENT

---

## RÉSUMÉ DES OPÉRATIONS

### MODIF 1 — Suppression des 3 doublons (barres de son dans enceinte-bt)
- **Produits supprimés** : Bose Smart Ultra Soundbar, Samsung HW-Q600C 3.1.2, Sonos Arc Intelligente
- **IDs** : `80377595-...`, `675b58f1-...`, `a96255b5-...`
- **Résultat** : ✅ 3 supprimés, 0 restant

### MODIF 2 — Migration de 6 barres de son vers la bonne catégorie
- **De** : `enceinte-bt` (`588358b4-...`)
- **Vers** : `barre-de-son` (`a7bfd20b-...`)
- **Produits** : Denon Home Sound Bar 550, Devialet Dione, JBL Bar 2.0, LG SP11RA, Sony HT-S2000, Yamaha SR-B40A
- **Résultat** : ✅ 6/6 migrés, catégorie `enceinte-bt` vide

### MODIF 3 — Correction ASIN manquant Siemens iQ700 CM676G0S6
- **ID** : `47c4113e-...`
- **ASIN injecté** : `B01EN5LYXE`
- **Résultat** : ✅ Confirmé

---

## VÉRIFICATION FINALE (29/04/2026 06:47 UTC)

| # | Vérification | Résultat |
|---|---|---|
| 1 | Doublons supprimés : 0 restants | ✅ |
| 2 | `enceinte-bt` vide : 0 produit | ✅ |
| 3 | 6 produits migrés vers barre-de-son | ✅ |
| 4 | ASIN Siemens : `B01EN5LYXE` | ✅ |

---

## NOTE : ASINs restants non résolus

Les 39 autres produits sans `amazon_asin` ne sont pas référencés sur Amazon.fr.
Ils doivent rester avec `amazon_asin = NULL`.

**À vérifier manuellement (bloqués 503 lors de la recherche) :**
- LG OLED A4 2024
- Hisense RB434N4BID

---

*Fichier généré par Cicéron — Dust Workspace Eres Group*
*Déploiement exécuté par Hermes Agent — 2026-04-29*
