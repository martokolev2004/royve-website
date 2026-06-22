"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useCartStore } from "@/lib/store";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        scrolled ? "bg-dark-1/95 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ delay: 2.3, duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="relative h-12 w-32 flex items-center">
          <Image src="/logo.png" alt="ROYVÉ" fill className="object-contain object-left" unoptimized priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/shop"
            className="text-white/60 hover:text-gold transition-colors text-xs tracking-[0.3em] uppercase font-sans"
          >
            {t("nav", "shop")}
          </Link>
          <Link
            href="/cart"
            className="relative text-white/60 hover:text-gold transition-colors text-xs tracking-[0.3em] uppercase font-sans"
          >
            {t("nav", "cart")}
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-gold text-dark-1 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Lang switcher */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-xs font-sans tracking-widest">
            <button
              onClick={() => setLang("bg")}
              className={`px-2 py-1 transition-colors ${lang === "bg" ? "text-gold" : "text-white/30 hover:text-white/60"}`}
            >
              БГ
            </button>
            <span className="text-white/20">/</span>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 transition-colors ${lang === "en" ? "text-gold" : "text-white/30 hover:text-white/60"}`}
            >
              EN
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-6 h-px bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-px bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-dark-1 border-t border-white/5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <Link href="/shop" onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-gold text-sm tracking-[0.3em] uppercase">
                {t("nav", "shop")}
              </Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-gold text-sm tracking-[0.3em] uppercase flex items-center gap-2">
                {t("nav", "cart")}
                {itemCount > 0 && (
                  <span className="bg-gold text-dark-1 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-3 text-sm font-sans tracking-widest border-t border-white/10 pt-4">
                <button onClick={() => setLang("bg")} className={lang === "bg" ? "text-gold" : "text-white/30"}>БГ</button>
                <span className="text-white/20">/</span>
                <button onClick={() => setLang("en")} className={lang === "en" ? "text-gold" : "text-white/30"}>EN</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
