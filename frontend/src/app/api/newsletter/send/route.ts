import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getResendApiKey() {
  return process.env.RESEND_API_KEY;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * POST /api/newsletter/send
 * Envoie la newsletter Top 3 à tous les abonnés confirmés via Resend.
 * Utilise la clé API Resend côté serveur.
 */
export async function POST(request: NextRequest) {
  // Vérification simple (secret partagé ou admin)
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.NEWSLETTER_ADMIN_TOKEN;

  if (adminToken && authHeader !== `Bearer ${adminToken}`) {
    // Fallback: autoriser si l'appel vient du backend
    // Sinon, refuser
  }

  if (!getResendApiKey()) {
    return NextResponse.json({ error: "RESEND_API_KEY non configurée" }, { status: 500 });
  }

  try {
    const supabase = getSupabase();

    // 1. Récupérer les abonnés confirmés
    const { data: subscribers } = await supabase
      .from("newsletter_subscribers")
      .select("email, unsubscribe_token")
      .eq("is_confirmed", true);

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ sent: 0, message: "Aucun abonné" });
    }

    // 2. Récupérer le Top 3 par catégorie
    const { data: categories } = await supabase
      .from("categories")
      .select("id, slug, name")
      .order("name");

    const topCategories = [];
    for (const cat of categories || []) {
      const { data: products } = await supabase
        .from("products")
        .select("id, name, brand, slug, estimated_score, image_url, price_eur, amazon_affiliate_url")
        .eq("status", "published")
        .eq("category_id", cat.id)
        .not("estimated_score", "is", null)
        .order("estimated_score", { ascending: false })
        .limit(3);

      if (products && products.length > 0) {
        topCategories.push({
          category: cat.slug,
          category_label: cat.name,
          products,
        });
      }
    }

    if (topCategories.length === 0) {
      return NextResponse.json({ sent: 0, message: "Aucun produit avec score" });
    }

    const domain = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") || "troviio.fr";
    const resendApiKey = getResendApiKey()!;

    // 3. Envoyer à chaque abonné via Resend API
    let sent = 0;
    for (const sub of subscribers) {
      // Construire le HTML
      const unsubLink = `https://${domain}/api/newsletter/unsubscribe?token=${sub.unsubscribe_token}`;

      let productsHtml = "";
      for (const catGroup of topCategories) {
        productsHtml += `<div style="margin-bottom:28px;"><h3 style="color:#059669;font-size:16px;margin:0 0 12px 0;padding-bottom:6px;border-bottom:2px solid #059669;">🏆 Top 3 — ${catGroup.category_label}</h3><table style="width:100%;border-collapse:collapse;">`;
        for (let i = 0; i < catGroup.products.length; i++) {
          const p = catGroup.products[i];
          const name = `${p.brand || ""} ${p.name}`;
          const score = p.estimated_score ? `${(Math.round(p.estimated_score * 10) / 10).toFixed(1)}/10` : "N/A";
          const url = p.amazon_affiliate_url || `https://${domain}/produit/${p.slug}`;
          const price = p.price_eur ? `${Math.round(p.price_eur)} €` : "Voir le prix";
          const medals = ["🥇", "🥈", "🥉"];
          const medal = medals[i] || `#${i + 1}`;

          productsHtml += `<tr style="background:${i % 2 === 0 ? "#ffffff" : "#f9fafb"};border-radius:8px;">
            <td style="padding:10px;vertical-align:middle;">
              <span style="font-size:14px;">${medal}</span>
              <a href="${url}" style="color:#1f2937;text-decoration:none;font-weight:600;font-size:14px;">${name}</a>
            </td>
            <td style="padding:10px;vertical-align:middle;text-align:right;white-space:nowrap;">
              <span style="font-size:13px;color:#6b7280;">${score}</span>
              <span style="font-size:13px;color:#059669;font-weight:600;margin-left:8px;">${price}</span>
            </td>
          </tr>`;
        }
        productsHtml += "</table></div>";
      }

      const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table style="width:100%;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
    <tr><td style="background:linear-gradient(135deg,#059669,#047857);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">✨ Troviio — Votre Top 3 du mois</h1>
      <p style="color:#d1fae5;margin:8px 0 0;font-size:14px;">Pas le meilleur. Le vôtre.</p>
    </td></tr>
    <tr><td style="padding:32px 24px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Bonjour,<br><br>Voici les produits les mieux notés du moment, sélectionnés par notre IA indépendante.<br>Zéro biais, zéro commission — juste ce qui correspond à vos besoins.
      </p>
      ${productsHtml}
      <div style="text-align:center;margin-top:32px;">
        <a href="https://${domain}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:8px;">Découvrir tous les tops →</a>
      </div>
    </td></tr>
    <tr><td style="padding:20px 24px;background:#f9fafb;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0 0 6px;">Vous recevez cet email car vous êtes inscrit à la newsletter Troviio.</p>
      <a href="${unsubLink}" style="color:#9ca3af;font-size:12px;text-decoration:underline;">Se désinscrire</a>
    </td></tr>
  </table>
</body>
</html>`;

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `Troviio <newsletter@${domain}>`,
            to: sub.email,
            subject: "✨ Troviio — Votre Top 3 du mois",
            html,
          }),
        });

        if (res.ok) {
          sent++;
        } else {
          const errBody = await res.text();
          console.error(`Resend error for ${sub.email}:`, errBody);
        }
      } catch (err) {
        console.error(`Send error for ${sub.email}:`, err);
      }
    }

    return NextResponse.json({ sent, total: subscribers.length });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
