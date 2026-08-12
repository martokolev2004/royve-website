"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLang } from "@/context/LanguageContext";
import { useCartStore } from "@/lib/store";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(3),
});

type FormData = z.infer<typeof schema>;

interface BoxNowLocker {
  id: string;
  address: string;
  name: string;
}

const CARD_STYLE = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily: "sans-serif",
      fontSize: "14px",
      "::placeholder": { color: "rgba(255,255,255,0.25)" },
    },
    invalid: { color: "#f87171" },
  },
};

function CheckoutForm() {
  const { t } = useLang();
  const { items, subtotal, bundleSavings, total, clearCart } = useCartStore();
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedLocker, setSelectedLocker] = useState<BoxNowLocker | null>(null);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__boxnowAfterSelect = (s: { boxnowLockerId: string; boxnowLockerAddressLine1: string; boxnowLockerName?: string }) => {
      setSelectedLocker({ id: s.boxnowLockerId, address: s.boxnowLockerAddressLine1, name: s.boxnowLockerName || s.boxnowLockerAddressLine1 });
    };
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    if (!stripe || !elements || items.length === 0) return;
    setSubmitting(true);
    setError("");

    try {
      // Create PaymentIntent server-side
      const res = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({ name: i.product.name, quantity: i.quantity })),
          boxnowLocationId: selectedLocker?.id || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create payment");
      const { clientSecret, orderId } = await res.json();

      // Confirm card payment directly on site
      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) throw new Error("Card element not found");

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: data.fullName,
            email: data.email,
            phone: data.phone,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Грешка при плащане.");
        setSubmitting(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        clearCart();
        window.location.href = `/success?order=${orderId}`;
      }
    } catch {
      setError("Грешка при изпращане. Опитайте отново.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">

          {/* Contact & delivery */}
          <AnimatedSection>
            <h2 className="text-xs tracking-[0.4em] uppercase text-gold font-sans mb-6">— {t("checkout", "title")} —</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">{t("checkout", "fullName")}</label>
                <input {...register("fullName")} className="luxury-input" placeholder={t("checkout", "fullName")} />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">{t("checkout", "email")}</label>
                <input {...register("email")} type="email" className="luxury-input" placeholder="email@example.com" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">{t("checkout", "phone")}</label>
                <input {...register("phone")} type="tel" className="luxury-input" placeholder="+359 ..." />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">{t("checkout", "address")}</label>
                <input {...register("address")} className="luxury-input" placeholder={t("checkout", "address")} />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">{t("checkout", "city")}</label>
                <input {...register("city")} className="luxury-input" placeholder={t("checkout", "city")} />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">{t("checkout", "postalCode")}</label>
                <input {...register("postalCode")} className="luxury-input" placeholder="1000" />
                {errors.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode.message}</p>}
              </div>
            </div>
          </AnimatedSection>

          {/* BoxNow */}
          <AnimatedSection>
            <div className="border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#00c853] flex items-center justify-center text-white text-xs font-bold">BN</div>
                <h3 className="text-xs tracking-[0.4em] uppercase text-white/60 font-sans">BOX NOW — {t("checkout", "boxnow")}</h3>
              </div>
              {selectedLocker ? (
                <div className="flex items-center justify-between bg-dark-2 border border-gold/20 px-4 py-3">
                  <div>
                    <p className="text-white text-xs font-sans tracking-wide">{selectedLocker.name}</p>
                    <p className="text-white/40 text-xs font-sans mt-0.5">{selectedLocker.address}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedLocker(null)} className="text-white/30 hover:text-gold text-[10px] tracking-widest uppercase font-sans transition-colors ml-4">
                    {t("checkout", "changeLocker")}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-white/40 text-xs font-sans mb-4">{t("checkout", "boxnowDesc")}</p>
                  <button type="button" className="boxnow-widget-button btn-luxury text-xs">
                    <span>{t("checkout", "selectLocker")}</span>
                  </button>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Card payment */}
          <AnimatedSection>
            <div className="border border-white/10 p-6">
              <h3 className="text-xs tracking-[0.4em] uppercase text-gold font-sans mb-6">— {t("checkout", "payment")} —</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">Номер на карта</label>
                  <div className="luxury-input py-3.5">
                    <CardNumberElement options={CARD_STYLE} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">Валидност</label>
                    <div className="luxury-input py-3.5">
                      <CardExpiryElement options={CARD_STYLE} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">CVC</label>
                    <div className="luxury-input py-3.5">
                      <CardCvcElement options={CARD_STYLE} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {error && <p className="text-red-400 text-sm font-sans bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>}
        </div>

        {/* Order summary */}
        <AnimatedSection direction="right" delay={0.2}>
          <div className="bg-dark-2 border border-white/5 p-8 sticky top-24">
            <h2 className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-6">{t("checkout", "orderSummary")}</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs font-sans">
                  <span className="text-white/50">{item.product.name} × {item.quantity}</span>
                  <span className="text-white/70">{item.product.price * item.quantity} €</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/10 mb-6" />
            {bundleSavings() > 0 && (
              <>
                <div className="flex justify-between text-xs font-sans text-white/40 mb-2">
                  <span>{t("cart", "subtotal")}</span><span>{subtotal()} €</span>
                </div>
                <div className="flex justify-between text-xs font-sans text-gold mb-6">
                  <span>{t("cart", "bundleDiscount")}</span><span>−{bundleSavings()} €</span>
                </div>
              </>
            )}
            {selectedLocker && (
              <div className="flex items-center gap-2 mb-4 text-xs font-sans text-[#00c853]">
                <span>✓</span><span>BOX NOW: {selectedLocker.address}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs tracking-[0.3em] uppercase font-sans text-white/60">{t("cart", "total")}</span>
              <span className="font-serif text-2xl text-gold font-bold">{total()} €</span>
            </div>
            <motion.button
              type="submit"
              disabled={submitting || !stripe}
              className="btn-luxury w-full text-center text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.98 }}
            >
              <span>{submitting ? "..." : t("checkout", "confirm")}</span>
            </motion.button>
            <p className="text-white/20 text-[10px] text-center mt-3 font-sans tracking-wider">🔒 Защитено от Stripe</p>
          </div>
        </AnimatedSection>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { t } = useLang();
  const { items } = useCartStore();

  return (
    <div className="bg-dark-1 min-h-screen pt-20">
      <Script id="boxnow-config" strategy="afterInteractive">{`
        window._bn_map_widget_config = {
          partnerId: 17321,
          parentElement: "#boxnowmap",
          type: "popup",
          autoclose: true,
          buttonSelector: ".boxnow-widget-button",
          afterSelect: function(s) {
            window.__boxnowAfterSelect && window.__boxnowAfterSelect(s);
          }
        };
        (function(d){
          var e = d.createElement("script");
          e.src = "https://widgetcdn.boxnow.bg/map-widget/client/v5.js";
          e.async = true;
          d.getElementsByTagName("head")[0].appendChild(e);
        })(document);
      `}</Script>
      <div id="boxnowmap" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <AnimatedSection>
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— ROYVÉ —</p>
          <h1 className="font-serif text-5xl font-bold text-white tracking-widest mb-12">{t("checkout", "title")}</h1>
        </AnimatedSection>

        {items.length === 0 ? (
          <AnimatedSection className="text-center py-24">
            <p className="text-white/30 text-sm tracking-widest font-sans mb-8">{t("cart", "empty")}</p>
            <Link href="/shop" className="btn-luxury inline-block"><span>{t("cart", "continue")}</span></Link>
          </AnimatedSection>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
      <Footer />
    </div>
  );
}
