"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";

const marqueeItems = [
  "ROYVÉ", "NOT FOR EVERYONE", "LUXURY IN EVERY DETAIL",
  "ROYVÉ", "NOT FOR EVERYONE", "LUXURY IN EVERY DETAIL",
  "ROYVÉ", "NOT FOR EVERYONE", "LUXURY IN EVERY DETAIL",
];

export default function HomePage() {
  const { t } = useLang();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-dark-1 min-h-screen">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.28) contrast(1.15)" }}
        >
          <source src="/brand/hero2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-1 via-dark-1/30 to-dark-1/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-1/70 via-transparent to-dark-1/60" />

        <motion.div className="relative z-10 text-center px-6" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 1 }}
          >
            <div className="h-px w-12 bg-gold/50" />
            <span className="text-gold/60 text-[10px] tracking-[0.5em] font-sans uppercase">Eyewear</span>
            <div className="h-px w-12 bg-gold/50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.15em" }}
            animate={{ opacity: 1, letterSpacing: "0.55em" }}
            transition={{ delay: 2.5, duration: 1.4, ease: "easeOut" }}
          >
            <h1 className="font-serif font-bold text-white" style={{ fontSize: "clamp(4rem, 14vw, 11rem)", lineHeight: 1 }}>
              ROYVÉ
            </h1>
          </motion.div>

          <motion.p
            className="text-white/40 text-xs md:text-sm tracking-[0.4em] uppercase font-sans mt-6 mb-12"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.8 }}
          >
            NOT FOR EVERYONE. LUXURY IN EVERY DETAIL.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 0.8 }}
          >
            <Link href="/shop" className="inline-flex items-center gap-3 border border-gold/60 text-gold/90 hover:bg-gold hover:text-dark-1 transition-all duration-300 px-8 py-3.5 text-xs tracking-[0.4em] uppercase font-sans">
              SHOP THE COLLECTION <span>→</span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 4.2, duration: 1 }}
        >
          <motion.div
            className="w-px h-14 bg-gradient-to-b from-gold/60 to-transparent mx-auto"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-white/8 bg-dark-1 overflow-hidden py-3">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-[10px] tracking-[0.4em] uppercase font-sans text-white/25 flex-shrink-0">
              {item} <span className="text-gold/40 mx-3">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── CINEMATIC BAND ── */}
      <section className="relative h-[40vh] overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.35) contrast(1.1)" }}
        >
          <source src="/brand/hero1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-1 via-transparent to-dark-1/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-1/50 via-transparent to-dark-1/50" />
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— COLLECTION —</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">{t("shop", "title")}</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <AnimatedSection key={product.id} delay={i * 0.1} direction="up">
              <ProductCard product={product} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-14" delay={0.4}>
          <Link href="/shop" className="btn-luxury inline-block"><span>{t("hero", "cta")}</span></Link>
        </AnimatedSection>
      </section>

      {/* ── EDITORIAL GRID ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <AnimatedSection className="mb-10 text-center">
          <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans">— THE BRAND —</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[80vh]">
          {/* Left — tall portrait (model) */}
          <AnimatedSection direction="left" className="relative overflow-hidden group min-h-[50vw] md:min-h-0">
            <Image
              src="/brand/image-1780925344987.jpg"
              alt="ROYVÉ model"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-1/80 via-transparent to-dark-1/20" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-gold/70 text-[9px] tracking-[0.5em] uppercase font-sans mb-2">ROYVÉ AMBER</p>
              <p className="font-serif text-xl text-white font-light">Bold. Unapologetic.</p>
            </div>
            <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-gold/40" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-gold/40" />
          </AnimatedSection>

          {/* Right — two stacked panels */}
          <div className="grid grid-rows-2 gap-4 min-h-[100vw] md:min-h-0">
            {/* Top right — flatlay */}
            <AnimatedSection direction="right" className="relative overflow-hidden group">
              <Image
                src="/brand/image-1780925348966.jpg"
                alt="ROYVÉ flatlay"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-b from-dark-1/30 via-transparent to-dark-1/60" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-gold/70 text-[9px] tracking-[0.5em] uppercase font-sans mb-1">ROYVÉ AZURE</p>
                <p className="font-serif text-lg text-white font-light">Rimless luxury.</p>
              </div>
              <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-gold/40" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-gold/40" />
            </AnimatedSection>

            {/* Bottom right — Vogue */}
            <AnimatedSection direction="right" delay={0.15} className="relative overflow-hidden group">
              <Image
                src="/brand/image-1780925347510.jpg"
                alt="ROYVÉ press"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-1/70 via-dark-1/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-end justify-end text-right px-8 pb-8">
                <div className="h-px bg-gold/40 w-10 mb-5 ml-auto" />
                <p className="font-serif text-2xl md:text-3xl text-white font-light italic leading-snug">
                  Not for everyone.
                </p>
                <p className="text-gold/60 text-[9px] tracking-[0.6em] uppercase font-sans mt-4">ROYVÉ EYEWEAR</p>
              </div>
              <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-gold/40" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-gold/40" />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
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
                  <p className="text-white/30 text-xs tracking-[0.3em] uppercase font-sans">{item.label.bg} / {item.label.en}</p>
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
