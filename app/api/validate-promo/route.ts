import { NextRequest, NextResponse } from "next/server";
import { getActivePromoCode, checkRateLimit } from "@/lib/db";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await checkRateLimit(ip, "validate-promo", 10, 60);
  if (!allowed) return NextResponse.json({ valid: false }, { status: 429 });

  const { code } = await req.json();
  if (!code || typeof code !== "string" || code.length > 50) {
    return NextResponse.json({ valid: false });
  }
  const promo = await getActivePromoCode(code.trim());
  if (!promo) return NextResponse.json({ valid: false });
  return NextResponse.json({ valid: true, discount: promo.discount });
}
