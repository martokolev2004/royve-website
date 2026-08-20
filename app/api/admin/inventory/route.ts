import { NextRequest, NextResponse } from "next/server";
import { getInventory, setInventory } from "@/lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Roy29Rodi";

function checkAuth(req: NextRequest) {
  return req.headers.get("x-admin-password") === ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const inventory = await getInventory();
  return NextResponse.json(inventory);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { productId, quantity } = await req.json();
  if (!productId || quantity == null || quantity < 0) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  await setInventory(productId, quantity);
  return NextResponse.json({ ok: true });
}
