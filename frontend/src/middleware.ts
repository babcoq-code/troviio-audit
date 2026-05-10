import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Normalize duel URLs: /duel/B-vs-A → 301 to /duel/A-vs-B (alphabetical order)
  const duelMatch = pathname.match(/^\/duel\/(.+)-vs-(.+)$/);
  if (duelMatch) {
    const [, a, b] = duelMatch;
    // Compare slugs alphabetically (case-insensitive)
    if (a.localeCompare(b, "fr", { sensitivity: "base" }) > 0) {
      const url = request.nextUrl.clone();
      url.pathname = `/duel/${b}-vs-${a}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // Redirect /tops/meilleurs-* → /tops (fallback pour les URLs plurielles 404)
  if (pathname.startsWith("/tops/meilleurs-")) {
    const url = request.nextUrl.clone();
    url.pathname = "/tops";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/duel/:path*", "/tops/meilleurs-:path*"],
};
