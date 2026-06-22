"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";

export default function OfferRibbon() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLang();

  if (dismissed) return null;

  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-[9990] flex items-center">
      {/* Flyout panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-dark-2 border border-gold/30 border-r-0 p-6 w-64 mr-0 relative"
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 text-white/30 hover:text-gold text-xs"
              aria-label="Dismiss"
            >
              ✕
            </button>
            <p className="text-gold text-[9px] tracking-[0.4em] uppercase font-sans mb-2">
              — {t("promo", "eyebrow")} —
            </p>
            <h3 className="font-serif text-xl font-bold text-white tracking-widest mb-3">
              {t("promo", "title")}
            </h3>
            <p className="text-white/50 text-xs font-sans leading-relaxed mb-5">
              {t("promo", "message")}
            </p>
            <Link href="/shop" onClick={() => setOpen(false)} className="btn-luxury block text-center text-[10px]">
              <span>{t("promo", "cta")}</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-gold text-dark-1 px-3 py-5 flex flex-col items-center gap-2 hover:bg-gold/90 transition-colors"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="text-[11px] font-bold tracking-[0.3em] uppercase font-sans">
          {t("promo", "title")}
        </span>
      </button>
    </div>
  );
}
