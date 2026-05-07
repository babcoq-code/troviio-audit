import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "troviio.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // Rediriger www → non-www en 301 permanent
  if (host === "troviio.com" || host === "troviio.com:443" || host === "troviio.com:3000") {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    // Forcer le port 443 (HTTPS standard) si c'est un port de dev
    if (url.port === "3000") url.port = "";
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
