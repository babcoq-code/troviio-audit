"""Utility functions to send emails via Resend.
Newsletter templates with TROViiO brand identity.
"""

import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY", "")
DOMAIN = os.getenv("DOMAIN", "troviio.com")
FROM_EMAIL = os.getenv("NEWSLETTER_FROM_EMAIL", f"Troviio <newsletter@{DOMAIN}>")


# ── BRAND CSS (dark theme TROViiO) ────────────────────────────

BRAND_CSS = """
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0E1020; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #EAEAEA; }

  /* Typography - comme le site troviio.com */
  h1 { font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #FFFFFF; line-height: 1.25; letter-spacing: -0.3px; }
  h2 { font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 10px; color: #FFFFFF; line-height: 1.25; letter-spacing: -0.2px; }
  h3 { font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 15px; font-weight: 600; margin-bottom: 6px; color: #FFFFFF; }
  p { font-size: 15px; line-height: 1.6; margin-bottom: 10px; color: #C0C0C0; }
  .small { font-size: 12px; color: #808080; }

  @media (prefers-color-scheme: light) {
    body { background: #f5f5f7; }
    p { color: #555; }
  }
</style>"""


# ── CATEGORIES ─────────────────────────────────────────────────

CATEGORIES = [
    ("🤖", "Robot aspirateur"), ("🧹", "Aspirateur balai"), ("☕", "Machine à café"),
    ("📺", "TV"), ("🎧", "Casque audio"), ("💻", "PC portable"),
    ("🔊", "Barre de son"), ("🧊", "Réfrigérateur"), ("🌀", "Lave-linge"),
    ("🍽️", "Lave-vaisselle"), ("🍟", "Friteuse air"), ("🔥", "Micro-ondes"),
    ("👶", "Poussette"), ("🔊", "Enceinte BT"), ("🍷", "Cave à vin"),
    ("🍳", "Robot cuisine"), ("🛴", "Trottinette"), ("🚲", "Vélo électrique"),
    ("🌬️", "Purificateur"), ("🌡️", "Thermostat"), ("📹", "Caméra"),
    ("🖨️", "Imprimante"), ("🛏️", "Matelas"), ("📱", "Smartphone"),
]


def build_newsletter_section_html(name: str, content: str, tag: str = "", tag_color: str = "coral") -> str:
    """Build a simple table-based section for email compatibility."""
    tag_html = f'<div style="display:inline-block;background:rgba(255,107,95,0.12);color:#FF6B5F;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;margin-bottom:10px;">{tag}</div>' if tag else ""
    return f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1D2E;border-radius:16px;">
  <tr><td style="padding:24px;">
    {tag_html}
    <h2 style="font-size:18px;margin:0 0 8px 0;">{name}</h2>
    <div style="font-size:15px;color:#C0C0C0;line-height:1.6;white-space:pre-line;">{content}</div>
  </td></tr>
