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

      {/* ── EDITORIAL: THE LOOK ── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-10">
          <p className="text-gold/60 text-[10px] tracking-[0.6em] uppercase font-sans mb-3">EDITORIAL</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light text-white tracking-[0.2em]">THE LOOK</h2>
        </AnimatedSection>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-3" style={{ height: "680px" }}>
          {/* Left tall: model + amber lifestyle */}
          <AnimatedSection direction="left" className="relative overflow-hidden bg-dark-2 group">
            <video
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: "brightness(0.8) contrast(1.05)" }}
            >
              <source src="/brand/hero2.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-dark-1/80 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 text-white/50 text-[10px] tracking-[0.4em] uppercase font-sans">EDITORIAL</p>
          </AnimatedSection>

          {/* Center col: flatlay SVG top + branding card bottom */}
          <div className="grid grid-rows-2 gap-3">
            <AnimatedSection delay={0.1} className="relative overflow-hidden bg-dark-2 group">
              <Image
                src="/products/amber.svg"
                alt="Summer Essentials"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-1/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 text-white/50 text-[10px] tracking-[0.4em] uppercase font-sans">SUMMER ESSENTIALS</p>
            </AnimatedSection>

            {/* Branding card */}
            <AnimatedSection delay={0.2} className="relative overflow-hidden bg-dark-2 flex flex-col items-center justify-center border border-white/5">
              <div className="text-center px-6">
                <div className="w-10 h-10 border border-gold/40 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#c9a84c" stroke="none"/>
                  </svg>
                </div>
                <p className="text-gold/60 text-sm tracking-[0.15em] font-sans mb-3">@royve.eyewear</p>
                <div className="h-px w-12 bg-gold/30 mx-auto mb-3" />
                <p className="text-white/25 text-[9px] tracking-[0.4em] uppercase font-sans">LUXURY IN EVERY DETAIL.</p>
              </div>
            </AnimatedSection>
          </div>

          {/* Right col: azure SVG top + hero1 video bottom */}
          <div className="grid grid-rows-2 gap-3">
            <AnimatedSection delay={0.15} className="relative overflow-hidden bg-dark-2 group">
              <Image
                src="/products/azure.svg"
                alt="Azure"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-1/50 via-transparent to-transparent" />
            </AnimatedSection>

            <AnimatedSection delay={0.25} className="relative overflow-hidden bg-dark-2 group">
              <video
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "brightness(0.75) contrast(1.05)" }}
              >
                <source src="/brand/hero1.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-dark-1/60 via-transparent to-transparent" />
            </AnimatedSection>
          </div>
        </div>

        {/* Mobile grid: 2-col masonry-style */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {/* Row 1: model video tall + azure */}
          <div className="relative overflow-hidden bg-dark-2 aspect-[3/4]">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.8)" }}>
              <source src="/brand/hero2.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-dark-1/70 via-transparent to-transparent" />
            <p className="absolute bottom-3 left-3 text-white/40 text-[9px] tracking-widest uppercase font-sans">EDITORIAL</p>
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="relative overflow-hidden bg-dark-2 aspect-square">
              <Image src="/products/amber.svg" alt="Amber" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-1/50 to-transparent" />
            </div>
            <div className="relative overflow-hidden bg-dark-2 aspect-square">
              <Image src="/products/azure.svg" alt="Azure" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-1/50 to-transparent" />
            </div>
          </div>

          {/* Row 2: hero1 video full width */}
          <div className="col-span-2 relative overflow-hidden bg-dark-2 aspect-video">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.75)" }}>
              <source src="/brand/hero1.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-dark-1/60 via-transparent to-transparent" />
          </div>

          {/* Row 3: instagram card */}
          <div className="col-span-2 bg-dark-2 border border-white/5 flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border border-gold/40 rounded-lg flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#c9a84c" stroke="none"/>
              </svg>
            </div>
            <p className="text-gold/60 text-xs tracking-[0.15em] font-sans mb-2">@royve.eyewear</p>
            <div className="h-px w-10 bg-gold/30 mb-2" />
            <p className="text-white/25 text-[9px] tracking-[0.4em] uppercase font-sans">LUXURY IN EVERY DETAIL.</p>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
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

      {/* ── BRAND STORY ── */}
      <section className="py-24 bg-dark-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-1 via-dark-2 to-dark-1 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-8">— BRAND —</p>
            <blockquote className="font-serif text-2xl md:text-4xl text-white/80 leading-relaxed font-light italic">
              &ldquo;{t("brand", "story")}&rdquo;
            </blockquote>
            <div className="h-px bg-gold/30 w-24 mx-auto mt-10" />
          </AnimatedSection>
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
