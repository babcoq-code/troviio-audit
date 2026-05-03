"""
Routes Newsletter Troviio
"""
from datetime import datetime
import os
import secrets
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import resend

from app.core.supabase import get_supabase_admin

router = APIRouter()
resend.api_key = os.getenv("RESEND_API_KEY", "")

supabase = get_supabase_admin()
DOMAIN = os.getenv("DOMAIN", "troviio.fr")


class SubscribeRequest(BaseModel):
    email: EmailStr
    categories: list[str] = []


@router.post("/subscribe")
async def subscribe(req: SubscribeRequest):
    existing = supabase.table("newsletter_subscribers").select("id").eq("email", req.email).execute()
    if existing.data:
        raise HTTPException(400, "Email déjà inscrit")

    confirm_token = secrets.token_urlsafe(32)
    unsub_token = secrets.token_urlsafe(32)

    supabase.table("newsletter_subscribers").insert({
        "email": req.email,
        "categories": req.categories,
        "confirm_token": confirm_token,
        "unsubscribe_token": unsub_token,
    }).execute()

    resend.Emails.send({
        "from": f"Troviio <newsletter@{DOMAIN}>",
        "to": req.email,
        "subject": "Confirme ton inscription à Troviio ✨",
        "html": f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            <table style="width:100%;max-width:480px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;">
                <tr>
                    <td style="background:linear-gradient(135deg,#059669,#047857);padding:32px 24px;text-align:center;">
                        <h1 style="color:#fff;margin:0;font-size:22px;">✨ Bienvenue sur Troviio !</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:32px 24px;text-align:center;">
                        <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
                            Vous êtes à un clic de recevoir chaque mois le <strong>Top 3</strong> des meilleurs produits, sélectionnés par notre IA indépendante.
                        </p>
                        <a href=\"https://{DOMAIN}/api/newsletter/confirm?token={confirm_token}\"
                           style="display:inline-block;background:#059669;color:#fff;text-decoration:none;
                                  font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;">
                            ✅ Confirmer mon inscription
                        </a>
                        <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
                            Si vous n'avez pas demandé cette inscription, ignorez cet email.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """,
    })
    return {"message": "Email de confirmation envoyé"}


@router.get("/confirm")
async def confirm(token: str):
    result = supabase.table("newsletter_subscribers").select("*").eq("confirm_token", token).execute()
    if not result.data:
        raise HTTPException(404, "Token invalide")
    supabase.table("newsletter_subscribers").update({
        "is_confirmed": True,
    }).eq("confirm_token", token).execute()
    return {"message": "Inscription confirmée !"}


@router.get("/unsubscribe")
async def unsubscribe(token: str):
    result = supabase.table("newsletter_subscribers").select("*").eq("unsubscribe_token", token).execute()
    if not result.data:
        raise HTTPException(404, "Token invalide")
    supabase.table("newsletter_subscribers").delete().eq("unsubscribe_token", token).execute()
    return {"message": "Désinscription effectuée"}


# ── GENERATION newsletter via DeepSeek ────────────────────────
import json

# Chercher brand_voice.json dans /data (volume monté) ou /app/data
_BV_PATH = "/data/brand_voice.json"
if not os.path.exists(_BV_PATH):
    _BV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "brand_voice.json")
if not os.path.exists(_BV_PATH):
    _BV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "brand_voice.json")

with open(_BV_PATH) as _f:
    BRAND = json.load(_f)


