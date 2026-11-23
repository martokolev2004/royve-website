import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/lib/db";
import { sendOrderEmails } from "@/lib/emails";

export async function POST(req: NextRequest) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Roy29Rodi";
  if (req.headers.get("x-admin-password") !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getAllOrders();
  const targets = orders.filter(
    (o) => o.paymentStatus === "pending_bank_transfer" || o.paymentStatus === "pending_cod"
  );

  const results: { id: string; status: string }[] = [];
  for (const order of targets) {
    try {
      const type = order.paymentStatus === "pending_bank_transfer" ? "bank_transfer" : "cod";
      await sendOrderEmails(order, type as "bank_transfer" | "cod");
      results.push({ id: order.id, status: "sent" });
    } catch (e) {
      results.push({ id: order.id, status: `error: ${e}` });
    }
  }

  return NextResponse.json({ sent: results.length, results });
}
