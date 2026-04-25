# 🎨 PICKSY — CHARTE VISUELLE COMPLÈTE V1.0
> Document de référence brand & design system — Avril 2026
> À destination de : Hermes Agent (DeepSeek V4 Pro)
> Auteur : Conseil Cicéron (Gemini Pro + GPT-5 + Mistral + Deep Dive)

---

## 🧠 CONCEPT CRÉATIF

### L'idée centrale : "Complexity made playful"

Picksy est un **compagnon intelligent qui simplifie les choix du quotidien**. Chaque recommandation est présentée comme une petite victoire. L'interface transforme un acte banal (comparer des produits maison) en une expérience gratifiante et ludique.

### Les 3 piliers du design

1. **Score-first** — Le score de recommandation est toujours l'élément LE PLUS VISIBLE d'un écran
2. **Warm tech** — La technologie IA est habillée de couleurs chaudes et micro-interactions douces
3. **Earned trust** — Chaque donnée renforce la confiance par la transparence (sources visibles, scores décomposés)

### Moodboard — 6 références

| Référence | Ce qu'on retient |
|-----------|-----------------|
| **Duolingo** | Gamification joyeuse, progression visible, micro-récompenses |
| **Opal** | Rings circulaires élégants, palette sombre + accents vifs |
| **Arc Browser** | Couleur comme système de navigation, modernité épurée |
| **Airbnb** | Chaleur des photos, cards généreuses, transitions fluides |
| **Monzo** | Confiance par transparence des données, design rigoureux |
| **Nike SNKRS** | Cards immersives, sentiment de découverte et d'exclusivité |

### Ce que Picksy DOIT vs NE DOIT PAS ressentir

| ✅ DOIT | ❌ NE DOIT PAS |
|---------|---------------|
| Chaleureux, ami qui conseille | Froid, comparateur de prix |
| Ludique, chaque action a un feedback | Passif, catalogue statique |
| Fiable, scores inspirent confiance | Opaque, notes incompréhensibles |
| Moderne et premium | Cheap ou surchargé |
| Simple, compris en 2 secondes | Complexe, trop d'options |

---

## 🎨 PALETTE DE COULEURS

### Couleurs principales

| Nom | Hex | Usage |
|-----|-----|-------|
| **Coral Pop** | `#FF6B5F` | CTA, scores élevés, énergie, action primaire |
| **Mint Smart** | `#3ED6A3` | Succès, validation, recommandations positives |
| **Blueberry Trust** | `#4257FF` | IA, liens, éléments interactifs, données |
| **Cream Home** | `#FFF7ED` | Background principal mode clair |
| **Ink Soft** | `#161827` | Texte principal mode clair, bg mode sombre |
| **Night Home** | `#0E1020` | Background profond mode sombre |

### Nuances Coral Pop

| Nuance | Hex | Usage |
|--------|-----|-------|
| 50 | `#FFF1F0` | Background alertes légères |
| 100 | `#FFE0DD` | Background badges Tendance |
| 300 | `#FFA39D` | Bordures focus |
| **500** | **`#FF6B5F`** | **CTA principal** |
| 600 | `#E5554A` | Pressed state |
| 700 | `#BF3F36` | Texte accessible sur fond clair |

### Nuances Mint Smart

| Nuance | Hex | Usage |
|--------|-----|-------|
| 50 | `#EDFCF5` | Background succès léger |
| **500** | **`#3ED6A3`** | **Succès, badges positifs, checkmarks** |
| 600 | `#2EB882` | Hover éléments succès |
| 700 | `#219966` | Texte succès accessible |

### Nuances Blueberry Trust

| Nuance | Hex | Usage |
|--------|-----|-------|
| 50 | `#EEEEFF` | Background info légère |
| **500** | **`#4257FF`** | **Liens, IA indicator** |
| 700 | `#2835B7` | Texte lien accessible |

### Mode sombre

| Token | Hex |
|-------|-----|
| Background | `#0C0E18` |
| Surface | `#161827` |
| Surface elevated | `#242634` |
| Text primary | `#FFF7ED` |
| Border | `#2B2E3D` |

### Gradients signature

