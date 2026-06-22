"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/products";

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const { t, lang } = useLang();
  const addItem = useCartStore((s) => s.addItem);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    spotX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handleMouseLeave() {
    x.set(0); y.set(0); spotX.set(50); spotY.set(50);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className="group bg-dark-2 border border-white/5 hover:border-gold/30 transition-colors duration-500 overflow-hidden"
    >
      <Link href={`/shop/${product.id}`}>
        <div className="relative overflow-hidden aspect-[4/3] bg-white">
          <motion.div className="w-full h-full" whileHover={{ scale: 1.04 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <Image
              src={`/products/${product.id}.jpg`}
              alt={product.name}
              fill
              className="object-contain p-4"
              onError={(e) => { (e.target as HTMLImageElement).src = `/products/${product.id}.svg`; }}
              unoptimized
            />
          </motion.div>
          <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/25 transition-all duration-500 pointer-events-none" />
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <Link href={`/shop/${product.id}`}>
              <h3 className="font-serif text-xl font-bold tracking-widest text-white group-hover:text-gold transition-colors duration-300">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-white/30 tracking-[0.2em] uppercase font-sans mt-1">{product.category}</p>
          </div>
          <span className="font-serif text-gold text-lg font-semibold">{product.price} €</span>
        </div>
        <p className="text-white/40 text-xs font-sans leading-relaxed line-clamp-2 mt-2 mb-4">
          {product.description[lang]}
        </p>
        <motion.button
          onClick={() => addItem(product)}
          className="btn-luxury w-full text-center text-xs"
          whileTap={{ scale: 0.97 }}
        >
          <span>{t("shop", "addBtn")}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
