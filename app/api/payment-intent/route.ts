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
    const { fullName, email, phone, address, city, postalCode, items, boxnowLocationId, promoCode, paymentMethod } = body;
    const isBankTransfer = paymentMethod === "bank_transfer";

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

    const stripe = getStripe();

    if (isBankTransfer) {
      const customer = await stripe.customers.create({ email, name: fullName });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: "eur",
        customer: customer.id,
        payment_method_types: ["customer_balance"],
        payment_method_data: { type: "customer_balance" },
        payment_method_options: {
          customer_balance: {
            funding_type: "bank_transfer",
            bank_transfer: {
              type: "eu_bank_transfer",
              eu_bank_transfer: { country: "BG" },
            },
          },
        },
        confirm: true,
        receipt_email: email,
        metadata: { orderId },
      });

      await saveOrder({
        id: orderId, timestamp, customerName: fullName, customerEmail: email,
        customerPhone: phone, deliveryAddress: address, city, postalCode,
        items: orderItems, total, paymentStatus: "pending",
        stripeSessionId: paymentIntent.id, boxnowLocationId: boxnowLocationId || null,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hostedUrl = (paymentIntent.next_action as any)?.display_bank_transfer_instructions?.hosted_instructions_url ?? null;
      return NextResponse.json({ hostedUrl, orderId });
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
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId });
  } catch (err) {
    console.error("Payment intent error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
