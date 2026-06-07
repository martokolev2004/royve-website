import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, address, city, postalCode, items, total } = body;

    const orderId = uuidv4().split("-")[0].toUpperCase();
    const timestamp = new Date().toISOString();

    // Save to SQLite
    try {
      const { saveOrder } = await import("@/lib/db");
      await saveOrder({
        id: orderId,
        timestamp,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        deliveryAddress: address,
        city,
        postalCode,
        items,
        total,
      });
    } catch (dbErr) {
      console.error("DB save error:", dbErr);
    }

    // Send email via Resend
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

      const itemsList = items
        .map((i: { name: string; quantity: number; price: number }) => `${i.name} × ${i.quantity} — ${i.price * i.quantity} €`)
        .join("\n");

      await resend.emails.send({
        from: "ROYVÉ Orders <orders@royve.com>",
        to: process.env.ORDER_EMAIL || "orders@royve.com",
        subject: `Нова поръчка #${orderId} — ${fullName}`,
        text: `
НОВА ПОРЪЧКА — ROYVÉ Eyewear
==============================
Номер: ${orderId}
Дата: ${timestamp}

КЛИЕНТ
Имe: ${fullName}
Имейл: ${email}
Телефон: ${phone}

ДОСТАВКА
Адрес: ${address}
Град: ${city}
Пощенски код: ${postalCode}

ПРОДУКТИ
${itemsList}

ОБЩО: ${total} €
        `.trim(),
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    return NextResponse.json({ orderId, success: true });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