| Nom | CSS | Usage |
|-----|-----|-------|
| Coral Intelligence | `linear-gradient(135deg, #FF6B5F 0%, #FFB067 100%)` | CTA principal, score ring |
| Mint Confidence | `linear-gradient(135deg, #3ED6A3 0%, #9AF7D4 100%)` | Score élevé, succès |
| Blue AI | `linear-gradient(135deg, #4257FF 0%, #8A7CFF 100%)` | IA, données |
| Hero | `linear-gradient(135deg, #FF6B5F 0%, #FFB020 42%, #3ED6A3 100%)` | Landing, gradient text |
| Night Glow | `linear-gradient(135deg, #0E1020 0%, #1A1C3A 100%)` | Splash screen |

### Règles d'utilisation

- **Coral Pop** : max 2 éléments visibles simultanément (hors score ring). Jamais en arrière-plan.
- **Mint Smart** : réservé aux états positifs uniquement. Jamais pour navigation ou CTA.
- **Blueberry Trust** : tout ce qui est lié à l'IA et aux éléments interactifs secondaires.

### Combinaisons interdites

- ❌ Coral Pop sur Mint Smart (vibration optique)
- ❌ Mint Smart texte sur Cream Home (contraste insuffisant)
- ❌ Blueberry Trust sur Coral Pop (illisible)

### Accessibilité WCAG

| Combinaison | Ratio | Niveau |
|-------------|-------|--------|
| Ink Soft sur Cream Home | 15.2:1 | AAA |
| Coral 700 sur White | 7.2:1 | AAA |
| Blueberry 500 sur White | 4.6:1 | AA |
| White sur Ink Soft | 15.2:1 | AAA |

---

## 🔤 TYPOGRAPHIE

### Familles

| Rôle | Police | Import Google Fonts |
|------|--------|---------------------|
| **Titres** | **Sora** | `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&display=swap')` |
| **Corps** | **Inter** | `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap')` |
| **Scores/Prix** | **Nunito** | `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&display=swap')` |

### Hiérarchie Mobile

| Token | Police | Taille | Poids | Line-height | Usage |
|-------|--------|--------|-------|-------------|-------|
| `display-lg` | Sora | 32px | 700 | 38px | Titre écran principal |
| `heading-lg` | Sora | 20px | 600 | 26px | Card featured title |
| `heading-md` | Sora | 18px | 600 | 24px | Card standard title |
| `body-md` | Inter | 14px | 400 | 21px | Corps secondaire |
| `body-sm` | Inter | 12px | 400 | 18px | Captions |
| `label-lg` | Inter | 16px | 600 | 20px | Bouton CTA |
| `score-lg` | Nunito | 36px | 800 | 40px | Score ring principal |
| `price` | Nunito | 20px | 800 | 24px | Prix produit |

### Hiérarchie Desktop

| Token | Police | Taille | Poids |
|-------|--------|--------|-------|
| `display-lg` | Sora | 48px | 700 |
| `heading-lg` | Sora | 24px | 600 |
| `body-lg` | Inter | 18px | 400 |
| `score-lg` | Nunito | 48px | 800 |

### Règles strictes

- **Sora** : jamais en dessous de 16px. Toujours SemiBold ou Bold. Uniquement pour les titres.
- **Inter** : tout le texte de lecture. Jamais en Bold (700), max SemiBold (600) pour emphase.
- **Nunito** : exclusivement les éléments numériques gamifiés (scores, prix, compteurs).
- **Capitalization** : Sentence case partout (première lettre uniquement). UPPERCASE si ≤ 2 mots en `label-sm`.

---

## 🎮 SYSTÈME DE GAMIFICATION

### Score Ring — L'élément iconique de Picksy

Anneau circulaire SVG qui se remplit proportionnellement au score (0–100).

#### Couleurs selon le score

| Plage | Couleur | Label |
|-------|---------|-------|
| 0–39 | `#FF6B5F` Coral | À éviter |
| 40–59 | `#FFB347` Amber | Correct |
| 60–79 | `#4257FF` Blue | Bon choix |
| 80–100 | `#3ED6A3` Mint | Excellent |

> **Note** : Amber `#FFB347` est utilisé UNIQUEMENT pour le score ring. Nulle part ailleurs.

#### 3 tailles

