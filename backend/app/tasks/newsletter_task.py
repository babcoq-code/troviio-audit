"""
Troviio — Tâche Celery : Newsletter bi-mensuelle (Top 3)
Scraping + envoi email aux abonnés
"""

import os
import logging
from datetime import datetime, timezone, timedelta

import resend
from app.celery_app import app as celery_app
from app.core.supabase import get_supabase_admin

logger = logging.getLogger("troviio.newsletter")

resend.api_key = os.getenv("RESEND_API_KEY", "")
supabase = get_supabase_admin()
DOMAIN = os.getenv("DOMAIN", "troviio.fr")
FROM_EMAIL = os.getenv("NEWSLETTER_FROM_EMAIL", f"Troviio <newsletter@{DOMAIN}>")


def _get_top_products_by_category(limit: int = 3) -> list[dict]:
    """
    Récupère le Top N produits (par estimated_score) pour chaque catégorie active.
    Retourne une liste de dicts : {category, category_label, products: [...]}
    """
    # Récupérer les catégories qui ont des produits publiés
    cats_resp = (
        supabase.table("categories")
        .select("id, slug, name")
        .order("name")
        .execute()
    )

    if not cats_resp.data:
        logger.warning("Aucune catégorie trouvée")
        return []

    result = []
    for cat in cats_resp.data:
        cat_id = cat["id"]
        cat_slug = cat["slug"]
        cat_name = cat["name"]

        # Top N products for this category by score
        products_resp = (
            supabase.table("products")
            .select("id, name, brand, slug, estimated_score, image_url, amazon_affiliate_url, price_eur")
            .eq("status", "published")
            .eq("category_id", cat_id)
            .is_("estimated_score", "not", None)
            .order("estimated_score", desc=True)
            .limit(limit)
            .execute()
        )

        if not products_resp.data:
            continue

        result.append({
            "category": cat_slug,
            "category_label": cat_name,
            "products": products_resp.data,
        })

    return result


