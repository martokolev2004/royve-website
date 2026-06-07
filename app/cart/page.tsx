"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useCartStore } from "@/lib/store";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { t } = useLang();
  const { items, removeItem, updateQuantity, total } = useCartStore();

  return (
    <div className="bg-dark-1 min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <AnimatedSection>
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— ROYVÉ —</p>
          <h1 className="font-serif text-5xl font-bold text-white tracking-widest mb-12">
            {t("cart", "title")}
          </h1>
        </AnimatedSection>

        {items.length === 0 ? (
          <AnimatedSection className="text-center py-24">
            <p className="text-white/30 text-sm tracking-widest font-sans mb-8">{t("cart", "empty")}</p>
            <Link href="/shop" className="btn-luxury inline-block">
              <span>{t("cart", "continue")}</span>
            </Link>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-5 bg-dark-2 border border-white/5 p-4 hover:border-gold/20 transition-colors"
                  >
                    <div className="relative w-24 h-18 bg-dark-1 flex-shrink-0 overflow-hidden" style={{ height: "72px" }}>
                      <Image
                        src={`/products/${item.product.id}.svg`}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-white tracking-widest">{item.product.name}</h3>
                          <p className="text-white/30 text-xs font-sans mt-1">{item.product.category}</p>
                        </div>
                        <span className="font-serif text-gold font-semibold">{item.product.price * item.quantity} €</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 border border-white/20 text-white/60 hover:border-gold hover:text-gold transition-colors text-sm"
                          >
                            −
                          </button>
                          <span className="text-white text-sm font-sans w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 border border-white/20 text-white/60 hover:border-gold hover:text-gold transition-colors text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-white/20 hover:text-red-400 text-xs tracking-widest uppercase font-sans transition-colors"
                        >
                          {t("cart", "remove")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <AnimatedSection direction="right" delay={0.2}>
              <div className="bg-dark-2 border border-white/5 p-8 sticky top-24">
                <h2 className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-6">{t("checkout", "orderSummary")}</h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-xs font-sans text-white/50">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>{item.product.price * item.quantity} €</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-white/10 mb-6" />
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs tracking-[0.3em] uppercase font-sans text-white/60">{t("cart", "total")}</span>
                  <span className="font-serif text-2xl text-gold font-bold">{total()} €</span>
                </div>
                <Link href="/checkout" className="btn-luxury block text-center text-xs">
                  <span>{t("cart", "checkout")}</span>
                </Link>
                <Link href="/shop" className="block text-center text-xs text-white/30 hover:text-gold transition-colors mt-4 tracking-widest uppercase font-sans">
                  {t("cart", "continue")}
                </Link>
              </div>
            </AnimatedSection>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