| Taille | Diamètre | Stroke | Font | Usage |
|--------|----------|--------|------|-------|
| Large | 120px | 10px | Nunito 36px | Détail produit, hero |
| Medium | 64px | 6px | Nunito 24px | Card standard |
| Small | 40px | 4px | Nunito 16px | Card compact, liste |

#### SVG Template (Medium 64px)

```svg
<svg width="64" height="64" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="28" fill="none"
          stroke="#F0EDE8" stroke-width="6" />
  <circle cx="32" cy="32" r="28" fill="none"
          stroke="#3ED6A3" stroke-width="6"
          stroke-linecap="round"
          stroke-dasharray="175.93"
          stroke-dashoffset="22.87"
          transform="rotate(-90 32 32)" />
  <text x="32" y="32" text-anchor="middle"
        dominant-baseline="central"
        font-family="Nunito" font-weight="700"
        font-size="24" fill="#161827">87</text>
</svg>
```

> `stroke-dashoffset = circumference × (1 - score/100)`
> Toujours commencer à 12h (`rotate(-90 cx cy)`)

### Les 5 Badges Picksy

| Badge | Emoji | Fond | Texte |
|-------|-------|------|-------|
| **Choix Expert** | 👑 | `#EEEEFF` | `#4257FF` |
| **Rapport Q/P** | 💎 | `#EDFCF5` | `#219966` |
| **Fiable** | 🛡️ | `#FFF1F0` | `#BF3F36` |
| **Tendance** | 🔥 | `#FFE0DD` | `#FF6B5F` |
| **Nouveau** | ✨ | `#D9DCFF` | `#3545DB` |

**Spécifications badge** : height 28–32px, padding 6–8px 10–12px, border-radius 8px, font `label-sm`

### Système de Niveaux Utilisateur

| Niveau | Nom | Emoji | Seuil | Couleur |
|--------|-----|-------|-------|---------|
| 1 | Novice | 🌱 | 0 actions | Gray 400 |
| 2 | Curieux | 🔍 | 10 produits | Blue 300 |
| 3 | Connaisseur | ⭐ | 50 produits | Blue 500 |
| 4 | Expert | 🏆 | 200 produits | Coral 500 |
| 5 | Picksy Pro | 💜 | 500 produits | Gradient |

### Micro-récompenses

| Déclencheur | Feedback |
|-------------|----------|
| 1er produit consulté | Confetti léger |
| Badge débloqué | Badge pop + shimmer |
| Niveau atteint | Full confetti + modal |
| 10ème produit du jour | Toast "🔥 On fire !" |

---

## 📦 COMPOSANTS UI — SPÉCIFICATIONS

### Bouton CTA

| État | Background | Texte | Shadow | Radius |
|------|-----------|-------|--------|--------|
| Default | `#FF6B5F` | White | `0 2px 8px rgba(255,107,95,0.3)` | 14px |
| Pressed | `#E5554A` | White | réduite | scale 0.98 |
| Disabled | `#F0EDE8` | `#B0AAA2` | aucune | 14px |
| Secondary | transparent | `#161827` | aucune | 14px, border 1.5px |

- **Hauteur** : 52px mobile, 48px desktop
- **Padding** : 0 24px
- **Font** : Inter SemiBold 16px

### Input Recherche

- Hauteur : 48px
- Background : `#FFFFFF`
- Border : 1.5px solid `#F0EDE8`
- Border-radius : 12px
- Focus : border `#4257FF` + shadow `0 0 0 3px rgba(66,87,255,0.12)`
- Icône loupe : 20px, `#B0AAA2`, left 12px

### Cards Produits — 3 variantes

#### Compact
- Hauteur : ~88px, layout horizontal
- Image : 64×64px, radius 8px
- Score ring : Small (40px), aligné droite
- Radius card : 12px

#### Standard
- Largeur : 50% du container (grille 2 col)
- Image : ratio 4:3, pleine largeur
- Score ring : Medium (64px), aligné gauche
- Radius card : 16px

#### Featured
- Largeur : 100%
- Image : ratio 16:9, pleine largeur
- Score ring : Large (120px)
- Badges en overlay sur l'image
- CTA bouton pleine largeur
- Radius : 20px

### Navigation Bar (mobile)

- Hauteur : 56px + safe area top
- Background : `#FFFFFF` backdrop-filter blur(16px) opacity 92%
- Shadow : `0 1px 0 rgba(22,24,39,0.06)`
- Titre : Sora SemiBold 16px, centré

