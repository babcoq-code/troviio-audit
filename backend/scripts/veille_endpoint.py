"""
Raccourci : endpoint de lecture des données de veille
à ajouter dans backend/app/api/routes/newsletter.py
"""

# ── ENDPOINT VEILLE ──────────────────────────────────────────
from fastapi import APIRouter
import json, os, glob

VEILLE_DIR = "/data/veille"

@router.get("/veille")
async def get_veille(mois: str = ""):
    """Retourne les données de veille. Par défaut : dernier fichier. Sinon ?mois=2026-04"""
    files = sorted(glob.glob(os.path.join(VEILLE_DIR, "*.json")), reverse=True)
    if not files:
        return {"error": "Aucune donnée de veille"}
    
    if mois:
        path = os.path.join(VEILLE_DIR, f"{mois}.json")
        if not os.path.exists(path):
            return {"error": f"Veille {mois} introuvable"}
        files = [path]
    
    with open(files[0]) as f:
        data = json.load(f)
    return data


@router.get("/generate-full")
async def generate_full_newsletter(test_email: str = "vseb@wanadoo.fr", mois: str = ""):
    """Génère la newsletter complète avec les données de veille + DeepSeek."""
    from app.services.email_service import build_newsletter_html, send_troviio_email
    from app.api.routes.newsletter import _deepseek, _voice_system  # lazy import to avoid circular
    
    # Charger la veille
    files = sorted(glob.glob(os.path.join(VEILLE_DIR, "*.json")), reverse=True)
    if not files:
        return {"error": "Aucune veille disponible. Lance /api/newsletter/generate-veille d'abord."}
    
    path = files[0] if not mois else os.path.join(VEILLE_DIR, f"{mois}.json")
    with open(path) as f:
        veille = json.load(f)
    
    month = f"{veille['mois']} {veille['annee']}"
    
    # 1. Générer objet + édito avec la veille en contexte
    veille_context = json.dumps({
        "produit_du_mois": veille.get("produit_du_mois", {}).get("name", ""),
        "accessoire_du_mois": veille.get("accessoire_du_mois", {}).get("name", ""),
        "nouveautes": [n["name"] for n in veille.get("nouveautes", [])],
        "attendus": [a["name"] for a in veille.get("attendus", [])],
        "tendances": veille.get("tendances", ""),
    }, ensure_ascii=False)
    
    system = _voice_system()
    
    subject = await _deepseek(
        f"Génère un objet d'email accrocheur pour la newsletter de {month}. "
        f"Voici le contenu du mois : {veille_context}. "
        "6-9 mots. Intrigant, direct.",
        system=system, max_tokens=50
    )
    subject = subject.strip('"')
    
    editorial = await _deepseek(
        f"Écris l'édito mensuel pour {month}. "
        f"Tendances du mois : {veille.get('tendances', '')[:200]}. "
        f"Produit du mois : {veille.get('produit_du_mois', {}).get('name', '')}. "
        "200 mots max. Commence par 'Salut,'.",
        system=system,
    )
    
    # 2. Construire les sections enrichies
    extra_sections = ""
    
    # Rubrique "Les pépites du mois" (nouveautés)
    if veille.get("nouveautes"):
        items = "".join(f"""
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;padding:12px;background:rgba(255,255,255,0.03);border-radius:14px;">
            <div style="flex:1;">
                <div style="font-weight:600;font-size:15px;">🆕 {n['name']}</div>
                <div style="font-size:12px;color:#9094A8;">{n.get('categorie', '')} · ~{n.get('price', '?')}€</div>
                <div style="font-size:13px;color:#d0d2de;margin-top:4px;">{n.get('notable', '')}</div>
            </div>
            <a href="{n.get('affiliate_url', '#')}" style="white-space:nowrap;font-size:12px;color:#4257FF;text-decoration:none;font-weight:600;">Voir →</a>
        </div>""" for n in veille["nouveautes"])
        
        extra_sections += f"""
    <div class="section">
        <div class="tag blue">🆕 Nouveautés du mois</div>
        <h2 style="font-size:17px;">Les pépites fraîchement sorties</h2>
        <p class="small">On a déniché les produits les plus intéressants sortis ce mois-ci.</p>
        {items}
    </div>"""
    
    # Rubrique "On les attend de pied ferme"
    if veille.get("attendus"):
        items = "".join(f"""
        <div style="margin-bottom:16px;padding:14px;background:rgba(255,176,32,0.05);border-radius:14px;border-left:3px solid #FFB020;">
            <div style="font-weight:700;font-size:16px;margin-bottom:4px;">🔮 {a['name']}</div>
            <div style="font-size:12px;color:#9094A8;margin-bottom:6px;">{a.get('categorie', '')} · Arrivée prévue : {a.get('sortie_prevue', 'bientôt')}</div>
            <p style="font-size:14px;margin-bottom:4px;">{a.get('pourquoi', '')}</p>
            <div style="font-size:13px;color:#FFB020;font-style:italic;">💬 Avis TROViiO : {a.get('avis_troviio', '')}</div>
        </div>""" for a in veille["attendus"])
        
        extra_sections += f"""
    <div class="section" style="background:linear-gradient(135deg,#1A1D2E 0%,#242840 100%);">
        <div class="tag gold">🔮 Produits attendus</div>
        <h2 style="font-size:17px;">Ce qu'on guette avec impatience</h2>
        <p class="small">Les produits qui arrivent et qu'on a hâte de tester.</p>
        {items}
    </div>"""
    
    # 3. Construire le HTML complet
    html = build_newsletter_html(
        month=month,
        edition_number=1,
        subject=subject,
        editorial=editorial,
        is_launch=("juin" in month.lower() or mois == "2026-06"),
        product=veille.get("produit_du_mois") or None,
        scam=None,
        hack=None,
        top3=None,
        reader_qa=None,
        extra_sections=extra_sections,
        cta_url="https://troviio.com",
    )
    
    # 4. Envoi test
    send_result = send_troviio_email(
        to=test_email,
        subject=f"[TEST] {subject}",
        html=html,
    )
    
    return {
        "ok": send_result.get("ok", False),
        "month": month,
        "subject": subject,
        "html_length": len(html),
        "sections": {
            "produit_du_mois": veille.get("produit_du_mois", {}).get("name"),
            "accessoire_du_mois": veille.get("accessoire_du_mois", {}).get("name"),
            "nouveautes": len(veille.get("nouveautes", [])),
            "attendus": len(veille.get("attendus", [])),
            "extra_sections": len(extra_sections) > 0,
        },
        "send_result": send_result,
    }