</table>"""


# ── TEMPLATE BUILDER ──────────────────────────────────────────


def build_newsletter_html(
    month: str,
    edition_number: int,
    subject: str,
    editorial: str = "",
    is_launch: bool = False,
    product: dict | None = None,
    scam: dict | None = None,
    hack: str | None = None,
    top3: list[dict] | None = None,
    reader_qa: dict | None = None,
    extra_sections: str = "",
    cta_url: str = "https://troviio.com",
) -> str:
    """Construit un email newsletter complet."""
    from datetime import datetime

    # ── HERO ──
    hero_html = ""
    if is_launch:
        hero_html = f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1D2E;border-radius:16px;">
  <tr><td style="padding:32px 24px;text-align:center;">
    <div style="display:inline-block;background:#FF6B5F;color:#FFFFFF;padding:4px 16px;border-radius:6px;font-size:11px;font-weight:700;margin-bottom:14px;">🎉 PREMIÈRE ÉDITION</div>
    <h1 style="font-size:22px;margin:0 0 6px 0;">Bienvenue dans ta newsletter</h1>
    <p style="font-size:15px;color:#808080;margin:0 0 20px 0;">Trouver le bon produit sans se faire avoir. C'est notre mission.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      <tr>
        <td width="33%" align="center" style="padding:8px;">
          <div style="font-size:28px;font-weight:800;color:#FF6B5F;">5 000+</div>
          <div style="font-size:11px;color:#808080;margin-top:2px;">produits analysés</div>
        </td>
        <td width="33%" align="center" style="padding:8px;">
          <div style="font-size:28px;font-weight:800;color:#3ED6A3;">50 000+</div>
          <div style="font-size:11px;color:#808080;margin-top:2px;">comparaisons IA</div>
        </td>
        <td width="33%" align="center" style="padding:8px;">
          <div style="font-size:28px;font-weight:800;color:#4257FF;">96%</div>
          <div style="font-size:11px;color:#808080;margin-top:2px;">satisfaction</div>
        </td>
      </tr>
    </table>

    <div style="height:1px;background:rgba(255,255,255,0.06);margin:16px 0;"></div>

    <p style="font-size:12px;color:#606060;margin:0 0 16px 0;">On analyse pour toi 24 familles de produits :</p>
    <div style="font-size:11px;color:#808080;">{", ".join(f"{e} {n}" for e, n in CATEGORIES[:8])}<br>{", ".join(f"{e} {n}" for e, n in CATEGORIES[8:16])}<br>{", ".join(f"{e} {n}" for e, n in CATEGORIES[16:])}</div>

    <div style="height:1px;background:rgba(255,255,255,0.06);margin:16px 0;"></div>

    <h2 style="font-size:15px;margin:0 0 14px 0;">⚡ Comment ça marche ?</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="32" valign="top"><div style="width:28px;height:28px;border-radius:50%;background:#4257FF;color:#fff;text-align:center;line-height:28px;font-weight:700;font-size:13px;">1</div></td>
        <td style="padding:0 0 10px 8px;"><div style="font-weight:600;font-size:14px;color:#FFFFFF;">Discute avec l'IA</div><p style="font-size:13px;color:#808080;margin:2px 0 0 0;">Raconte ta vie, ton budget, tes contraintes.</p></td>
      </tr>
      <tr>
        <td width="32" valign="top"><div style="width:28px;height:28px;border-radius:50%;background:#3ED6A3;color:#0E1020;text-align:center;line-height:28px;font-weight:700;font-size:13px;">2</div></td>
        <td style="padding:0 0 10px 8px;"><div style="font-weight:600;font-size:14px;color:#FFFFFF;">Elle filtre sur toi</div><p style="font-size:13px;color:#808080;margin:2px 0 0 0;">Pas de tableau sponsorisé. Juste ce qui te correspond.</p></td>
      </tr>
      <tr>
        <td width="32" valign="top"><div style="width:28px;height:28px;border-radius:50%;background:#FF6B5F;color:#fff;text-align:center;line-height:28px;font-weight:700;font-size:13px;">3</div></td>
        <td style="padding:0 0 0 8px;"><div style="font-weight:600;font-size:14px;color:#FFFFFF;">Un top 3 sur mesure</div><p style="font-size:13px;color:#808080;margin:2px 0 0 0;">Avec les défauts. Et un lien d'achat si tu veux.</p></td>
      </tr>
    </table>

    <div style="margin:20px 0 0 0;">
      <a href="{cta_url}" style="display:inline-block;background:#FF6B5F;color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;">🤖 Trouve mon produit idéal</a>
      <p style="font-size:11px;color:#606060;margin:8px 0 0 0;">Gratuit · Sans inscription · 24/7</p>
    </div>
  </td></tr>
</table>"""

    # ── TOP 3 ──
    top3_html = ""
    if top3:
        medals = ["🥇", "🥈", "🥉"]
        items = ""
        for i, t in enumerate(top3[:3]):
            items += f"""<tr>
  <td style="font-size:20px;width:28px;padding:0 8px 8px 0;">{medals[i]}</td>
  <td style="padding:0 0 8px 0;">
    <div style="font-weight:600;font-size:14px;color:#FFFFFF;">{t.get('name', 'Produit')}</div>
    <div style="font-size:11px;color:#808080;">{t.get('price', '?')}€</div>
  </td>
  <td align="right" style="padding:0 0 8px 0;">
    <span style="display:inline-block;background:rgba(66,87,255,0.12);color:#4257FF;padding:2px 8px;border-radius:4px;font-size:13px;font-weight:700;">{t.get('score', '?')}</span>
  </td>
</tr>"""
        top3_html = f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1D2E;border-radius:16px;">
  <tr><td style="padding:24px;">
    <h2 style="font-size:18px;margin:0 0 12px 0;">🏆 Le Top 3 du moment</h2>
    <table width="100%" cellpadding="0" cellspacing="0">{items}</table>
  </td></tr>
