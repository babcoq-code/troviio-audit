// middleware.ts — COPIER À LA RACINE DU PROJET
// Corrige : redirect picksy.babcoq.tech → troviio.com
// Ajoute : HTTPS force, headers sécurité, cache SEO

import { NextRequest, NextResponse } from "next/server";

const LEGACY_HOST = "picksy.babcoq.tech";
const CANONICAL_ORIGIN = "https://www.troviio.com";

const STATIC_PATH_PREFIXES = [
  "/guide/", "/comparatif/", "/produit/",
  "/a-propos", "/methode", "/mentions-legales", "/cookies",
] as const;

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://plausible.io",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://api.brevo.com https://plausible.io https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

function isStaticPath(pathname: string): boolean {
  return STATIC_PATH_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { hostname, pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();

  // 1. Redirect legacy domain → troviio.com (301 permanent)
  if (hostname === LEGACY_HOST || hostname === `www.${LEGACY_HOST}`) {
    return NextResponse.redirect(
      new URL(`${CANONICAL_ORIGIN}${pathname}${search}`),
      { status: 301 }
    );
  }

  // 2. Redirect non-www → www
  if (hostname === "troviio.com") {
    url.hostname = "www.troviio.com";
    return NextResponse.redirect(url, { status: 301 });
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", CSP_DIRECTIVES);

  // Cache pages SEO statiques
  if (isStaticPath(pathname)) {
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  }

  // No-cache API/admin
  if (pathname.startsWith("/api/") || pathname.startsWith("/admin/")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)",
  ],
};
