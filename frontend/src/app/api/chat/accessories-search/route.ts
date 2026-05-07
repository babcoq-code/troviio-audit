import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_BASE_URL || "http://backend:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/api/chat/accessories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { reply: "Erreur serveur. Réessaie.", done: true },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("ACCESSORY_CHAT_PROXY_ERROR", e?.message || e);
    return NextResponse.json(
      { reply: "Service momentanément indisponible.", done: true },
      { status: 500 }
    );
  }
}
