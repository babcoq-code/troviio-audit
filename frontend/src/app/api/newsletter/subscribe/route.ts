import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { randomUUID } from "crypto";

const schema = z.object({
  email: z.string().email("Email invalide.").max(320).transform((v) => v.trim().toLowerCase()),
});

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 5;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = (parsed as any).error?.issues?.[0]?.message ?? "Email invalide.";
    return NextResponse.json({ error: firstIssue }, { status: 400 });
  }

  const { email } = parsed.data;
  const supabase = getSupabase();

  // Vérifier si déjà inscrit
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ status: "already_exists" }, { status: 200 });
  }

  // Insérer avec le bon format de la table existante
  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
    categories: [],
    is_confirmed: false,
    confirm_token: randomUUID().replace(/-/g, ""),
    unsubscribe_token: randomUUID().replace(/-/g, ""),
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ status: "already_exists" }, { status: 200 });
    }
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  return NextResponse.json({ status: "success" }, { status: 201 });
}
