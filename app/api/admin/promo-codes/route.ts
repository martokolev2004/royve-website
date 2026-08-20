import { NextRequest, NextResponse } from "next/server";
import { getPromoCodes, upsertPromoCode, deletePromoCode } from "@/lib/db";

const ADMIN_PASSWORD = "Roy29Rodi";

function auth(req: NextRequest) {
  return req.headers.get("x-admin-password") === ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getPromoCodes());
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { code, discount, active } = await req.json();
  if (!code || typeof discount !== "number") return NextResponse.json({ error: "Invalid" }, { status: 400 });
  await upsertPromoCode(code.trim(), discount, active !== false);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { code } = await req.json();
  await deletePromoCode(code);
  return NextResponse.json({ ok: true });
}
