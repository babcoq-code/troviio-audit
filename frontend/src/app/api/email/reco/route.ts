import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { randomUUID } from "crypto";

const schema = z.object({
  email: z.string().email("Email invalide.").max(320).transform((v) => v.trim().toLowerCase()),
  result_id: z.string().min(1).max(200),
});

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = (parsed as any).error?.issues?.[0]?.message ?? "Donnees invalides.";
    return NextResponse.json({ error: firstIssue }, { status: 400 });
  }

  const { email, result_id } = parsed.data;

  // Vérifier si la combinaison existe déjà
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from("reco_emails")
    .select("id")
    .eq("email", email)
    .eq("result_id", result_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ status: "already_sent" }, { status: 200 });
  }

  const { error } = await supabase.from("reco_emails").insert({
    email,
    result_id,
    sent_at: new Date().toISOString(),
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  return NextResponse.json({ status: "success" }, { status: 201 });
}
