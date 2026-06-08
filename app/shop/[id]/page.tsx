"use client";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { getProductById, products } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import AnimatedSection from "@/components/AnimatedSection";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProductById(id);
  if (!product) notFound();

  const { t, lang } = useLang();
  const addItem = useCartStore((s) => s.addItem);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="bg-dark-1 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-white/30 hover:text-gold text-xs tracking-[0.3em] uppercase font-sans mb-12 transition-colors"
        >
          ← {t("product", "back")}
        </Link>

        {/* Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image / Video */}
          <AnimatedSection direction="left">
            <div className="relative aspect-[4/3] bg-[#f0ede8] border border-white/5 overflow-hidden group">
              <motion.div
                className="w-full h-full"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={`/products/${product.id}.jpg`}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  onError={(e) => { (e.target as HTMLImageElement).src = `/products/${product.id}.svg`; }}
                  unoptimized
                />
              </motion.div>
              <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-500 pointer-events-none" />
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-gold/40" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-gold/40" />
            </div>
          </AnimatedSection>

          {/* Info */}
          <AnimatedSection direction="right" delay={0.2}>
            <div className="flex flex-col justify-center h-full">
              <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-4">{product.category}</p>
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-white tracking-widest mb-4">
                {product.name}
              </h1>
              <div className="h-px bg-white/10 w-16 mb-6" />
              <p className="font-serif text-3xl text-gold font-semibold mb-8">
                {product.price} {t("shop", "currency")}
              </p>
              <p className="text-white/50 font-sans text-sm leading-relaxed mb-8">
                {product.description[lang]}
              </p>

              {/* Details */}
              <div className="mb-8">
                <p className="text-xs tracking-[0.3em] uppercase text-white/30 font-sans mb-4">{t("product", "details")}</p>
                <ul className="space-y-2">
                  {product.details.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-white/50 text-xs font-sans">
                      <span className="w-1 h-1 bg-gold rounded-full" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                onClick={() => addItem(product)}
                className="btn-luxury text-center text-xs w-full md:w-auto md:px-16"
                whileTap={{ scale: 0.98 }}
              >
                <span>{t("product", "addToCart")}</span>
              </motion.button>
            </div>
          </AnimatedSection>
        </div>

        {/* Related */}
        <div className="mt-24">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.5em] uppercase font-sans mb-2">— ALSO —</p>
            <h2 className="font-serif text-3xl font-bold text-white mb-10">{t("product", "related")}</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p, i) => (
              <AnimatedSection key={p.id} delay={i * 0.1}>
                <ProductCard product={p} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
