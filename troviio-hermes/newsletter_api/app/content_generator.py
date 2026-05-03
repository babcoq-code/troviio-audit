import httpx
from app.config import get_settings

BRAND_VOICE = """Tu es Hermes, le rédacteur en chef de la newsletter mensuelle TROViiO.

TROViiO est un comparateur IA de produits électroménager et tech en France.
Site : troviio.com
Tagline : "L'IA anti-regret pour vos achats."

TON OBLIGATOIRE
- Direct, honnête, jamais commercial
- Humain : on parle à quelqu'un, pas à une liste
- Décalé avec humour, jamais condescendant
- Toujours citer les défauts d'un produit recommandé
- Jamais "Découvrez", jamais "cher consommateur"
- Phrases courtes. Max 2 lignes par paragraphe.
- Un seul emoji par section max.
- Tutoiement systématique.

FORMAT PAR SECTION
EDITO : 120-150 mots, ton lettre personnelle, commence par "Salut,"
PRODUIT DU MOIS : 200 mots max, verdict + score + "pour qui" + citation
ARNAQUE : 150 mots, démonstration factuelle + ironie + verdict
HACK : 80 mots, un seul conseil actionnable
QUESTION LECTEUR : 150 mots, réponse honnête

INTERDIT
- Promettre des résultats impossibles
- Dire qu'un produit "révolutionne" quoi que ce soit
- Inventer des fonctionnalités
- Plus de 1 CTA par email
- Tout discours commercial sur TROViiO lui-même"""


async def _deepseek(prompt: str, system: str = BRAND_VOICE, max_tokens: int = 1000) -> str:
    settings = get_settings()
    if not settings.deepseek_api_key:
        return f"[SIMULATION] {prompt[:100]}..."

    async with httpx.AsyncClient(timeout=180) as client:
        r = await client.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.deepseek_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
                "max_tokens": max_tokens,
            },
        )
        r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"].strip()


async def generate_subject(month: str, theme: str) -> str:
    return await _deepseek(
        f"Génère un objet d'email accrocheur pour la newsletter TROViiO de {month} "
        f"sur le thème : {theme}. "
        "6-9 mots max. Intrigant, direct. "
        "Retourne uniquement l'objet, rien d'autre.",
        max_tokens=50,
    )


async def generate_editorial(month: str, theme: str) -> str:
    return await _deepseek(
        f"Écris l'édito mensuel TROViiO pour {month}. "
        f"Thème : {theme}. "
        "150 mots max. Commence par 'Salut,'."
    )


async def generate_product_section(product: dict) -> str:
    return await _deepseek(
        f"Écris la section 'Produit du mois' pour {product['name']}. "
        f"Score : {product['score']}/100. Prix : {product['price']}€. "
        f"Forces : {product.get('pros', 'non précisés')}. "
        f"Défauts : {product.get('cons', 'non précisés')}. "
        "200 mots max : verdict + 'Pour qui' + citation.",
    )


async def generate_scam_section(product: dict, alternative: dict) -> str:
    return await _deepseek(
        f"Écris 'Arnaque du mois' pour {product['name']} à {product['price']}€. "
        f"Raison : {product['why_overrated']}. "
        f"Alternative : {alternative['name']} à {alternative['price']}€. "
        "150 mots max. Factuel + ironie légère."
    )


async def generate_hack(theme: str) -> str:
    return await _deepseek(
        f"Écris le 'Hack anti-obsolescence' sur le thème : {theme}. "
        "80 mots max. Un conseil concret."
    )


async def generate_reader_reply(question: str, author: str) -> str:
    return await _deepseek(
        f"Question de {author} : '{question}'. "
        "Réponds honnête et utile, 150 mots max."
    )


async def generate_summary(sections: dict) -> str:
    return await _deepseek(
        "Résumé 3 lignes newsletter TROViiO : "
        f"Édito : {sections.get('editorial', '')[:200]}. "
        f"Produit : {sections.get('product_name', '')}. "
        f"Arnaque : {sections.get('scam_name', '')}.",
        max_tokens=150,
    )
