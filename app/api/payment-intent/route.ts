import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getStripe } from "@/lib/stripe";
import { saveOrder } from "@/lib/db";
import { products } from "@/lib/products";
import { applyPromo } from "@/lib/promoCodes";

const BUNDLE_PRICE = 80;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, address, city, postalCode, items, boxnowLocationId, promoCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const orderId = uuidv4().split("-")[0].toUpperCase();
    const timestamp = new Date().toISOString();

    // Re-derive prices server-side
    const orderItems = (items as { name: string; quantity: number }[]).flatMap((i) => {
      const product = products.find((p) => p.name === i.name);
      if (!product) return [];
      return [{ name: product.name, price: product.price, quantity: i.quantity }];
    });

    const units = orderItems.flatMap((i) => Array(i.quantity).fill({ name: i.name, price: i.price }));
    units.sort((a: { price: number }, b: { price: number }) => b.price - a.price);

    let total = 0;
    let i = 0;
    while (i < units.length) {
      if (i + 1 < units.length) {
        const pairSum = units[i].price + units[i + 1].price;
        if (pairSum > BUNDLE_PRICE) { total += BUNDLE_PRICE; i += 2; continue; }
      }
      total += units[i].price;
      i++;
    }
    total = Math.round(total * 100) / 100;

    let promoDiscount = 0;
    if (promoCode) {
      const promoResult = applyPromo(total, promoCode);
      if (promoResult) {
        promoDiscount = promoResult.discountAmount;
        total = promoResult.discountedTotal;
      }
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "eur",
      receipt_email: email,
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });

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
      stripeSessionId: paymentIntent.id,
      boxnowLocationId: boxnowLocationId || null,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId });
  } catch (err) {
    console.error("Payment intent error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