async def _deepseek(prompt: str, system: str | None = None, max_tokens: int = 1000) -> str:
    """Appelle DeepSeek pour générer du contenu newsletter. Nettoie le markdown."""
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
    voice = system or _voice_system()
    
    # Ajouter une instruction anti-markdown dans tous les prompts
    clean_prompt = prompt + "\n\nIMPORTANT: Réponds en texte brut uniquement. Pas de markdown, pas d'astérisques **, pas de #, pas de >. Du texte simple, des retours à la ligne."
    
    resp = await client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "system", "content": voice}, {"role": "user", "content": clean_prompt}],
        temperature=0.5,
        max_tokens=max_tokens,
    )
    text = resp.choices[0].message.content.strip()
    
    # Nettoyage post-traitement du markdown
    import re
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # **gras** → gras
    text = re.sub(r'__(.*?)__', r'\1', text)       # __gras__ → gras
    text = re.sub(r'`(.*?)`', r'\1', text)          # `code` → code
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)  # # titres
    text = re.sub(r'^>\s*', '', text, flags=re.MULTILINE)   # > citations
    text = re.sub(r'\* ', '• ', text)               # * listes → • listes
    text = re.sub(r'- ', '• ', text)                 # - listes → • listes
    text = re.sub(r'\n{3,}', '\n\n', text)          # espaces multiples
    text = text.strip()
    
    return text


def _voice_system() -> str:
    v = BRAND["voice"]
    rules = "\n".join(f"- {r}" for r in v["rules"])
    forbidden = "\n".join(f"- {f}" for f in v["forbidden"])
    sigs = "\n".join(f"- '{s}'" for s in v["signatures"])
    return f"""Tu es Hermes, rédacteur en chef de la newsletter {BRAND['brand_name']}.
{BRAND['tagline']} — Site : {BRAND['site']}

TON OBLIGATOIRE : {v['tone']}

RÈGLES :
{rules}

FORMULES SIGNATURE (utilise-les naturellement) :
{sigs}

INTERDIT ABSOLU :
{forbidden}"""


class GenerateRequest(BaseModel):
    month: str
    theme: str = ""
    test_email: str = "vseb@wanadoo.fr"


