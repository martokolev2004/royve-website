import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getStripe } from "@/lib/stripe";
import { saveOrder } from "@/lib/db";
import { products } from "@/lib/products";

const BUNDLE_PRICE = 80;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, address, city, postalCode, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const orderId = uuidv4().split("-")[0].toUpperCase();
    const timestamp = new Date().toISOString();
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Re-derive canonical prices server-side — never trust client-sent prices.
    const orderItems = (items as { name: string; quantity: number }[]).flatMap((i) => {
      const product = products.find((p) => p.name === i.name);
      if (!product) return [];
      return [{ name: product.name, price: product.price, quantity: i.quantity }];
    });
    const units = orderItems.flatMap((i) => Array(i.quantity).fill({ name: i.name, price: i.price }));
    units.sort((a, b) => b.price - a.price);

    const lineItems: { price_data: { currency: string; product_data: { name: string }; unit_amount: number }; quantity: number }[] = [];
    let total = 0;
    let i = 0;
    while (i < units.length) {
      if (i + 1 < units.length) {
        const pairSum = units[i].price + units[i + 1].price;
        if (pairSum > BUNDLE_PRICE) {
          lineItems.push({
            price_data: {
              currency: "eur",
              product_data: { name: `ROYVÉ Bundle — ${units[i].name} + ${units[i + 1].name}` },
              unit_amount: Math.round(BUNDLE_PRICE * 100),
            },
            quantity: 1,
          });
          total += BUNDLE_PRICE;
          i += 2;
          continue;
        }
      }
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: `ROYVÉ ${units[i].name}` },
          unit_amount: Math.round(units[i].price * 100),
        },
        quantity: 1,
      });
      total += units[i].price;
      i += 1;
    }
    total = Math.round(total * 100) / 100;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: lineItems,
      success_url: `${origin}/success?order=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: { orderId },
    });

    // Save order as pending until payment is confirmed by webhook
    try {
      await saveOrder({
        id: orderId,
        timestamp,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        deliveryAddress: address,
        city,
        postalCode,
        items: orderItems,
        total,
        paymentStatus: "pending",
        stripeSessionId: session.id,
      });
    } catch (dbErr) {
      console.error("DB save error:", dbErr);
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
