"use client";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { trackEvent } from "@/components/MetaPixel";

function SuccessContent() {
  const { t } = useLang();
  const params = useSearchParams();
  const orderId = params.get("order") || "—";

  useEffect(() => {
    if (!orderId || orderId === "—") return;
    fetch(`/api/order/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.total) {
          trackEvent("Purchase", {
            value: data.total,
            currency: "EUR",
            content_ids: data.items?.map((i: { name: string }) => i.name) ?? [],
            order_id: orderId,
          });
        }
      })
      .catch(() => {});
  }, [orderId]);

  return (
    <div className="bg-dark-1 min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Animated checkmark */}
        <motion.div
          className="w-24 h-24 rounded-full border-2 border-gold mx-auto mb-8 flex items-center justify-center relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <motion.svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <motion.path
              d="M8 20L16 28L32 12"
              stroke="#c9a84c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— ROYVÉ —</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-widest mb-4">
            {t("success", "title")}
          </h1>
          <div className="h-px bg-gold/30 w-16 mx-auto my-6" />
          <p className="text-white/50 font-sans text-sm leading-relaxed mb-6">
            {t("success", "message")}
          </p>
          <p className="text-white/30 text-xs font-sans tracking-widest mb-10">
            {t("success", "orderNum")}: <span className="text-gold">{orderId}</span>
          </p>
          <Link href="/shop" className="btn-luxury inline-block">
            <span>{t("success", "continue")}</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="bg-dark-1 min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}