### Tab Bar (app)

- 5 onglets : Accueil, Recherche, Pour toi, Favoris, Profil
- Hauteur : 56px + safe area bottom
- Icônes inactives : `#B0AAA2`
- Icône active : `#FF6B5F` + label coral
- Indicateur : pastille 4×24px `#FF6B5F` au-dessus de l'icône

### Toast / Snackbar

- Background : `#161827`
- Texte : white, Inter Medium 14px
- Radius : 12px
- Shadow : `0 8px 24px rgba(14,16,32,0.2)`
- Durée : 3s (info), 5s (action)
- Animation : slide-up 300ms + fade

### Skeleton Loading

- Base : `#FFE8C9` à 60% opacité
- Animation : shimmer horizontal, 1.5s infinite
- Radius : identique aux composants

---

## 🎬 MOTION DESIGN

### Durées standard

| Token | Durée | Usage |
|-------|-------|-------|
| instant | 0ms | Toggle couleur sans transition |
| fast | 150ms | Hover, pressed states |
| normal | 300ms | Transitions composants |
| slow | 500ms | Score ring, progressions |
| very-slow | 800ms | Célébrations, onboarding |

### Easings recommandés

| Token | CSS | Usage |
|-------|-----|-------|
| ease-default | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Usage général |
| ease-out | `cubic-bezier(0, 0, 0.58, 1)` | Entrées à l'écran |
| ease-spring | `cubic-bezier(0.32, 0.72, 0, 1)` | Bottom sheets, modals |
| ease-bounce | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Badges pop, confetti |
| ease-smooth | `cubic-bezier(0.4, 0, 0.2, 1)` | Score ring fill |

### 8 Animations Signature Picksy

#### 1. Score Ring Fill
- Durée : 800ms, `ease-smooth`
- Delay : 200ms après apparition card
- stroke-dashoffset de `circumference` → valeur cible
- Chiffre central count-up en sync

#### 2. Card Apparition (Stagger)
- Durée : 300ms par card, `ease-out`
- Stagger : 50ms entre cards (max 8)
- Transform : `translateY(16px)` + `opacity:0` → `translateY(0)` + `opacity:1`

#### 3. Badge Pop
- Durée : 400ms, `ease-bounce`
- Séquence : `scale(0)` → `scale(1.15)` → `scale(1)`
- + rotation légère -3° → 0°

#### 4. Prix Update Flash
- Duration : 600ms total
- Flash background coral-50 → scale 1.1 → scale 1 du nouveau prix
- Ancien prix barré apparaît en fade

#### 5. Scroll Parallax
- Vitesse : 0.3× la vitesse du scroll
- Via requestAnimationFrame

#### 6. Transition Pages
- Type : Shared Element (image produit)
- Durée : 350ms, `ease-spring`

#### 7. Confetti Victoire
- 40 particules (bon achat), 80 (niveau atteint)
- Couleurs : Coral, Mint, Blue, Amber
- 1200ms, gravité + vélocité horizontale aléatoire

#### 8. Pulse IA
- 3 rings concentriques qui s'étendent et s'estompent
- Ring 1 : scale 1→2, opacity 0.4→0, 1.5s infinite
- Ring 2 : delay 0.5s | Ring 3 : delay 1.0s
- Centre : oscillation 0.95→1.05, 2s

---

## 📐 GRILLES ET ESPACEMENTS

### Grilles

| Breakpoint | Colonnes | Marge | Gouttière |
|-----------|---------|-------|-----------|
| Mobile < 768px | 4 | 16px | 8px |
| Tablet 768-1023px | 8 | 24px | 12px |
| Desktop ≥ 1024px | 12 | 40-80px | 16px |
| Max-width | — | — | 1280px |

### Spacing (base 4px)

| Token | Valeur |
|-------|--------|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-6 | 24px |
| space-8 | 32px |
| space-12 | 48px |
| space-16 | 64px |

### Safe Areas

| Plateforme | Top | Bottom |
|-----------|-----|--------|
| iOS Face ID | 47px status + nav | 34px home indicator |
| Android | 24px | 48px nav ou 16px gesture |

---

