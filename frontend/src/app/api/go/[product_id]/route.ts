import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/go/[product_id]
 *
 * Proxy vers le backend FastAPI pour /api/go/{product_id}
 * Évite d'avoir à configurer Traefik pour cette route.
 * Le backend backend tourne sur http://backend:8000 en interne.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }
) {
  const { product_id } = await params;
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || "unknown";
  const pos = searchParams.get("pos") || "0";

  const backendUrl = process.env.API_BASE_URL || "http://backend:8000";

  try {
    const response = await fetch(
      `${backendUrl}/api/go/${encodeURIComponent(product_id)}?src=${encodeURIComponent(src)}&pos=${encodeURIComponent(pos)}`,
      {
        method: "GET",
        redirect: "manual", // On ne suit PAS la redirection — on la forwarde
        headers: {
          "User-Agent": request.headers.get("User-Agent") || "Troviio/1.0",
          "Cookie": request.headers.get("Cookie") || "",
        },
      }
    );

    // Si le backend répond 302 (redirect) ou 301, on forwarde la redirection
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("Location");
      if (location) {
        // Forward the Set-Cookie for session tracking
        const setCookie = response.headers.get("Set-Cookie");
        const headers: Record<string, string> = {};
        if (setCookie) {
          headers["Set-Cookie"] = setCookie;
        }
        return NextResponse.redirect(location, { status: 302, headers });
      }
    }

    // Si le backend répond autre chose (erreur, etc.)
    if (!response.ok) {
      console.error(`[go-proxy] Backend error: ${response.status}`);
      // Fallback: rediriger vers Amazon FR
      return NextResponse.redirect("https://www.amazon.fr", { status: 302 });
    }

    // Normalement /go/ ne doit jamais répondre 200, mais au cas où
    const text = await response.text();
    if (text) {
      return new NextResponse(text, {
        status: response.status,
        headers: { "Content-Type": response.headers.get("Content-Type") || "text/html" },
      });
    }

    return NextResponse.redirect("https://www.amazon.fr", { status: 302 });
  } catch (error) {
    console.error(`[go-proxy] Fetch error for ${product_id}:`, error);
    // Fallback: rediriger vers Amazon FR
    return NextResponse.redirect("https://www.amazon.fr", { status: 302 });
  }
}
