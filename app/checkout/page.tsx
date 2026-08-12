"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useCartStore } from "@/lib/store";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(3),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { t } = useLang();
  const { items, subtotal, bundleSavings, total, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const { url } = await res.json();
      clearCart();
      window.location.href = url;
    } catch {
      setError("Грешка при изпращане. Опитайте отново. / Error submitting. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-dark-1 min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <AnimatedSection>
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— ROYVÉ —</p>
          <h1 className="font-serif text-5xl font-bold text-white tracking-widest mb-12">
            {t("checkout", "title")}
          </h1>
        </AnimatedSection>

        {items.length === 0 ? (
          <AnimatedSection className="text-center py-24">
            <p className="text-white/30 text-sm tracking-widest font-sans mb-8">{t("cart", "empty")}</p>
            <Link href="/shop" className="btn-luxury inline-block"><span>{t("cart", "continue")}</span></Link>
          </AnimatedSection>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Form fields */}
              <div className="lg:col-span-2 space-y-8">
                {/* Customer info */}
                <AnimatedSection>
                  <h2 className="text-xs tracking-[0.4em] uppercase text-gold font-sans mb-6">
                    — {t("checkout", "title")} —
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full name */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">
                        {t("checkout", "fullName")}
                      </label>
                      <input
                        {...register("fullName")}
                        className="luxury-input"
                        placeholder={t("checkout", "fullName")}
                      />
                      {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">
                        {t("checkout", "email")}
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        className="luxury-input"
                        placeholder="email@example.com"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">
                        {t("checkout", "phone")}
                      </label>
                      <input
                        {...register("phone")}
                        type="tel"
                        className="luxury-input"
                        placeholder="+359 ..."
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">
                        {t("checkout", "address")}
                      </label>
                      <input
                        {...register("address")}
                        className="luxury-input"
                        placeholder={t("checkout", "address")}
                      />
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">
                        {t("checkout", "city")}
                      </label>
                      <input
                        {...register("city")}
                        className="luxury-input"
                        placeholder={t("checkout", "city")}
                      />
                      {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                    </div>

                    {/* Postal code */}
                    <div>
                      <label className="block text-xs text-white/40 tracking-widest uppercase font-sans mb-2">
                        {t("checkout", "postalCode")}
                      </label>
                      <input
                        {...register("postalCode")}
                        className="luxury-input"
                        placeholder="1000"
                      />
                      {errors.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode.message}</p>}
                    </div>
                  </div>
                </AnimatedSection>

                {/* Payment section */}
                <AnimatedSection delay={0.1}>
                  <h2 className="text-xs tracking-[0.4em] uppercase text-gold font-sans mb-6">
                    — {t("checkout", "payment")} —
                  </h2>
                  <div className="bg-dark-2 border border-white/5 p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-sans tracking-widest uppercase">
                        {lang === "bg" ? "Сигурно плащане чрез Stripe" : "Secure payment via Stripe"}
                      </p>
                      <p className="text-white/30 text-xs font-sans mt-1">
                        {lang === "bg"
                          ? "След потвърждение ще бъдете пренасочени към страницата за плащане"
                          : "After confirmation you will be redirected to the payment page"}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>

                {error && (
                  <p className="text-red-400 text-sm font-sans bg-red-400/10 border border-red-400/20 px-4 py-3">{error}</p>
                )}
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
                        <span>{t("cart", "subtotal")}</span>
                        <span>{subtotal()} €</span>
                      </div>
                      <div className="flex justify-between text-xs font-sans text-gold mb-6">
                        <span>{t("cart", "bundleDiscount")}</span>
                        <span>−{bundleSavings()} €</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xs tracking-[0.3em] uppercase font-sans text-white/60">{t("cart", "total")}</span>
                    <span className="font-serif text-2xl text-gold font-bold">{total()} €</span>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="btn-luxury w-full text-center text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>
                      {submitting ? "..." : t("checkout", "confirm")}
                    </span>
                  </motion.button>
                </div>
              </AnimatedSection>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
