import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { markOrderPaid, getOrderBySessionId } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id: string };

    try {
      await markOrderPaid(session.id);
      const order = await getOrderBySessionId(session.id);

      if (order) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const itemsList = order.items
          .map((i) => `${i.name} × ${i.quantity} — ${i.price * i.quantity} €`)
          .join("\n");

        await resend.emails.send({
          from: "ROYVÉ Orders <orders@royve.eu>",
          to: process.env.ORDER_EMAIL || "orders@royve.com",
          subject: `Платена поръчка #${order.id} — ${order.customerName}`,
          text: `
НОВА ПЛАТЕНА ПОРЪЧКА — ROYVÉ Eyewear
==============================
Номер: ${order.id}
Дата: ${order.timestamp}

КЛИЕНТ
Имe: ${order.customerName}
Имейл: ${order.customerEmail}
Телефон: ${order.customerPhone}

ДОСТАВКА (ECONT)
Адрес: ${order.deliveryAddress}
Град: ${order.city}
Пощенски код: ${order.postalCode}

ПРОДУКТИ
${itemsList}

ОБЩО: ${order.total} €

Плащането е потвърдено от Stripe. Моля, създайте пратка в Econt с горния адрес.
          `.trim(),
        });
      }
    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
