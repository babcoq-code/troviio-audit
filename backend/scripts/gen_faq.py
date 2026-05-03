"""Génère les FAQs SEO pour toutes les catégories Troviio."""
import json, os, re, sys
from openai import OpenAI

client = OpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")

# Categories
CATS = [
    ("smartphone", "Smartphone"), ("machine-a-cafe", "Machine à café"),
    ("aspirateur-balai", "Aspirateur balai"), ("friteuse-air", "Friteuse à air"),
    ("casque-audio", "Casque audio"), ("aspirateur-robot", "Robot aspirateur"),
    ("barre-de-son", "Barre de son"), ("refrigerateur", "Réfrigérateur"),
    ("lave-linge", "Lave-linge"), ("lave-vaisselle", "Lave-vaisselle"),
    ("four-micro-ondes", "Four micro-ondes"), ("poussette", "Poussette"),
    ("ordinateur-portable", "Ordinateur portable"), ("tv", "TV"),
    ("enceinte-bt", "Enceinte Bluetooth"), ("cave-a-vin", "Cave à vin"),
    ("purificateur-air", "Purificateur d'air"), ("robot-cuisine", "Robot cuisine"),
    ("trottinette", "Trottinette électrique"), ("velo-electrique", "Vélo électrique"),
    ("matelas", "Matelas"), ("imprimante", "Imprimante"),
    ("camera-securite", "Caméra sécurité"), ("thermostat-connecte", "Thermostat connecté"),
]

def generate_faq(slug: str, name: str) -> list[dict]:
    prompt = f"""Génère 3 questions/réponses FAQ en français pour la catégorie "{name}".
Retourne UNIQUEMENT un tableau JSON avec cette structure exacte :
[{{"question": "Question 1?", "answer": "Réponse 1."}}, {{"question": "Question 2?", "answer": "Réponse 2."}}, {{"question": "Question 3?", "answer": "Réponse 3."}}]

Questions recherchées sur Google, réponses expertes 2-3 phrases, ton neutre et informatif.
Pas de texte avant ou après le JSON."""

    for attempt in range(3):
        try:
            resp = client.chat.completions.create(
                model="deepseek-chat",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3, max_tokens=1500,
            )
            content = resp.choices[0].message.content.strip()
            # Try to find JSON array
            match = re.search(r'\[[\s\S]*\]', content)
            if not match:
                print(f"  ⚠️ {slug} tente {attempt+1}: pas de tableau, brute force...")
                # Maybe the whole response is JSON?
                try:
                    data = json.loads(content)
                    if isinstance(data, list):
                        return data[:3]
                except:
                    pass
                continue
            data = json.loads(match.group())
            if isinstance(data, list) and len(data) >= 3:
                print(f"  ✅ {slug}: {len(data)} FAQs")
                return data[:3]
        except Exception as e:
            print(f"  ⚠️ {slug} tente {attempt+1}: {str(e)[:60]}")
    print(f"  ❌ {slug}: échec après 3 tentatives")
    return [
        {"question": f"Quel {name.lower()} choisir ?", "answer": f"Découvrez notre sélection des meilleurs {name.lower()} pour trouver celui qui correspond à vos besoins."},
        {"question": f"Quel budget pour un {name.lower()} ?", "answer": f"Les prix varient selon les fonctionnalités. Comparez les modèles sur Troviio."},
        {"question": f"Quelles sont les meilleures marques de {name.lower()} ?", "answer": f"Les marques les plus reconnues incluent les leaders du marché. Consultez nos guides pour plus de détails."},
    ]

all_faqs = {}
for slug, name in CATS:
    print(f"Génération {slug} ({name})...")
    faqs = generate_faq(slug, name)
    all_faqs[slug] = faqs

output_path = "/root/troviio-ciceron/frontend/src/app/c/faq-data.json"
with open(output_path, "w") as f:
    json.dump(all_faqs, f, ensure_ascii=False, indent=2)

print(f"\n✅ {len(all_faqs)} catégories sauvegardées dans {output_path}")