@router.post("/generate")
async def generate_newsletter(req: GenerateRequest):
    """Génère une newsletter complète via DeepSeek et envoie un test."""
    from app.services.email_service import build_newsletter_html, send_troviio_email, CATEGORIES

    month = req.month
    theme = req.theme or "produits du quotidien"
    is_launch = "juin" in month.lower() or "june" in month.lower() or req.theme == "launch"

    # Détecter si c'est la première édition
    try:
        import json
        with open("/data/metrics/daily.jsonl") as _mf:
            _lines = [json.loads(l) for l in _mf if l.strip()]
        edition_number = len(_lines)  # pas exact mais métaphore
    except Exception:
        edition_number = 1

    # 1. Objet — plus punchy pour le lancement
    if is_launch:
        subject_prompt = (
            "Génère un objet d'email accrocheur pour la PREMIÈRE newsletter de lancement du site Troviio en juin 2026. "
            "On est un nouveau comparateur IA de produits. Le ton est : on débarque, on va vous aider. "
            "6-9 mots max. Direct, intrigant, jamais commercial. Exemples : "
            "'On a comparé 700 produits pour vous.' ou 'Trouver le bon produit, c'est fini la galère.'"
        )
    else:
        subject_prompt = (
            f"Génère un objet d'email accrocheur pour la newsletter de {month} sur le thème : {theme}. "
            "6-9 mots. Intrigant, direct."
        )
    subject = await _deepseek(subject_prompt, max_tokens=50)
    subject = subject.strip('"')

    # 2. Édito — plus structuré, pas de gros pavé
    if is_launch:
        editorial = await _deepseek(
            "Écris un édito de lancement percutant pour Troviio, nouveau comparateur IA de produits. "
            "200 mots max. Commence par 'Salut,'. "
            "STRUCTURE : 1 phrase d'accroche forte • 2-3 phrases qui racontent le pourquoi du projet • "
            "1 phrase sur ce qu'on change • 1 phrase de conclusion qui donne envie. "
            "Pas de longs paragraphes. Des retours à la ligne entre chaque idée. "
            "Termine par 'Arrête de scroller Amazon en pleine nuit. On a fait le boulot pour toi.'",
        )
    else:
        editorial = await _deepseek(
            f"Écris l'édito de la newsletter {month}. "
            f"STRUCTURE : 1 phrase d'accroche • 2-3 phrases d'analyse • 1 phrase de conclusion. "
            "180 mots max. Commence par 'Salut,'. "
            "Pas de longs paragraphes. Des retours à la ligne entre les blocs.",
        )

    # 3. Hack
    hack = await _deepseek(
        f"Écris un conseil pratique anti-obsolescence de 80 mots max. "
        f"STRUCTURE : 1 phrase qui pose le problème • 1 phrase solution • 1 phrase bénéfice. "
        "Concret et actionnable immédiatement. Pas de bla-bla.",
        max_tokens=200,
    )

    # 4. Top 5 produits — données réelles Supabase
    top3 = []
    top5_for_selection = []
    top3_supabase = None
    try:
        supa = supabase
        # Prendre les 5 meilleurs pour permettre à DeepSeek de choisir le plus vogue
        r = supa.table("products").select("name,brand,slug,image_url,price_eur,estimated_score,verdict,pros,cons") \
                .eq("is_active", True).order("estimated_score", desc=True).limit(5).execute()

        # Fonction pour formater le nom sans répéter la marque
        def format_name(p):
            brand = (p.get("brand") or "").strip()
            name = (p.get("name") or "").strip()
            if name.lower().startswith(brand.lower()):
                return name
            return f"{brand} {name}".strip()

        # Top 3 pour le classement
        for p in (r.data or [])[:3]:
            top3.append({
                "name": format_name(p),
                "price": p.get("price_eur", "?"),
                "score": int((p.get("estimated_score") or 7) * 10),
                "url": f"https://troviio.com/produit/{p.get('slug', '')}",
            })

        # Top 5 pour que DeepSeek choisisse le plus vogue
        top5_for_selection = [
            {
                "name": format_name(p),
                "slug": p.get("slug", ""),
                "price": p.get("price_eur", "?"),
                "score": int((p.get("estimated_score") or 7) * 10),
                "image_url": p.get("image_url", ""),
                "verdict": p.get("verdict", "")[:200],
                "pros": p.get("pros", [])[:3],
                "cons": p.get("cons", [])[:2],
                "_raw_category": p.get("category_id", ""),
            }
            for p in (r.data or [])
        ]

        # DeepSeek choisit le produit le plus vogue parmi les 5
        if top5_for_selection:
            vogue_prompt = (
                "Voici 5 produits avec leur score Troviio. Choisis celui qui est LE PLUS EN VOGUE actuellement "
                "(le plus tendance, qui fait parler de lui, catégorie la plus chaude du moment). "
                "Réponds UNIQUEMENT par l'index (0-4) du produit choisi, rien d'autre.\n\n"
                + "\n".join(
                    f"{i}. {p['name']} — catégorie extraite du slug '{p['slug']}' — score {p['score']}/100"
                    for i, p in enumerate(top5_for_selection)
                )
            )
            try:
                idx_text = await _deepseek(vogue_prompt, max_tokens=10)
                import re
                nums = re.findall(r'\d+', idx_text)
                idx = int(nums[0]) if nums else 0
                if idx < 0 or idx >= len(top5_for_selection):
                    idx = 0
            except Exception:
                idx = 0

            top3_supabase = top5_for_selection[idx]

    except Exception as e:
        print(f"Supabase error: {e}")
        top3 = []

    # 5. Construction HTML avec mode launch
    html = build_newsletter_html(
        month=month,
        edition_number=edition_number,
        subject=subject,
        editorial=editorial,
        is_launch=is_launch,
        product=top3_supabase,
        hack=hack,
        top3=top3 if top3 else None,
        cta_url="https://troviio.com",
    )

    # 6. Envoi test
    send_result = send_troviio_email(
        to=req.test_email,
        subject=f"[TEST] {subject}",
        html=html,
    )

    return {
        "ok": send_result.get("ok", False),
        "month": month,
        "is_launch": is_launch,
        "edition": edition_number,
        "subject": subject,
        "editorial_preview": editorial[:200],
        "hack_preview": hack[:150],
        "top3_count": len(top3),
        "html_length": len(html),
        "send_result": send_result,
    }


