import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_BASE_URL || "http://backend:8000";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const res = await fetch(`${BACKEND}/api/products/${slug}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return NextResponse.json(null, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("PROXY_ERROR", slug, e?.message || e);
    return NextResponse.json(null, { status: 500 });
  }
}
