import { NextResponse, type NextRequest } from "next/server";

const API_UPSTREAM = process.env.API_BASE_URL || "http://backend:8000";
const API_PREFIX = "/api/chat";
const API_PREFIXES = ["/api/chat", "/api/newsletter", "/api/affiliate", "/api/products", "/api/results", "/api/accessories", "/api/admin", "/api/kelkoo", "/api/tops"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // Redirection picksy → troviio
  if (host.includes("picksy.babcoq.tech")) {
    const newUrl = request.nextUrl.clone();
    newUrl.host = "www.troviio.com";
    return NextResponse.redirect(newUrl, 301);
  }

  // Redirection /methode → /methodologie
  if (pathname === "/methode") {
    return NextResponse.redirect(new URL("/methodologie", request.url), 301);
  }

  // Proxy API calls to backend
  const isApiPath = API_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
  if (isApiPath) {
    const upstreamUrl = `${API_UPSTREAM}${pathname}${request.nextUrl.search}`;
    const headers = new Headers(request.headers);
    // Remove hop-by-hop headers
    headers.delete("connection");
    headers.delete("transfer-encoding");

    const response = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
      // @ts-expect-error – duplex is valid for streaming
      duplex: request.method !== "GET" && request.method !== "HEAD" ? "half" : undefined,
    });

    const proxyHeaders = new Headers(response.headers);
    proxyHeaders.delete("transfer-encoding");
    proxyHeaders.delete("connection");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: proxyHeaders,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