@router.post("/veille-draft")
async def veille_draft():
    """Génère la veille, vérifie les prix, t'envoie brouillon + version finalisée avec intro et charte."""

    # ── HELPER: génère une intro humoristique sur le mois écoulé ──
    async def _intro_mensuelle(month_name: str) -> str:
        prompt = (
            f"Écris UNE SEULE PHRASE d'introduction humoristique et légère pour la newsletter Troviio de {month_name}. "
            "On est un comparateur IA de produits. Le ton est : honnête, drôle, un peu irreverent. "
            "Parle rapidement du mois écoulé (actualités tech, découvertes, péripéties du site) "
            "sur le ton de 'on a testé X, découvert Y, presque mis le feu au labo'. "
            "PAS de markdown, PAS d'astérisques, juste une phrase de 180 chars max. "
            "Exemple : 'Ce mois-ci on a plongé dans le monde des robots aspirateurs et on a découvert que le vôtre vous ment peut-être.'"
        )
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com/v1")
        resp = await client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=100,
        )
        text = resp.choices[0].message.content.strip()
        text = text.replace("**", "").replace("##", "").strip('"')
        return text

    import subprocess as _sp, json as _json
    from app.services.email_service import send_troviio_email

    # 1. Lancer le script de veille DeepSeek
    script_path = "/app/scripts/veille_mensuelle.py"
    result = _sp.run(
        ["python3", script_path],
        capture_output=True, text=True, timeout=90,
        env={**os.environ, "PYTHONPATH": "/app"},
    )
    if result.returncode != 0:
        return {"ok": False, "error": result.stderr[:500]}

    # 2. Charger le rapport
    now = datetime.now()
    month = now.strftime("%Y-%m")
    month_display = now.strftime("%B %Y").capitalize()
    veille_path = None
    for p in [f"/data/veille/{month}.json", f"/app/data/veille/{month}.json"]:
        if os.path.exists(p):
            veille_path = p
            break
    if not veille_path:
        return {"ok": False, "error": "Rapport non trouvé après génération"}
    with open(veille_path) as f:
        report = _json.load(f)

    pm = report.get("produit_du_mois", {})
    acc = report.get("accessoire_du_mois", {})
    nps = report.get("nouveaux_produits", [])
    pas = report.get("produits_attendus", [])
    hack = report.get("hack_du_mois", "")
    base_products = report.get("top_produits_base", [])

    # 3. Générer l'intro
    try:
        intro = await _intro_mensuelle(month_display)
    except Exception:
        intro = f"Ce mois-ci on a exploré, testé, et comparé pour toi. Voici ce qu'il faut retenir de {month_display}."

    # 4. VÉRIFICATION des prix Supabase
    supa = supabase
    verification_notes = []
    for np_item in nps:
        name = np_item.get("nom", "")
        price_str = np_item.get("prix", "?").replace("€", "").replace(" ", "")
        try:
            price_val = int(price_str)
        except (ValueError, TypeError):
            continue
        search = supa.table("products").select("name,price_eur").ilike("name", f"%{name[:30]}%").limit(1).execute()
        if search.data:
            db_price = search.data[0].get("price_eur")
            if db_price and abs(db_price - price_val) > db_price * 0.5:
                verification_notes.append(
                    f"📊 {name}: annoncé {price_val}€, réel ~{db_price}€"
                )
                np_item["prix_verifie"] = f"{db_price}€"

    for pa_item in pas:
        name = pa_item.get("nom", "")
        search = supa.table("products").select("slug,name").ilike("name", f"%{name[:30]}%").limit(1).execute()
        if search.data:
            verification_notes.append(
                f"ℹ️ {name} existe déjà dans le catalogue ({search.data[0].get('slug')})"
            )

    # 5. CONSTRUCTION HTML des deux versions
    def _card(title: str, emoji: str, content: str, accent: str = "255,107,95") -> str:
        return f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1D2E;border-radius:16px;">
  <tr><td style="padding:20px;">
    <div style="display:inline-block;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;margin-bottom:10px;background:rgba({accent},0.12);color:#FFFFFF;">{emoji} {title}</div>
    {content}
  </td></tr>