def _build_newsletter_html(
    top_categories: list[dict],
    unsub_token: str | None = None,
) -> str:
    """Construit le HTML de la newsletter Troviio."""
    products_html = ""
    for cat_group in top_categories:
        cat_label = cat_group["category_label"]
        products_html += f"""
        <div style="margin-bottom: 28px;">
            <h3 style="color:#059669; font-size:16px; margin:0 0 12px 0; padding-bottom:6px; border-bottom:2px solid #059669;">
                🏆 Top 3 — {cat_label}
            </h3>
            <table style="width:100%; border-collapse:collapse;">
        """
        for i, p in enumerate(cat_group["products"], 1):
            name = p.get("brand", "") + " " + p.get("name", "")
            score = p.get("estimated_score")
            score_str = f"{score:.1f}/10" if score else "N/A"
            url = p.get("amazon_affiliate_url", f"https://{DOMAIN}/produit/{p.get('slug', '')}")
            img = p.get("image_url", "")
            price = p.get("price_eur")
            price_str = f"{price:.0f} €" if price else "Voir le prix"

            img_cell = ""
            if img:
                img_cell = f'<td style="width:60px; padding:8px 10px 8px 0; vertical-align:middle;"><img src="{img}" alt="{name}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;" /></td>'

            medal = ["🥇", "🥈", "🥉"][i - 1] if i <= 3 else f"#{i}"
            products_html += f"""
                <tr style="background:{'#f9fafb' if i % 2 == 0 else '#ffffff'}; border-radius:8px;">
                    {img_cell}
                    <td style="padding:8px 10px; vertical-align:middle;">
                        <span style="font-size:14px;">{medal}</span>
                        <a href="{url}" style="color:#1f2937; text-decoration:none; font-weight:600; font-size:14px;">
                            {name}
                        </a>
                    </td>
                    <td style="padding:8px 0; vertical-align:middle; text-align:right; white-space:nowrap;">
                        <span style="font-size:13px; color:#6b7280;">{score_str}</span>
                        <span style="font-size:13px; color:#059669; font-weight:600; margin-left:8px;">{price_str}</span>
                    </td>
                </tr>
            """
        products_html += """
            </table>
        </div>
        """

    unsub_link = f\"https://{DOMAIN}/api/newsletter/unsubscribe?token={unsub_token}\" if unsub_token else f\"https://{DOMAIN}/api/newsletter/unsubscribe\"

    html = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table style="width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden;">
        <tr>
            <td style="background:linear-gradient(135deg, #059669 0%, #047857 100%); padding:32px 24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:700;">
                    ✨ Troviio — Votre Top 3 du mois
                </h1>
                <p style="color:#d1fae5; margin:8px 0 0 0; font-size:14px;">
                    Pas le meilleur. Le vôtre.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding:32px 24px;">
                <p style="color:#374151; font-size:15px; line-height:1.6; margin:0 0 24px 0;">
                    Bonjour,<br><br>
                    Voici les produits les mieux notés du moment, sélectionnés par notre IA indépendante.
                    Zéro biais, zéro commission — juste ce qui correspond à vos besoins.
                </p>
                {products_html}
                <div style="text-align:center; margin-top:32px;">
                    <a href="https://{DOMAIN}"
                       style="display:inline-block; background:#059669; color:#ffffff; text-decoration:none;
                              font-size:15px; font-weight:600; padding:12px 28px; border-radius:8px;">
                        Découvrir tous les tops →
                    </a>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding:20px 24px; background:#f9fafb; text-align:center; border-top:1px solid #e5e7eb;">
                <p style="color:#9ca3af; font-size:12px; margin:0 0 6px 0;">
                    Vous recevez cet email car vous êtes inscrit à la newsletter Troviio.
                </p>
                <p style="margin:0;">
                    <a href="{unsub_link}"
                       style="color:#9ca3af; font-size:12px; text-decoration:underline;">
                        Se désinscrire
                    </a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>"""
    return html


@celery_app.task(name="app.tasks.newsletter_task.send_monthly_newsletter")
def send_monthly_newsletter():
    """Envoie la newsletter Top 3 mensuelle à tous les abonnés confirmés."""
    logger.info("Démarrage envoi newsletter mensuelle")

    # 1. Récupérer les abonnés confirmés
    subs = (
        supabase.table("newsletter_subscribers")
        .select("email, unsubscribe_token")
        .eq("is_confirmed", True)
        .execute()
    )
    if not subs.data:
        logger.info("Aucun abonné confirmé")
        return 0

    # 2. Récupérer le Top 3 par catégorie
    top_categories = _get_top_products_by_category(limit=3)
    if not top_categories:
        logger.warning("Aucun produit trouvé pour la newsletter")
        return 0

    logger.info(f"Newsletter préparée avec {len(top_categories)} catégories")

    # 3. Envoyer à chaque abonné
    sent = 0
    errors = 0
    for sub in subs.data:
        try:
            html = _build_newsletter_html(top_categories, sub.get("unsubscribe_token"))
            resend.Emails.send({
                "from": FROM_EMAIL,
                "to": sub["email"],
                "subject": "✨ Troviio — Votre Top 3 du mois",
                "html": html,
            })
            sent += 1
        except Exception as e:
            logger.error(f"Erreur envoi à {sub['email']}: {e}")
            errors += 1

    logger.info(f"✅ Newsletter envoyée à {sent}/{len(subs.data)} abonnés ({errors} erreurs)")
    return sent


@celery_app.task(name="app.tasks.newsletter_task.scrape_new_products")
def scrape_new_products():
    """
    Tâche bi-mensuelle : scrape de nouvelles sorties Amazon par catégorie
    via le scraper existant, puis met à jour les scores.
    """
    logger.info("Démarrage scraping bi-mensuel des nouveaux produits")

    # On importe ici pour éviter les imports circulaires
    from app.tasks.top3_scraper import run_top3_cycle

    try:
        result = run_top3_cycle()
        logger.info(f"Scraping bi-mensuel terminé: {result}")

        # Mettre à jour les scores estimated_score pour les nouveaux produits
        # en les passant dans le pipeline de scraping
        if result.get("new_products_created", 0) > 0:
            logger.info(f"Nouveaux produits créés: {result['new_products_created']}, lancement pipeline...")
            from app.tasks.scraping import run_product_refresh_pipeline

            # Récupérer les produits sans score
            pending = (
                supabase.table("products")
                .select("id")
                .is_("estimated_score", "null")
                .execute()
            )
            for p in (pending.data or []):
                run_product_refresh_pipeline.apply_async(kwargs={"product_id": p["id"]}, queue="scraping")

        return result
    except Exception as e:
        logger.error(f"Erreur scraping bi-mensuel: {e}")
        raise
