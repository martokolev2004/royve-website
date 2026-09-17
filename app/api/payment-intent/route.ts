import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getStripe } from "@/lib/stripe";
import { saveOrder, checkRateLimit } from "@/lib/db";
import { products } from "@/lib/products";
import { getActivePromoCode } from "@/lib/db";

const BUNDLE_PRICE = 80;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const allowed = await checkRateLimit(ip, "payment-intent", 5, 60);
    if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const { fullName, email, phone, address, city, postalCode, items, boxnowLocationId, boxnowLockerAddress, promoCode, paymentMethod, courier } = body;
    const isBankTransfer = paymentMethod === "bank_transfer";
    const isCod = paymentMethod === "cod";
    const DELIVERY_FEE = 5; // €5 for Econt/Speedy courier

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

    if (promoCode) {
      const promo = await getActivePromoCode(promoCode);
      if (promo) {
        const discountAmount = Math.round(total * promo.discount) / 100;
        total = Math.round((total - discountAmount) * 100) / 100;
      }
    }

    // Add delivery fee for courier orders (not BoxNow, not bank transfer)
    const deliveryFee = (!boxnowLocationId && !isBankTransfer) ? DELIVERY_FEE : 0;
    total = Math.round((total + deliveryFee) * 100) / 100;

    const stripe = getStripe();

    if (isBankTransfer) {
      await saveOrder({
        id: orderId, timestamp, customerName: fullName, customerEmail: email,
        customerPhone: phone, deliveryAddress: address, city, postalCode,
        items: orderItems, total, paymentStatus: "pending_bank_transfer",
        stripeSessionId: undefined, boxnowLocationId: boxnowLocationId || null,
        boxnowLockerAddress: boxnowLockerAddress || null,
        courier: courier || null, deliveryFee,
      });
      return NextResponse.json({ orderId });
    }

    if (isCod) {
      await saveOrder({
        id: orderId, timestamp, customerName: fullName, customerEmail: email,
        customerPhone: phone, deliveryAddress: address, city, postalCode,
        items: orderItems, total, paymentStatus: "pending_cod",
        stripeSessionId: undefined, boxnowLocationId: boxnowLocationId || null,
        boxnowLockerAddress: boxnowLockerAddress || null,
        courier: courier || null, deliveryFee,
      });
      return NextResponse.json({ orderId });
    }

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
      boxnowLockerAddress: boxnowLockerAddress || null,
      courier: courier || null,
      deliveryFee,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Payment intent error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
