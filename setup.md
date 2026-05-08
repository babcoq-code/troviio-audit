[SETUP.md](https://github.com/user-attachments/files/27090109/SETUP.md)
# 🚀 Picksy — Guide Setup Complet (2h)

> Ce guide te permet de lancer Picksy de zéro. Suis les étapes dans l'ordre.
> Chaque étape indique combien de temps elle prend.

---

## 📋 Comptes à créer (30 min total)

### 1. Supabase — Base de données (10 min)
1. Va sur [supabase.com](https://supabase.com) → "Start your project"
2. Crée un compte (GitHub login recommandé)
3. "New project" → Nom: `picksy-prod` → Région: `eu-west-3 (Paris)`
4. Copie les clés dans ton `.env` :
   - `SUPABASE_URL` → Project Settings > API > Project URL
   - `SUPABASE_ANON_KEY` → Project Settings > API > anon public
   - `SUPABASE_SERVICE_KEY` → Project Settings > API > service_role secret

### 2. DeepSeek — LLM API (5 min)
1. Va sur [platform.deepseek.com](https://platform.deepseek.com)
2. Crée un compte → "API Keys" → "Create new key"
3. Copie dans `.env` : `DEEPSEEK_API_KEY`

### 3. Railway — Hébergement backend (10 min)
1. Va sur [railway.app](https://railway.app) → "Login with GitHub"
2. "New Project" → "Deploy from GitHub repo" → Sélectionne `Picksy`
3. Dossier source : `/backend`
4. Les variables d'environnement se configurent dans Railway > Variables

### 4. Awin — Affiliation (5 min)
1. Va sur [awin.com](https://www.awin.com) → "Publisher signup"
2. Crée un compte → Rejoins les programmes Amazon, Boulanger
3. Copie dans `.env` : `AWIN_API_KEY`

---

## 🗄️ Setup Base de données Supabase (20 min)

1. Dans Supabase → "SQL Editor" → "New query"
2. Copie-colle le contenu de `/supabase/migrations/001_initial.sql`
3. Clique "Run" (bouton vert)
4. Vérifie que toutes les tables sont créées dans "Table Editor"

---

## ⚙️ Variables d'environnement (10 min)

Copie le fichier `.env.example` en `.env` et remplis toutes les valeurs :

```bash
cp .env.example .env
# Édite .env avec tes clés
```

**Ne commit JAMAIS le fichier `.env` sur GitHub** (il est dans `.gitignore`)

---

## 🖥️ Lancer le backend en local (test) (10 min)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

→ Ouvre [http://localhost:8000/docs](http://localhost:8000/docs)
→ Tu dois voir la documentation Swagger de l'API Picksy ✅

---

## 📱 Lancer l'app Flutter en local (20 min)

### Installer Flutter
1. Va sur [flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)
2. Télécharge Flutter pour ton OS (Mac recommandé pour iOS)
3. Suis les instructions d'installation

### Lancer l'app
```bash
cd app
flutter pub get
flutter run
```

---

## 🚢 Déployer le backend sur Railway (5 min)

1. Dans Railway → ton projet → "Deploy"
2. Ajoute toutes les variables d'environnement (copie depuis ton `.env`)
3. Le déploiement se fait automatiquement à chaque push sur GitHub

---

## 🍎 Soumission App Store (1h — à faire en Phase 5)

1. Crée un compte Apple Developer : [developer.apple.com](https://developer.apple.com) → 99€/an
2. Dans Xcode → Product → Archive
3. Xcode → Window → Organizer → Distribute App
4. Suis l'assistant Apple (screenshots, description, catégorie)

---

## 🤖 Soumission Google Play (30 min — à faire en Phase 5)

1. Crée un compte Google Play Console : [play.google.com/console](https://play.google.com/console) → 25€ unique
2. `flutter build appbundle`
3. Upload le `.aab` dans Play Console → suivi de l'assistant

---

## 🆘 Problèmes fréquents

| Problème | Solution |
|----------|----------|
| `SUPABASE_URL not found` | Vérifier que `.env` est bien rempli |
| `Connection refused port 8000` | Relancer `uvicorn app.main:app --reload` |
| Flutter: `No devices found` | Brancher un iPhone ou lancer le simulateur |
| Railway deploy failed | Vérifier les logs dans Railway > Deployments |

---

## 📞 Support

Toutes les questions → Cicéron sur Dust 🤖