## 🖼️ LOGO — CONCEPT ET IMPLÉMENTATION

### Le concept : La Maison-P

Le tracé vectoriel dessine de manière continue le **toit d'une maison** et la lettre **"P"** de Picksy. À l'intérieur, une **étincelle** (Sparkle) symbolise l'intelligence artificielle.

- **Couleur symbole** : gradient Coral → Mint (diagonal 135°)
- **Couleur étincelle IA** : Blueberry Trust `#4257FF`
- **Typographie wordmark** : Sora Bold, letter-spacing -1px

### Code SVG Icon Only (100×100)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B5F"/>
      <stop offset="100%" stop-color="#3ED6A3"/>
    </linearGradient>
  </defs>
  <path d="M 28 85 V 38 L 50 18 L 72 38 V 48 C 72 60, 62 68, 50 68 H 28"
        fill="none" stroke="url(#g)" stroke-width="10"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 50 43 C 50 49, 46 53, 40 53 C 46 53, 50 57, 50 63
           C 50 57, 54 53, 60 53 C 54 53, 50 49, 50 43 Z"
        fill="#4257FF"/>
</svg>
```

### Versions du logo

| Version | Fichier | Usage |
|---------|---------|-------|
| Couleur | `logo-color.svg` | Usage principal, fond clair |
| Blanc | `logo-white.svg` | Fonds sombres |
| Noir | `logo-black.svg` | Impression N&B |
| Gradient | `logo-gradient.svg` | Marketing, splash |
| Icon only | `icon-color.svg` | App icon, favicon |

### Zones d'exclusion

- Espace minimum : 1x (= hauteur du "P") autour du logo
- Icon seul : 0.5x sur chaque côté

### Tailles minimales

| Format | Taille |
|--------|--------|
| Icon seul (écran) | 32px × 32px |
| Logo horizontal | 120px largeur |

### Utilisations interdites

- ❌ Étirer ou déformer
- ❌ Rotation
- ❌ Effets (ombre, glow, bevel)
- ❌ Changer les couleurs hors des 4 versions
- ❌ Placer sur fond photographique sans overlay
- ❌ Entourer d'un conteneur (cercle, carré)

---

## 🖼️ IMAGERY ET ICÔNES

### Photos produit

| Règle | Spec |
|-------|------|
| Fond | Blanc `#FFFFFF` ou transparent (PNG) |
| Ombre | `0 4px 12px rgba(22,24,39,0.08)` |
| Ratios | 1:1 (compact), 4:3 (standard), 16:9 (featured) |
| Format | WebP, qualité 85%, max 200KB mobile |

### Icônes

- Style : **Outline uniquement** (pas de filled en V1)
- Stroke : **2px**
- Corners : **Rounded**
- Taille défaut : **24px** (viewbox 24×24)
- Couleur défaut : `#161827`
- Set recommandé : **Lucide Icons** (open source)
- Format : SVG inline

### 12 Icônes requises

```
1. Robot aspirateur — circle + arc + small circle center
2. TV OLED — rect + pieds + câble
3. Machine à café — rect + shelf + bec + reservoir
4. Étoile (Score) — polygon 5 branches
5. Comparaison — flèches bi-directionnelles
6. Budget/Prix — tag avec trou
7. IA/Magie — sparkle 4 branches + mini sparkles
8. Notification — cloche
9. Profil utilisateur — silhouette
10. Recherche — loupe
11. Favoris — bookmark
12. Partager — 3 cercles connectés
```

### Emojis autorisés (liste fermée)

`👑 💎 🛡️ 🔥 ✨ 🌱 🔍 ⭐ 🏆 💜 🛒 👋 🎉 💡`
> Tout autre emoji est interdit dans l'interface.

---

## 📱 SPLASH SCREEN

- **Background** : Night Home `#0E1020`
- **Logo** : version gradient, centré
- **Taille logo** : 120px × 120px (icon only)
- **Pas de texte** sur le splash
- **Animation** : Pulse IA pendant 1.5s, puis transition vers onboarding

---

## 🎬 ONBOARDING — 3 ÉCRANS

