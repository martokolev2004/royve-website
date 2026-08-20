import { NextRequest, NextResponse } from "next/server";
import { PROMO_CODES } from "@/lib/promoCodes";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const promo = PROMO_CODES[code];
  if (!promo) return NextResponse.json({ valid: false });
  return NextResponse.json({ valid: true, discount: promo.discount });
}
