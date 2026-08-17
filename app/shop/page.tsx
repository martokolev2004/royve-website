"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";

const categories = ["ALL", "Classic", "Rimless"] as const;

export default function ShopPage() {
  const { t } = useLang();
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = filter === "ALL" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="bg-dark-1 min-h-screen pt-20">
      {/* Hero banner */}
      <div className="relative py-24 px-6 lg:px-12 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-2 to-dark-1 pointer-events-none" />
        {/* Big background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="font-serif font-bold text-white/[0.02] select-none" style={{ fontSize: "clamp(100px, 25vw, 300px)" }}>
            SHOP
          </span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">— ROYVÉ EYEWEAR —</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white tracking-widest mb-4">
              {t("shop", "title")}
            </h1>
            <div className="h-px bg-gold/30 w-24 mx-auto mt-6" />
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Filter */}
        <AnimatedSection className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 text-xs tracking-[0.3em] uppercase font-sans border transition-all duration-300 ${
                filter === cat
                  ? "border-gold text-gold bg-gold/10"
                  : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/60"
              }`}
            >
              {cat === "ALL" ? t("shop", "all") : cat}
            </button>
          ))}
        </AnimatedSection>

        {/* Grid */}
        <motion.div
          key={filter}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filtered.map((product, i) => (
            <AnimatedSection key={product.id} delay={i * 0.08} direction="up">
              <ProductCard product={product} />
            </AnimatedSection>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30 text-sm tracking-widest font-sans">
            — NO PRODUCTS —
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
