import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_BASE_URL || "http://backend:8000";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${BACKEND}/api/products${searchParams ? `?${searchParams}` : ""}`;
    
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    
    if (!res.ok) {
      return NextResponse.json([], { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("PRODUCTS_PROXY_ERROR", e?.message || e);
    return NextResponse.json([], { status: 500 });
  }
}
