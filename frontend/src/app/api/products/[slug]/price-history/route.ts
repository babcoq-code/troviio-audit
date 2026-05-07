import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_BASE_URL || "http://backend:8000";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const searchParams = _req.nextUrl.searchParams.toString();
    const url = `${BACKEND}/api/products/${slug}/price-history${searchParams ? `?${searchParams}` : ""}`;
    
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
    console.error("PRODUCT_PRICE_HISTORY_PROXY_ERROR", slug, e?.message || e);
    return NextResponse.json([], { status: 500 });
  }
}
