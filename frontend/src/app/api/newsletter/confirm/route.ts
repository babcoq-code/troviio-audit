import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/?newsletter=missing_token", request.url));
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";
    const response = await fetch(`${apiUrl}/newsletter/confirm?token=${token}`);

    if (response.ok) {
      return NextResponse.redirect(new URL("/?newsletter=confirmed", request.url));
    } else {
      return NextResponse.redirect(new URL("/?newsletter=invalid_token", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/?newsletter=error", request.url));
  }
}