</table>"""

    # ── PRODUIT DU MOIS ──
    product_html = ""
    if product:
        pros_html = ""
        if product.get("pros"):
            for p in product["pros"][:3]:
                pros_html += f'<tr><td style="vertical-align:top;color:#3ED6A3;font-size:13px;width:16px;padding:0 4px 4px 0;">✓</td><td style="font-size:13px;color:#C0C0C0;padding:0 0 4px 0;">{p[:100]}</td></tr>'
        cons_html = ""
        if product.get("cons"):
            for c in product["cons"][:2]:
                cons_html += f'<tr><td style="vertical-align:top;color:#FF6B5F;font-size:13px;width:16px;padding:0 4px 4px 0;">✗</td><td style="font-size:13px;color:#C0C0C0;padding:0 0 4px 0;">{c[:100]}</td></tr>'

        product_html = f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1D2E;border-radius:16px;">
  <tr><td style="padding:24px;">
    <div style="display:inline-block;background:rgba(255,107,95,0.12);color:#FF6B5F;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;margin-bottom:12px;">🌟 Produit du mois</div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="110" valign="top" style="padding:0 14px 0 0;">
          {f'<img src="{product.get("image_url")}" alt="{product.get("name")}" style="width:110px;height:auto;border-radius:10px;display:block;" />' if product.get("image_url") else ''}
        </td>
        <td valign="top">
          <h2 style="font-size:18px;margin:0 0 4px 0;">{product.get("name", "Notre sélection")}</h2>
          <div style="margin:4px 0;">
            <span style="font-size:12px;color:#808080;">À partir de </span>
            <span style="font-size:18px;font-weight:700;color:#FFFFFF;">{product.get("price", "?")}€</span>
            <span style="display:inline-block;margin-left:6px;background:rgba(66,87,255,0.12);color:#4257FF;padding:1px 7px;border-radius:4px;font-size:12px;font-weight:700;">{product.get("score", "?")}/100</span>
          </div>
          <p style="font-size:13px;color:#808080;margin:6px 0 0 0;">{product.get("verdict", "")[:180]}</p>
        </td>
      </tr>
    </table>

    <div style="height:1px;background:rgba(255,255,255,0.06);margin:14px 0;"></div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" valign="top" style="padding:0 8px 0 0;">
          <div style="font-size:12px;font-weight:600;color:#3ED6A3;margin-bottom:6px;">✓ Les plus</div>
          <table cellpadding="0" cellspacing="0">{pros_html}</table>
        </td>
        <td width="50%" valign="top" style="padding:0 0 0 8px;">
          <div style="font-size:12px;font-weight:600;color:#FF6B5F;margin-bottom:6px;">✗ Les moins</div>
          <table cellpadding="0" cellspacing="0">{cons_html}</table>
        </td>
      </tr>
    </table>

    <div style="margin-top:14px;">
      <a href="{product.get("url", cta_url)}" style="display:inline-block;background:#FF6B5F;color:#FFFFFF;text-decoration:none;padding:10px 24px;border-radius:8px;font-weight:600;font-size:13px;">Voir la fiche complète →</a>
    </div>
  </td></tr>
</table>"""

    # ── HACK ──
    hack_html = ""
    if hack:
        hack_html = f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1D2E;border-radius:16px;">
  <tr><td style="padding:24px;">
    <div style="display:inline-block;background:rgba(62,214,163,0.12);color:#3ED6A3;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;margin-bottom:10px;">🔧 Hack anti-obsolescence</div>
    <div style="font-size:15px;color:#C0C0C0;line-height:1.6;white-space:pre-line;">{hack}</div>
  </td></tr>
</table>"""

    # ── EXTRA ──
    extra_html = extra_sections if extra_sections else ""

    # ── VOTE ──
    vote_html = f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1D2E;border-radius:16px;">
  <tr><td style="padding:24px;text-align:center;">
    <div style="display:inline-block;background:rgba(255,176,32,0.12);color:#FFB020;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;margin-bottom:10px;">🗳️ Vote du mois</div>
    <h2 style="font-size:15px;margin:0 0 6px 0;">Quelle catégorie veux-tu qu'on passe au crible ?</h2>
    <p style="font-size:13px;color:#808080;margin:0;">Réponds à cet email avec ta catégorie préférée !</p>
  </td></tr>
</table>"""

    # ── CTA FINAL ──
    cta_html = f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1D2E;border-radius:16px;">
  <tr><td style="padding:24px;text-align:center;">
    <p style="font-size:13px;color:#808080;margin:0 0 12px 0;">Pas convaincu par ces choix ?<br>Parle à l'IA. 3 minutes et elle trouve le produit qui te correspond.</p>
    <a href="{cta_url}" style="display:inline-block;background:#FF6B5F;color:#FFFFFF;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px;">🤖 Trouve mon produit idéal</a>
    <p style="font-size:11px;color:#606060;margin:8px 0 0 0;">Gratuit · Sans inscription · 24/7</p>
  </td></tr>
