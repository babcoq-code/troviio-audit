import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const supabase = getSupabase();

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 400 });
  }

  // Supprimer l'abonné via le token
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("unsubscribe_token", token)
    .select("email")
    .single();

  if (error || !data) {
    // Vérifier si c'est via l'email (fallback)
    const email = searchParams.get("email");
    if (email) {
      const { error: delErr } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("email", email);
      if (!delErr) {
        return NextResponse.redirect(new URL("/?newsletter=unsubscribed", request.url));
      }
    }
    return NextResponse.redirect(new URL("/?newsletter=invalid_token", request.url));
  }

  return NextResponse.redirect(new URL("/?newsletter=unsubscribed", request.url));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("email", email);

  if (error) {
    return NextResponse.json({ error: "Erreur lors du désabonnement" }, { status: 500 });
  }

  return NextResponse.json({ status: "unsubscribed" });
}
