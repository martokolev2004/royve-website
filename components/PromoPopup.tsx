"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

export default function PromoPopup() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    if (sessionStorage.getItem("royve_promo_seen")) return;
    const timer = setTimeout(() => setOpen(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setOpen(false);
    sessionStorage.setItem("royve_promo_seen", "1");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99980] bg-black/70 backdrop-blur-sm flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="relative bg-dark-2 border border-gold/30 max-w-md w-full p-10 text-center"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 text-white/30 hover:text-gold text-xs tracking-widest"
              aria-label="Close"
            >
              ✕
            </button>

            <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-sans mb-4">
              — {t("promo", "eyebrow")} —
            </p>

            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="relative w-16 h-16 bg-white">
                <Image src="/products/azure-1.jpg" alt="AZURE" fill className="object-contain p-1" unoptimized />
              </div>
              <span className="text-gold font-serif text-2xl">+</span>
              <div className="relative w-16 h-16 bg-white">
                <Image src="/products/noir-1.jpg" alt="NOIR" fill className="object-contain p-1" unoptimized />
              </div>
            </div>

            <h2 className="font-serif text-3xl font-bold text-white tracking-widest mb-4">
              {t("promo", "title")}
            </h2>

            <p className="text-white/50 text-sm font-sans leading-relaxed mb-8">
              {t("promo", "message")}
            </p>

            <Link
              href="/shop"
              onClick={close}
              className="btn-luxury inline-block text-xs mb-4"
            >
              <span>{t("promo", "cta")}</span>
            </Link>

            <button
              onClick={close}
              className="block w-full text-white/30 hover:text-white/50 text-[10px] tracking-[0.3em] uppercase font-sans mt-2"
            >
              {t("promo", "dismiss")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
