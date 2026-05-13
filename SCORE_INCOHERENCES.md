# Rapport d'Incohérences des Scores Produit Troviio

## Méthodologie

- Recherche de tous les fichiers TSX/TS dans `/root/troviio-ciceron/frontend/src/app/` contenant des scores hardcodés (pattern `XX/100`)
- Extraction des scores dans les fichiers statiques : **duels/** (pages individuelles), **tops/*** (pages individuelles), **guide-longtail/*** (pages individuelles)
- Comparaison avec les scores dynamiques de la base Supabase (`estimated_score` dans la table `products`)
- Les pages dynamiques (`/produit/[slug]`, `/c/[slug]`, `/tops/[slug]`) utilisent `product.estimated_score` depuis la DB

---

## RÉSUMÉ — 22 PRODUITS AVEC SCORES INCOHÉRENTS

| # | Produit | Score DB (réalité) | Score Hardcodé (page) | Source Hardcodée | Écart |
|---|---------|-------------------|----------------------|-----------------|-------|
| 1 | **Vorwerk Thermomix TM7** | **67** | **96** | duel/thermomix-tm7-vs-kitchenaid-artisan | **+29 pts** |
| 2 | **KitchenAid Artisan 5KSM175** | **88** | **91** | duel/thermomix-tm7-vs-kitchenaid-artisan | **+3 pts** |
| 3 | **Apple iPad Pro M5 11"** | **76** | **96** | duel/ipad-pro-m5... + tops (N/A) | **+20 pts** |
| 4 | **Samsung Galaxy Tab S11 Ultra** | **74** | **91** | duel/ipad-pro-m5... | **+17 pts** |
| 5 | **Dyson Gen5 Detect Absolute** | **90** | **96** | duel/dyson-gen5-detect... + tops | **+6 pts** |
| 6 | **Samsung Bespoke AI Jet Ultra** | **88** | **93** | duel/dyson-gen5-detect... + tops | **+5 pts** |
| 7 | **Wooting 80HE** | **77** | **93** | duel/wooting-80he... + tops | **+16 pts** |
| 8 | **Lemokey P1 HE** | **64** | **90** | duel/wooting-80he... | **+26 pts** |
| 9 | **Ninja Foodi FlexDrawer AF500EU** | **70** | **94** | duel/ninja-foodi-flexdrawer... | **+24 pts** |
| 10 | **Cosori TurboBlaze 6L** | **83** | **91** | duel/ninja-foodi-flexdrawer... | **+8 pts** |
| 11 | **Flexispot E7 Pro** | **81** | **91** | duel/flexispot-e7-pro... + tops | **+10 pts** |
| 12 | **Secretlab MAGNUS Pro** | **64** | **89** | duel/flexispot-e7-pro... | **+25 pts** |
| 13 | **Miele WCR870 WPS** | **81.3** | **94** | duel/miele-wcr870... | **+12.7 pts** |
| 14 | **Bosch WGB244A2FR** | **73** | **91** | duel/miele-wcr870... | **+18 pts** |
| 15 | **Hypnia Bien-Être Supreme** | **92** | **90** | duel/hypnia-bien-etre-supreme... | **-2 pts** |
| 16 | **Emma Original Hybrid II** | **85** | **89** | duel/hypnia-bien-etre-supreme... | **+4 pts** |
| 17 | **It Takes Two** | **87** | **98** | duel/it-takes-two... | **+11 pts** |
| 18 | **Split Fiction** | **85** | **97** | duel/it-takes-two... | **+12 pts** |
| 19 | **LG G6 OLED 65"** | **74** | **95** | tops/meilleure-tv | **+21 pts** |
| 20 | **Samsung S95H 65" QD-OLED** | **70** | **94** | tops/meilleure-tv | **+24 pts** |
| 21 | **LG C6 OLED 65"** | **72** | **93** | tops/meilleure-tv | **+21 pts** |
| 22 | **Sony Bravia 8 II 65"** | **85** | **90** | tops/meilleure-tv | **+5 pts** |

---

## INCOHÉRENCES PAR PAGE (DÉTAIL)

### 1. DUEL : Thermomix TM7 vs KitchenAid Artisan
**Fichier :** `/frontend/src/app/duel/thermomix-tm7-vs-kitchenaid-artisan/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Thermomix TM7 | 67 | 96 | **+29** ⚠️ |
| KitchenAid Artisan | 88 | 91 | +3 |

### 2. DUEL : iPad Pro M5 vs Galaxy Tab S11 Ultra
**Fichier :** `/frontend/src/app/duel/ipad-pro-m5-11-vs-samsung-galaxy-tab-s11-ultra/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| iPad Pro M5 11" | 76 | 96 | **+20** ⚠️ |
| Galaxy Tab S11 Ultra | 74 | 91 | **+17** ⚠️ |

### 3. DUEL : Dyson Gen5 Detect vs Samsung Bespoke AI Jet
**Fichier :** `/frontend/src/app/duel/dyson-gen5-detect-vs-samsung-bespoke-jet/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Dyson Gen5 Detect | 90 | 96 | +6 |
| Samsung Bespoke AI Jet | 88 | 93 | +5 |

### 4. DUEL : Wooting 80HE vs Lemokey P1 HE
**Fichier :** `/frontend/src/app/duel/wooting-80he-vs-lemokey-p1-he/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Wooting 80HE | 77 | 93 | **+16** ⚠️ |
| Lemokey P1 HE | 64 | 90 | **+26** ⚠️ |

### 5. DUEL : Ninja Foodi FlexDrawer vs Cosori TurboBlaze
**Fichier :** `/frontend/src/app/duel/ninja-foodi-flexdrawer-vs-cosori-turboblaze/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Ninja Foodi FlexDrawer AF500EU | 70 | 94 | **+24** ⚠️ |
| Cosori TurboBlaze 6L | 83 | 91 | +8 |

### 6. DUEL : Flexispot E7 Pro vs Secretlab MAGNUS Pro
**Fichier :** `/frontend/src/app/duel/flexispot-e7-pro-vs-secretlab-magnus-pro/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Flexispot E7 Pro | 81 | 91 | +10 |
| Secretlab MAGNUS Pro | 64 | 89 | **+25** ⚠️ |

### 7. DUEL : Miele WCR870 vs Bosch WGB244A2FR
**Fichier :** `/frontend/src/app/duel/miele-wcr870-vs-bosch-wgb244a2fr/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Miele WCR870 WPS | 81.3 | 94 | +12.7 ⚠️ |
| Bosch WGB244A2FR | 73 | 91 | **+18** ⚠️ |

### 8. DUEL : Hypnia Bien-Être Supreme vs Emma Original
**Fichier :** `/frontend/src/app/duel/hypnia-bien-etre-supreme-vs-emma-original/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Hypnia Bien-Être Supreme | 92 | 90 | -2 |
| Emma Original Hybrid II | 85 | 89 | +4 |

### 9. DUEL : It Takes Two vs Split Fiction
**Fichier :** `/frontend/src/app/duel/it-takes-two-vs-split-fiction/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| It Takes Two | 87 | 98 | **+11** ⚠️ |
| Split Fiction | 85 | 97 | **+12** ⚠️ |

### 10. DUEL : Silvercrest Monsieur Cuisine Smart vs Magimix Cook Expert
**Fichier :** `/frontend/src/app/duel/silvercrest-monsieur-cuisine-smart-vs-magimix-cook-expert-premium-xl/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Silvercrest Monsieur Cuisine Smart | 77 | 77 | ✅ OK |
| Magimix Cook Expert Premium XL | 77 | 77 | ✅ OK |

### 11. TOPS : Meilleure TV
**Fichier :** `/frontend/src/app/tops/meilleure-tv/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| LG G6 OLED 65" | 74 | 95 | **+21** ⚠️ |
| Samsung S95H QD-OLED 65" | 70 | 94 | **+24** ⚠️ |
| LG C6 OLED 65" | 72 | 93 | **+21** ⚠️ |
| Sony Bravia 8 II OLED 65" | 85 | 90 | +5 |

### 12. TOPS : Meilleur Casque Audio
**Fichier :** `/frontend/src/app/tops/meilleur-casque-audio/page.tsx`
- Aucun score numérique hardcodé — ✅ pas d'incohérence

### 13. TOPS : Meilleur Robot Cuisine
**Fichier :** `/frontend/src/app/tops/meilleur-robot-cuisine/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Thermomix TM7 | 67 | 96 | **+29** ⚠️ |
| KitchenAid Artisan | 88 | 91 | +3 |
| Magimix Cook Expert XL | 77 | 88? (line 108: 88/100) | +11 ⚠️ |
| Kenwood Cooking Chef Gourmet | N/A | 82 | N/A |

### 14. TOPS : Meilleur Aspirateur Balai
**Fichier :** `/frontend/src/app/tops/meilleur-aspirateur-balai/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Dyson Gen5 Detect Absolute | 90 | 96 | +6 |
| Samsung Bespoke AI Jet Ultra | 88 | 93 | +5 |
| Dyson V15 Detect Absolute | 72 | 91 | **+19** ⚠️ |

### 15. TOPS : Meilleur Aspirateur Robot
**Fichier :** `/frontend/src/app/tops/meilleur-aspirateur-robot/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Dreame X50 Ultra (non trouvé) | N/A | 96 | Vérifier slug |
| Roborock Qrevo Curv 2 Pro (non trouvé) | N/A | 94 | Vérifier slug |
| Roborock S8 MaxV Ultra | 73 | 93 | **+20** ⚠️ |

### 16. TOPS : Meilleure Friteuse Air
**Fichier :** `/frontend/src/app/tops/meilleure-friteuse-air/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Ninja Foodi (non trouvé exact) | 70 (FlexDrawer) | 94 | **+24** ⚠️ |
| Cosori (non trouvé exact) | 83 (TurboBlaze) | 91 | +8 |

### 17. TOPS : Meilleur Clavier Gaming
**Fichier :** `/frontend/src/app/tops/meilleur-clavier-gaming/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Wooting 80HE | 77 | 93 | **+16** ⚠️ |
| Keychron Q5 Max | 72 | 91 | **+19** ⚠️ |
| Lemokey P1 HE | 64 | 90 | **+26** ⚠️ |

### 18. TOPS : Meilleur Bureau Électrique
**Fichier :** `/frontend/src/app/tops/meilleur-bureau-electrique/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Flexispot E7 Pro | 81 | 91 | +10 |
| Secretlab MAGNUS Pro | 64 | 89 | **+25** ⚠️ |
| Desktronic HomePro | 79 | 88 | +9 |

### 19. TOPS : Meilleure Machine à Café
**Fichier :** `/frontend/src/app/tops/meilleure-machine-a-cafe/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Jura E8 Piano Black | 93 | 92 | -1 ✅ quasi OK |
| Technivorm Moccamaster KBG Select | 94 | 91 | -3 |
| Sage Barista Express Impress | 92 | 90 | -2 |
| Philips Series 5400 | 90 | 87 | -3 |

### 20. TOPS : Meilleure Station Accueil USB-C
**Fichier :** `/frontend/src/app/tops/meilleure-station-accueil-usbc/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| CalDigit TS5 Plus | 95 | 95 | ✅ OK |
| Plugable Thunderbolt 4 Dock | 87 | 87 | ✅ OK |
| StarTech Thunderbolt 4 | 85 | 85 | ✅ OK |
| Kensington SD4842P EQ | 82 | 82 | ✅ OK |

### 21. TOPS : Meilleure Voiture Électrique
**Fichier :** `/frontend/src/app/tops/meilleure-voiture-electrique/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Tesla Model Y Juniper | 73 | 85 | +12 ⚠️ |
| Tesla Model 3 Highland | 70 | 80 | +10 |
| BMW iX3 Neue Klasse | 61 | 78 | +17 ⚠️ |
| VW ID.7 | 58 | 65 | +7 |

### 22. TOPS : Meilleure Montre Connectée
**Fichier :** `/frontend/src/app/tops/meilleure-montre-connectee/page.tsx`
| Produit | DB | Hardcodé | Δ |
|---------|-----|----------|---|
| Garmin Fenix 8 | 73 | 85 | +12 ⚠️ |
| Apple Watch Ultra 2 | 73 | 81 | +8 |
| Samsung Galaxy Watch Ultra | 77 | 71 | -6 |
| Google Pixel Watch 3→4 | 76 (4) | 65 | -11 |

### 23. GUIDES LONGTail (pages statiques)
Les guides longtail ont aussi des scores hardcodés dans leurs descriptions (ex: Delonghi 88/100, Jura 95/100, etc.) mais les slugs de produits n'ont pas pu être tous retrouvés en DB pour vérification.

---

## PRODUITS CONSISTANTS (✅ Scores corrects)

| Produit | Page | DB | Hardcodé |
|---------|------|-----|----------|
| Silvercrest Monsieur Cuisine Smart | duel | 77 | 77 |
| Magimix Cook Expert Premium XL | duel | 77 | 77 |
| CalDigit TS5 Plus Thunderbolt 5 Dock | tops | 95 | 95 |
| Plugable Thunderbolt 4 Dock TBT4-UD5 | tops | 87 | 87 |
| StarTech Thunderbolt 4 Quad Display Dock | tops | 85 | 85 |
| Kensington SD4842P EQ | tops | 82 | 82 |

---

## CAUSE RACINE

Tous les fichiers de **duels**, **tops individuels** (statiques), et **guides longtail individuels** (statiques) contiennent des scores **hardcodés directement dans le JSX** sous forme de chaînes de caractères (ex: `"96/100"`). Ces scores ont été écrits manuellement lors de la génération des pages et **ne sont pas liés dynamiquement à la base de données Supabase**.

Les pages dynamiques (`/produit/[slug]`, `/c/[slug]`, `/tops/[slug]`) utilisent `estimated_score` depuis Supabase et sont correctes.

### Pages affectées (statiques avec scores hardcodés)
- `frontend/src/app/duel/*/page.tsx` (tous les 25 duels)
- `frontend/src/app/tops/meilleure-*/page.tsx` (sauf meilleur-casque-audio qui n'affiche pas de score numérique)
- `frontend/src/app/guide-longtail/*/*/page.tsx` (pages individuelles — à vérifier)

### Pages non affectées (dynamiques depuis la DB)
- `frontend/src/app/produit/[slug]/page.tsx` ✅
- `frontend/src/app/produit/[slug]/product-client.tsx` ✅
- `frontend/src/app/tops/[slug]/page.tsx` ✅
- `frontend/src/app/c/[slug]/page.tsx` ✅
- `frontend/src/app/categorie/[slug]/page.tsx` ✅
- `frontend/src/app/guide-longtail/[category]/[page]/page.tsx` ✅ (dynamique)

---

## ACTIONS RECOMMANDÉES

1. **Priorité haute** — Mettre à jour les scores hardcodés dans les 25 pages de duel avec les valeurs actuelles de Supabase
2. **Priorité haute** — Mettre à jour les scores hardcodés dans les pages tops individuelles statiques (meilleure-tv, meilleur-aspirateur-robot, etc.)
3. **Priorité moyenne** — Remplacer les scores hardcodés par des appels dynamiques à la DB (passer les pages en `force-dynamic` ou les hydrater côté client)
4. **Priorité basse** — Vérifier les guides longtail statiques dont certains slugs de produits n'existent pas dans la DB
