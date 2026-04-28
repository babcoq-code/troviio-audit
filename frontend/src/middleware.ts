import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
