import { NextRequest, NextResponse } from "next/server";
import { getActivePromoCode } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const promo = await getActivePromoCode(code);
  if (!promo) return NextResponse.json({ valid: false });
  return NextResponse.json({ valid: true, discount: promo.discount });
}
