import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/lib/db";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Roy29Rodi";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  if (auth !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getAllOrders();
  return NextResponse.json(orders);
}
