"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { getProductById, products } from "@/lib/products";
import { useCartStore } from "@/lib/store";
import AnimatedSection from "@/components/AnimatedSection";
import ProductCard from "@/components/ProductCard";
import ProductViewer from "@/components/ProductViewer";
import Footer from "@/components/Footer";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
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

        {/* Main grid — 3D viewer left, info right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]">

          {/* LEFT — interactive viewer */}
          <AnimatedSection direction="left">
            <ProductViewer images={product.images} alt={product.name} />
          </AnimatedSection>

          {/* RIGHT — product info */}
          <AnimatedSection direction="right" delay={0.15}>
            <div className="flex flex-col justify-center">

              <p className="text-gold text-[10px] tracking-[0.6em] uppercase font-sans mb-3">{product.category}</p>

              <h1 className="font-serif text-5xl md:text-6xl font-bold text-white tracking-widest mb-4 leading-none">
                {product.name}
              </h1>

              <div className="h-px bg-gold/20 w-16 mb-6" />

              <div className="flex items-center gap-3 mb-6">
                <p className="font-serif text-3xl text-gold font-semibold">
                  {product.price} {t("shop", "currency")}
                </p>
                {product.originalPrice && (
                  <>
                    <p className="text-white/30 text-lg line-through font-sans">
                      {product.originalPrice} {t("shop", "currency")}
                    </p>
                    <span className="bg-gold text-dark-1 text-[10px] font-bold tracking-widest uppercase px-2 py-1">
                      -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-white/50 font-sans text-sm leading-relaxed mb-8">
                {product.description[lang]}
              </p>

              {/* Details list */}
              <div className="mb-10 border-t border-white/5 pt-6">
                <p className="text-[10px] tracking-[0.4em] uppercase text-white/25 font-sans mb-5">{t("product", "details")}</p>
                <ul className="space-y-3">
                  {product.details.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-white/50 text-xs font-sans">
                      <span className="w-1 h-1 bg-gold/70 rounded-full flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                onClick={() => addItem(product)}
                className="btn-luxury text-center text-xs w-full md:w-64"
                whileTap={{ scale: 0.98 }}
              >
                <span>{t("product", "addToCart")}</span>
              </motion.button>
            </div>
          </AnimatedSection>
        </div>

        {/* Related */}
        <div className="mt-28">
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