</table>"""

    # ── ASSEMBLAGE ──
    unsubscribe_url = f\"https://{DOMAIN}/api/newsletter/unsubscribe\"
    current_year = datetime.now().year

    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{BRAND_CSS}
</head>
<body style="margin:0;padding:0;background-color:#0E1020;">
<center>
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0E1020;">
  <tr><td align="center" style="padding:0;">

    <!-- HEADER -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#0E1020;">
      <tr><td style="padding:32px 24px 16px;text-align:center;">
        <div style="font-family:'Inter',Arial,sans-serif;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
          TROV<span style="color:#FF6B5F;">i</span><span style="color:#3ED6A3;">i</span>O
        </div>
        <div style="height:3px;background:linear-gradient(135deg,#FF6B5F,#3ED6A3);margin:10px auto;border-radius:2px;max-width:60px;"></div>
        <div style="font-size:11px;color:#606060;margin-top:6px;">Édition #{edition_number} · {month}</div>
      </td></tr>
    </table>

    <!-- ESPACE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;"><tr><td style="height:8px;"></td></tr></table>

    {hero_html}

    <!-- EDITORIAL -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#1A1D2E;border-radius:16px;">
      <tr><td style="padding:24px;">
        <h2 style="font-size:18px;margin:0 0 10px 0;">✍️ L'édito du mois</h2>
        <div style="font-size:15px;color:#C0C0C0;line-height:1.7;white-space:pre-line;">{editorial}</div>
      </td></tr>
    </table>

    <!-- ESPACE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;"><tr><td style="height:8px;"></td></tr></table>

    {top3_html}

    <!-- ESPACE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;"><tr><td style="height:8px;"></td></tr></table>

    {product_html}

    <!-- ESPACE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;"><tr><td style="height:8px;"></td></tr></table>

    {hack_html}

    <!-- ESPACE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;"><tr><td style="height:8px;"></td></tr></table>

    {extra_html}
    {vote_html}

    <!-- ESPACE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;"><tr><td style="height:8px;"></td></tr></table>

    {cta_html}

    <!-- FOOTER -->
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
      <tr><td style="padding:24px;text-align:center;">
        <div style="font-family:'Inter',Arial,sans-serif;font-size:18px;font-weight:700;margin-bottom:6px;">
          TROV<span style="color:#FF6B5F;">i</span><span style="color:#3ED6A3;">i</span>O
        </div>
        <p style="font-size:11px;color:#606060;line-height:1.5;margin:0;">
          TROViiO · L'IA anti-regret pour vos achats<br>
          <a href="{unsubscribe_url}" style="color:#4257FF;text-decoration:underline;">Se désabonner</a> · <a href="{cta_url}" style="color:#4257FF;text-decoration:underline;">troviio.com</a>
        </p>
      </td></tr>
    </table>

  </td></tr>
</table>
</center>
</body>
</html>"""

    return html


# ── EMAIL SENDING ──


def send_troviio_email(
    to: str,
    subject: str,
    html: str,
    from_email: str | None = None,
) -> dict:
    try:
        response = resend.Emails.send({
            "from": from_email or FROM_EMAIL,
            "to": to,
            "subject": subject,
            "html": html,
        })
        return {"ok": True, "id": response.get("id")}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def send_newsletter_confirmation(to: str, confirm_token: str) -> dict:
    html = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0E1020;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <table style="width:100%;max-width:420px;margin:40px auto;background:#1A1D2E;border-radius:16px;overflow:hidden;">
            <tr>
                <td style="background:linear-gradient(135deg,#FF6B5F,#3ED6A3);padding:28px 20px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:20px;">✨ Bienvenue sur Troviio !</h1>
                </td>
            </tr>
            <tr>
                <td style="padding:28px 20px;text-align:center;">
                    <p style="color:#C0C0C0;font-size:14px;line-height:1.6;margin:0 0 20px;">
                        Reçois chaque mois le Top 3 des meilleurs produits, sélectionnés par notre IA.
                    </p>
                    <a href="https://{DOMAIN}/newsletter/confirm?token={confirm_token}"
                       style="display:inline-block;background:#FF6B5F;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:10px;">
                        ✅ Confirmer mon inscription
                    </a>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    return send_troviio_email(
        to=to,
        subject="Confirme ton inscription à Troviio ✨",
        html=html,
    )
