import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { markOrderPaid, getOrderBySessionId, updateBoxNowReference } from "@/lib/db";

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
        // Create BoxNow delivery if locker was selected
        let boxnowRef = "";
        if (order.boxnowLocationId) {
          try {
            const { createBoxNowDelivery } = await import("@/lib/boxnow");
            boxnowRef = await createBoxNowDelivery({
              orderId: order.id,
              total: order.total,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              customerPhone: order.customerPhone,
              destinationLocationId: order.boxnowLocationId,
              items: order.items,
            });
            await updateBoxNowReference(order.id, boxnowRef);
          } catch (bnErr) {
            console.error("BoxNow delivery creation failed:", bnErr);
          }
        }

        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const itemsList = order.items
          .map((i) => `${i.name} × ${i.quantity} — ${i.price * i.quantity} €`)
          .join("\n");

        const deliveryInfo = order.boxnowLocationId
          ? `ДОСТАВКА (BOX NOW)\nАвтомат ID: ${order.boxnowLocationId}\nБОX NOW реф: ${boxnowRef || "— (грешка при създаване)"}`
          : `ДОСТАВКА\nАдрес: ${order.deliveryAddress}\nГрад: ${order.city}\nПощенски код: ${order.postalCode}`;

        await resend.emails.send({
          from: "ROYVÉ Orders <orders@royve.eu>",
          to: process.env.ORDER_EMAIL || "royve.eyewear@gmail.com",
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

${deliveryInfo}

ПРОДУКТИ
${itemsList}

ОБЩО: ${order.total} €

Плащането е потвърдено от Stripe.
          `.trim(),
        });
      }
    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