| Écran | Titre | Sous-titre | Illustration |
|-------|-------|-----------|--------------|
| 1 | "Découvre sans effort" | "Picksy analyse des centaines de produits pour toi" | Téléphone + cards qui s'envolent, style flat coral |
| 2 | "Des scores qui parlent" | "Comprends en un coup d'œil si c'est le bon choix" | Score ring animé + badges autour |
| 3 | "Deviens un expert" | "Plus tu explores, plus tu gagnes des badges" | Avatar + confetti + trophée |

---

## 📋 LISTE COMPLÈTE DES ASSETS À GÉNÉRER

### Favicons (7 fichiers)
```
favicon.ico           (16×16, 32×32, 48×48 multi-res)
favicon-16x16.png
favicon-32x32.png
favicon-32x32.svg
apple-touch-icon.png  (180×180)
safari-pinned-tab.svg (monochrome)
mstile-150x150.png
```

### App Icons iOS (11 fichiers)
```
AppIcon-20@2x.png   (40×40)
AppIcon-20@3x.png   (60×60)
AppIcon-29@2x.png   (58×58)
AppIcon-29@3x.png   (87×87)
AppIcon-40@2x.png   (80×80)
AppIcon-40@3x.png   (120×120)
AppIcon-60@2x.png   (120×120)
AppIcon-60@3x.png   (180×180)
AppIcon-76@2x.png   (152×152)
AppIcon-83.5@2x.png (167×167)
AppIcon-1024.png    (1024×1024 — App Store)
```
> Sans coins arrondis. Fond : gradient Coral→Blueberry. Icon "P" blanc centré.

### App Icons Android (14 fichiers)
```
ic_launcher-mdpi.png       (48×48)
ic_launcher-hdpi.png       (72×72)
ic_launcher-xhdpi.png      (96×96)
ic_launcher-xxhdpi.png     (144×144)
ic_launcher-xxxhdpi.png    (192×192)
ic_launcher_round-*.png    (mêmes 5 tailles)
ic_launcher_foreground.png (432×432 — "P" blanc, safe zone 66%)
ic_launcher_background.png (432×432 — gradient Coral→Blueberry)
```

### Social / OG (3 fichiers)
```
og-image.png         (1200×630 — Logo + tagline sur Cream Home)
og-image-twitter.png (1200×600)
og-image-square.png  (1200×1200)
```

### Splash (2 configs)
```
LaunchScreen.storyboard  (iOS — bg Night Home, logo gradient centré)
splash_screen.xml        (Android — bg Night Home, icon 128dp)
```

### Onboarding SVG (3 illustrations)
```
onboarding-1.svg  (375×300 — téléphone + cards flat coral)
onboarding-2.svg  (375×300 — score ring + badges)
onboarding-3.svg  (375×300 — avatar + confetti + trophée)
```

### Logo SVG (8 fichiers)
```
logo-color.svg
logo-white.svg
logo-black.svg
logo-gradient.svg
icon-color.svg
icon-white.svg
icon-black.svg
icon-gradient.svg
```

### Icônes SVG (39 icônes)
```
Navigation : home, search, lightbulb, heart, user
Actions : arrow-left, share, bookmark, filter, sort, close,
          check, plus, minus, chevron-down, chevron-right, external-link
Produit : star, star-half, tag, truck, shield-check, clock, trending-up, zap
Badges : crown, scale, shield, flame, sparkle
Social : link-copy, twitter, facebook, whatsapp
Système : info, warning, error, success, loader
```

**Total : ~87 fichiers assets**

---

## 💻 STACK DESIGN SYSTEM

### Web (Next.js)

```
design-tokens.json          ← Tokens W3C (généré)
design-system.css           ← Variables CSS + animations + utilitaires
tailwind.config.ts          ← Config Tailwind avec tokens Picksy
ScoreRing.tsx               ← Composant React gamifié (généré)
ProductCard.tsx             ← Card produit complète (généré)
```

### Mobile (Flutter)

```
lib/core/theme/app_theme.dart    ← ThemeData light + dark (généré)
lib/core/theme/app_colors.dart   ← Couleurs + gradients + extensions (généré)
lib/features/home/widgets/
  category_card_widget.dart      ← Card catégorie avec parallax (généré)
  score_ring_widget.dart         ← Ring animé CustomPainter (généré)
```

---

*PICKSY Visual Identity V1.0 — Prêt pour handoff développeur*
*Généré par le Conseil Cicéron — Avril 2026*