</table>"""

    def _pilote(nom: str, detail: str, desc: str) -> str:
        return f"""<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
  <div style="font-weight:600;font-size:14px;color:#FFFFFF;">{nom}</div>
  <div style="font-size:11px;color:#606060;margin:2px 0 6px;">{detail}</div>
  <p style="font-size:13px;color:#C0C0C0;margin:0;line-height:1.5;">{desc[:140]}</p>
</div>"""

    # Header commun
    def _header(title: str, subtitle: str) -> str:
        return f"""
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="padding:32px 24px 16px;text-align:center;">
    <div style="font-family:'Inter',Arial,sans-serif;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
      TROV<span style="color:#FF6B5F;">i</span><span style="color:#3ED6A3;">i</span>O
    </div>
    <div style="height:3px;background:linear-gradient(135deg,#FF6B5F,#3ED6A3);margin:10px auto;border-radius:2px;max-width:60px;"></div>
    <h1 style="font-size:20px;font-weight:700;margin:12px 0 4px 0;color:#FFFFFF;">{title}</h1>
    <p style="font-size:12px;color:#606060;margin:0;">{subtitle}</p>
  </td></tr>
</table>"""

    # Stats
    stats_html = f"""
<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px auto;max-width:480px;">
  <tr>
    <td align="center" style="padding:8px;">
      <div style="font-size:24px;font-weight:800;color:#FF6B5F;">{len(base_products or [])}+</div>
      <div style="font-size:10px;color:#606060;">top produits</div>
    </td>
    <td align="center" style="padding:8px;">
      <div style="font-size:24px;font-weight:800;color:#3ED6A3;">{len(nps)}+</div>
      <div style="font-size:10px;color:#606060;">nouveautés</div>
    </td>
    <td align="center" style="padding:8px;">
      <div style="font-size:24px;font-weight:800;color:#4257FF;">{len(pas)}+</div>
      <div style="font-size:10px;color:#606060;">attendus</div>
    </td>
  </tr>
