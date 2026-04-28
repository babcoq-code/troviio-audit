import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL ?? "http://backend:8000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream, application/json",
        "X-Forwarded-For": req.headers.get("x-forwarded-for") ?? "unknown",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(25_000),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text().catch(() => "Backend error");
      return NextResponse.json(
        { error: `Service error: ${backendRes.status}` },
        { status: backendRes.status }
      );
    }

    const contentType = backendRes.headers.get("content-type") ?? "application/json";

    return new Response(backendRes.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Accel-Buffering": "no",
      },
    });

  } catch (error: unknown) {
    const isTimeout = error instanceof Error && error.name === "TimeoutError";

    return NextResponse.json(
      {
        error: isTimeout
          ? "L'IA met trop de temps à répondre. Réessaie avec une question plus courte."
          : "Service temporairement indisponible.",
      },
      { status: isTimeout ? 504 : 503 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://www.troviio.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
