"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  const { t } = useLang();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-dark-1 min-h-screen">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Pure dark background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-1 via-dark-2 to-dark-1" />

        {/* Diagonal gold lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/15 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 2.5, duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />
          <motion.div
            className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/15 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 2.7, duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center px-6"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Brand name reveal */}
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.6em" }}
            transition={{ delay: 2.4, duration: 1.2, ease: "easeOut" }}
          >
            <h1
              className="font-serif font-bold text-gold-gradient"
              style={{ fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: 1 }}
            >
              ROYVÉ
            </h1>
          </motion.div>

          <motion.div
            className="h-px bg-gold mx-auto my-6"
            initial={{ width: 0 }}
            animate={{ width: "min(200px, 40vw)" }}
            transition={{ delay: 3, duration: 0.8, ease: "easeOut" }}
          />

          <motion.p
            className="text-white/50 text-sm md:text-base tracking-[0.5em] uppercase font-sans mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.8 }}
          >
            {t("hero", "slogan")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 0.8 }}
          >
            <Link href="/shop" className="btn-luxury inline-block">
              <span>{t("hero", "cta")}</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
        >
          <span className="text-white/20 text-[10px] tracking-[0.4em] uppercase font-sans">scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— COLLECTION —</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
            {t("shop", "title")}
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <AnimatedSection key={product.id} delay={i * 0.1} direction="up">
              <ProductCard product={product} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-14" delay={0.4}>
          <Link href="/shop" className="btn-luxury inline-block">
            <span>{t("hero", "cta")}</span>
          </Link>
        </AnimatedSection>
      </section>

      {/* ── BRAND STORY ── */}
      <section className="py-24 bg-dark-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-1 via-dark-2 to-dark-1 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-8">— BRAND —</p>
            <blockquote
              className="font-serif text-2xl md:text-4xl text-white/80 leading-relaxed font-light italic"
            >
              &ldquo;{t("brand", "story")}&rdquo;
            </blockquote>
            <div className="h-px bg-gold/30 w-24 mx-auto mt-10" />
          </AnimatedSection>
        </div>
      </section>

      {/* ── SUMMER EDITORIAL ── */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <div className="relative aspect-[3/4] bg-dark-3 border border-white/5 overflow-hidden">
              {/* Flatlay video - zoomed to crop social media UI from edges */}
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute object-cover"
                style={{
                  filter: "brightness(0.75) contrast(1.05)",
                  width: "160%",
                  height: "160%",
                  top: "-15%",
                  left: "-10%",
                }}
              >
                <source src="/brand/flatlay.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-dark-1/70 via-transparent to-transparent" />
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-gold/60" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-gold/60" />
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.2}>
            <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-6">— EDITORIAL —</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t("brand", "editorial")}
            </h2>
            <p className="text-white/40 font-sans text-sm leading-relaxed mb-8 tracking-wide">
              {t("brand", "editorialSub")}
            </p>
            <div className="h-px bg-white/10 w-full mb-8" />
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase font-sans mb-8">
              {t("hero", "slogan")}
            </p>
            <Link href="/shop" className="btn-luxury inline-block">
              <span>{t("hero", "cta")}</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── PACKAGING / CRAFT ── */}
      <section className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        {/* Packaging video - zoomed to crop social media UI */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute object-cover"
          style={{
            filter: "brightness(0.4) contrast(1.1)",
            width: "160%",
            height: "160%",
            top: "-15%",
            left: "-20%",
          }}
        >
          <source src="/brand/packaging.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-1/80 via-transparent to-dark-1/80" />
        <AnimatedSection className="relative z-10 text-center px-6">
          <p className="text-gold text-xs tracking-[0.6em] uppercase font-sans mb-4">LUXURY IN EVERY DETAIL.</p>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white tracking-widest">ROYVÉ</h2>
          <div className="h-px bg-gold/50 w-20 mx-auto mt-6" />
        </AnimatedSection>
      </section>

      {/* ── STATS / MANIFESTO ── */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "4", label: { bg: "Модела", en: "Models" } },
              { num: "100%", label: { bg: "UV защита", en: "UV Protection" } },
              { num: "∞", label: { bg: "Стил", en: "Style" } },
              { num: "1", label: { bg: "Философия", en: "Philosophy" } },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="py-6">
                  <p className="font-serif text-4xl md:text-5xl font-bold text-gold mb-2">{item.num}</p>
                  <p className="text-white/30 text-xs tracking-[0.3em] uppercase font-sans">
                    {item.label.bg} / {item.label.en}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