</table>"""

    # Sections communes
    sections_draft = ""
    sections_final = ""

    # Intro
    sections_draft += _card("Ce mois-ci", "📰", f'<p style="font-size:14px;color:#C0C0C0;margin:0;line-height:1.6;font-style:italic;">"{intro}"</p>', "255,176,32")

    # Vérifications bannière
    if verification_notes:
        notes_html = "".join(f'<p style="font-size:12px;color:#C0C0C0;margin:0 0 4px 0;">{n}</p>' for n in verification_notes[:8])
        sections_draft += f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#2A1A1A;border-radius:12px;border:1px solid #FF6B5F;">
  <tr><td style="padding:14px;">
    <div style="font-size:12px;font-weight:600;color:#FF6B5F;margin-bottom:6px;">🔍 VÉRIFICATIONS</div>
    {notes_html}
  </td></tr>
</table>"""

    # Produit du mois
    if pm:
        pm_html = f"""<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td width="100" valign="top" style="padding:0 14px 0 0;">
      {f'<img src="{pm.get("image_url","")}" alt="{pm.get("nom","")}" style="width:100px;height:auto;border-radius:10px;display:block;" />' if pm.get("image_url") else ''}
    </td>
    <td valign="top">
      <h2 style="font-size:17px;margin:0 0 4px 0;color:#FFFFFF;">{pm.get("nom","")}</h2>
      <div style="margin:4px 0;">
        <span style="font-size:12px;color:#808080;">~{pm.get("prix","?")}€</span>
        <span style="display:inline-block;margin-left:6px;background:rgba(66,87,255,0.12);color:#4257FF;padding:1px 7px;border-radius:4px;font-size:12px;font-weight:700;">{pm.get("note","?")}</span>
      </div>
      <p style="font-size:13px;color:#808080;margin:6px 0 0 0;">{pm.get("descriptif","")[:180]}</p>
      {f'<div style="border-left:2px solid #FF6B5F;padding:6px 10px;font-size:12px;color:#FF6B5F;margin-top:8px;">⚠️ {pm.get("defauts","")[:120]}</div>' if pm.get("defauts") else ''}
    </td>
  </tr>
</table>"""
        sections_draft += _card("Produit du mois", "🌟", pm_html, "255,107,95")

        sections_final += _card("Produit du mois", "🌟", f"""<h2 style="font-size:17px;margin:0 0 4px 0;color:#FFFFFF;">{pm.get("nom","")}</h2>
<div style="margin:4px 0;"><span style="font-size:12px;color:#808080;">~{pm.get("prix","?")}€</span><span style="display:inline-block;margin-left:6px;background:rgba(66,87,255,0.12);color:#4257FF;padding:1px 7px;border-radius:4px;font-size:12px;font-weight:700;">{pm.get("note","?")}</span></div>
<p style="font-size:13px;color:#C0C0C0;margin:6px 0 0 0;">{pm.get("descriptif","")[:200]}</p>""", "255,107,95")

    # Top base
    if base_products:
        rows = ""
        medals = ["🥇","🥈","🥉"]
        for i, bp in enumerate(base_products[:3]):
            rows += f"""<tr>
  <td style="padding:0 0 6px 0;width:20px;vertical-align:top;font-size:15px;">{medals[i]}</td>
  <td style="padding:0 0 6px 0;">
    <div style="font-weight:600;font-size:13px;color:#FFFFFF;">{bp.get("name","")}</div>
    <div style="font-size:11px;color:#808080;">{bp.get("price","?")}€ · {bp.get("score","?")}/100</div>
  </td>
</tr>"""
        sections_draft += _card("Top 3 de notre base", "🏆", f'<table width="100%" cellpadding="0" cellspacing="0">{rows}</table>', "66,87,255")
        sections_final += _card("Top 3", "🏆", f'<table width="100%" cellpadding="0" cellspacing="0">{rows}</table>', "66,87,255")

    # Accessoire
    if acc:
        acc_html = f"""<h2 style="font-size:16px;margin:0 0 4px 0;color:#FFFFFF;">{acc.get("nom","")}</h2>
<div style="font-size:12px;color:#808080;margin-bottom:6px;">~{acc.get("prix","?")} · Note {acc.get("note","?")}</div>
<p style="font-size:13px;color:#C0C0C0;margin:0;">{acc.get("descriptif","")[:180]}</p>"""
        sections_draft += _card("Accessoire du mois", "🎯", acc_html, "62,214,163")
        sections_final += _card("Accessoire du mois", "🎯", f"""<h2 style="font-size:16px;margin:0 0 4px 0;color:#FFFFFF;">{acc.get("nom","")}</h2>
<p style="font-size:13px;color:#C0C0C0;margin:0;">{acc.get("descriptif","")[:140]}</p>""", "62,214,163")

    # Nouveautés
    if nps:
        items = "".join(_pilote(n.get("nom",""), f'{n.get("categorie","")} · {n.get("prix_verifie", n.get("prix","?"))}€', n.get("descriptif","")) for n in nps)
        sections_draft += _card("Nouveautés du mois", "🆕", items, "66,87,255")
        items_f = "".join(_pilote(n.get("nom",""), n.get("categorie",""), n.get("descriptif","")) for n in nps[:3])
        sections_final += _card("Nouveautés", "🆕", items_f, "66,87,255")

    # Attendus
    if pas:
        items = "".join(_pilote(pa.get("nom",""), f'{pa.get("categorie","")} · ⏳ {pa.get("attendu_pour","?")}', pa.get("commentaire","")) for pa in pas)
        sections_draft += _card("Produits attendus", "🔮", items, "255,176,32")
        items_f = "".join(_pilote(pa.get("nom",""), pa.get("categorie",""), pa.get("commentaire","")) for pa in pas[:3])
        sections_final += _card("Produits attendus", "🔮", items_f, "255,176,32")

    # Hack
    if hack:
        sections_draft += _card("Hack anti-obsolescence", "🔧", f'<p style="font-size:13px;color:#C0C0C0;margin:0;line-height:1.6;">{hack[:350]}</p>', "62,214,163")
        sections_final += _card("Hack du mois", "🔧", f'<p style="font-size:13px;color:#C0C0C0;margin:0;line-height:1.6;">{hack[:250]}</p>', "62,214,163")

    # Footer
    footer = """<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="padding:24px;text-align:center;">
    <div style="font-size:11px;color:#606060;margin:0;line-height:1.5;">
      TROViiO · L'IA anti-regret pour vos achats<br>
      <a href="https://troviio.com" style="color:#4257FF;text-decoration:underline;">troviio.com</a>
    </div>
  </td></tr>
</table>"""

    # ── ASSEMBLAGE BROUILLON ──
    draft_html = f"""<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  *{{margin:0;padding:0;box-sizing:border-box;}}
  body{{background:#0E1020;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#EAEAEA;}}
  h1{{font-size:20px;font-weight:700;margin-bottom:6px;color:#FFFFFF;}}
</style>
</head>
<body style="margin:0;padding:16px;background:#0E1020;">
<center>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0E1020;">
  <tr><td align="center" style="padding:0;">
    {_header("📋 Brouillon veille " + month_display, "Généré le " + now.strftime("%d/%m/%Y à %H:%M"))}

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
      <tr><td style="padding:0 0 12px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A1D2E;border-radius:12px;">
          <tr><td style="padding:16px;">
            <p style="font-size:13px;color:#C0C0C0;margin:0 0 6px 0;">Salut Sébastien,</p>
            <p style="font-size:13px;color:#C0C0C0;margin:0 0 6px 0;">Voici le brouillon de veille. Les infos <strong style="color:#FF6B5F;">IA</strong> sont à vérifier.</p>
            <p style="font-size:13px;color:#FFB020;margin:0;">⚠️ Dis-moi si tu valides ou si tu veux des modifs pour l'envoi demain.</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 12px 0;">{sections_draft}</td></tr>
      {footer}
    </table>
  </td></tr>
</table>
</center>
</body>
</html>"""

    # ── ASSEMBLAGE VERSION FINALISEE ──
    final_html = f"""<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  *{{margin:0;padding:0;box-sizing:border-box;}}
  body{{background:#0E1020;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#EAEAEA;}}
  h1{{font-size:20px;font-weight:700;margin-bottom:6px;color:#FFFFFF;}}
</style>
</head>
<body style="margin:0;padding:16px;background:#0E1020;">
<center>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0E1020;">
  <tr><td align="center" style="padding:0;">
    {_header("✅ Newsletter " + month_display, "Prête pour envoi le 1er à 10h")}
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
      <tr><td style="padding:0 0 12px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A1D2E;border-radius:12px;">
          <tr><td style="padding:16px;">
            <p style="font-size:13px;color:#3ED6A3;margin:0;">✅ Version validée et prête à envoyer aux abonnés.</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding-bottom:12px;">{sections_final}</td></tr>
      {footer}
    </table>
  </td></tr>
</table>
</center>
</body>
</html>"""

    # 6. ENVOI
    month_name = report.get("_meta", {}).get("month_name", month_display)
    r1 = send_troviio_email(to="vseb@wanadoo.fr", subject=f"📋 Brouillon veille {month_name} — À VALIDER", html=draft_html)
    r2 = send_troviio_email(to="vseb@wanadoo.fr", subject=f"✅ Version finalisée {month_name} — prête pour le 1er", html=final_html)

    return {
        "ok": r1.get("ok", False) or r2.get("ok", False),
        "month": month,
        "draft_sent": r1.get("ok", False),
        "final_sent": r2.get("ok", False),
        "products_count": len(nps),
        "upcoming_count": len(pas),
        "verification_notes": len(verification_notes),
    }
