import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { markOrderPaid, markOrderPaidById, getOrderBySessionId, getOrderById, updateBoxNowReference, decreaseInventory } from "@/lib/db";
import type { OrderData } from "@/lib/db";
import { products } from "@/lib/products";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
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
      if (order) { await decreaseStockForOrder(order); await fulfill(order); }
    } catch (err) {
      console.error("Checkout webhook error:", err);
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as { metadata: { orderId?: string } };
    const orderId = pi.metadata?.orderId;
    if (orderId) {
      try {
        await markOrderPaidById(orderId);
        const order = await getOrderById(orderId);
        if (order) { await decreaseStockForOrder(order); await fulfill(order); }
      } catch (err) {
        console.error("PaymentIntent webhook error:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function decreaseStockForOrder(order: OrderData) {
  for (const item of order.items) {
    const product = products.find((p) => p.name === item.name);
    if (product) {
      await decreaseInventory(product.id, item.quantity);
    }
  }
}

async function fulfill(order: OrderData) {
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
    } catch (err) {
      console.error("BoxNow delivery error:", err);
    }
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const itemsList = order.items.map((i) => `${i.name} × ${i.quantity} — ${i.price * i.quantity} €`).join("\n");
  const deliveryInfo = order.boxnowLocationId
    ? `📦 ДОСТАВКА: BOX NOW АВТОМАТ\nАвтомат ID: ${order.boxnowLocationId}\nBOX NOW реф: ${boxnowRef || "грешка"}`
    : `Адрес: ${order.deliveryAddress}, ${order.city} ${order.postalCode}`;

  // Admin notification
  await resend.emails.send({
    from: "ROYVÉ Orders <orders@royve.eu>",
    to: process.env.ORDER_EMAIL || "royve.eyewear@gmail.com",
    subject: `Платена поръчка #${order.id} — ${order.customerName}`,
    text: `НОВА ПЛАТЕНА ПОРЪЧКА\n\nНомер: ${order.id}\nКлиент: ${order.customerName}\nИмейл: ${order.customerEmail}\nТелефон: ${order.customerPhone}\n\n${deliveryInfo}\n\nПРОДУКТИ:\n${itemsList}\n\nОБЩО: ${order.total} €`,
  });

  // Customer confirmation
  const customerDeliveryInfo = order.boxnowLocationId
    ? `📦 BOX NOW автомат${boxnowRef ? `\nНомер на пратката: ${boxnowRef}` : ""}`
    : `🚚 Куриер на адрес: ${order.deliveryAddress}, ${order.city} ${order.postalCode}`;

  await resend.emails.send({
    from: "ROYVÉ <orders@royve.eu>",
    to: order.customerEmail,
    subject: `Потвърждение на поръчка #${order.id} — ROYVÉ`,
    html: `
<!DOCTYPE html>
<html lang="bg">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="text-align:center;padding-bottom:32px;">
          <p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;">— ROYVÉ EYEWEAR —</p>
          <h1 style="margin:8px 0 0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.1em;">Благодарим ти!</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.4);font-size:13px;">Поръчката ти е потвърдена.</p>
        </td></tr>

        <tr><td style="background:#111111;border:1px solid rgba(255,255,255,0.08);padding:28px;">
          <p style="margin:0 0 4px;color:rgba(255,255,255,0.3);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;">Номер на поръчка</p>
          <p style="margin:0 0 20px;color:#c9a84c;font-size:18px;font-weight:700;letter-spacing:0.15em;">#${order.id}</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;margin-bottom:16px;">
            ${order.items.map((item) => `
            <tr>
              <td style="padding:6px 0;color:rgba(255,255,255,0.7);font-size:13px;">${item.name} × ${item.quantity}</td>
              <td style="padding:6px 0;color:#c9a84c;font-size:13px;text-align:right;">${(item.price * item.quantity).toFixed(2)} €</td>
            </tr>`).join("")}
            <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.08);padding-top:12px;"></td></tr>
            <tr>
              <td style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;">Общо</td>
              <td style="color:#c9a84c;font-size:18px;font-weight:700;text-align:right;">${order.total} €</td>
            </tr>
          </table>

          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);padding:16px;margin-top:20px;">
            <p style="margin:0 0 6px;color:rgba(255,255,255,0.3);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;">Доставка</p>
            <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;white-space:pre-line;">${customerDeliveryInfo}</p>
          </div>
        </td></tr>

        <tr><td style="text-align:center;padding-top:28px;">
          <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px;">При въпроси пиши на <a href="mailto:royve.eyewear@gmail.com" style="color:#c9a84c;">royve.eyewear@gmail.com</a></p>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.1);font-size:10px;letter-spacing:0.2em;">ROYVÉ — NOT FOR EVERYONE.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
