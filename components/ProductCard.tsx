"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/context/LanguageContext";
import { useCartStore } from "@/lib/store";
import { useInventory } from "@/context/InventoryContext";
import { Product } from "@/lib/products";
import { trackEvent } from "./MetaPixel";
import { track } from "@vercel/analytics";

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  const { t, lang } = useLang();
  const { addItem, items, updateQuantity } = useCartStore();
  const { data: inventory, loaded: inventoryLoaded } = useInventory();
  const cartItem = items.find((i) => i.product.id === product.id);
  const stock = inventoryLoaded ? (inventory[product.id] ?? 0) : null;
  const isSoldOut = product.soldOut || (stock !== null && stock === 0);
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
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800, maxWidth: "100%" }}
      className="group bg-dark-2 border border-white/5 hover:border-gold/30 transition-colors duration-500 overflow-hidden"
    >
      <Link href={`/shop/${product.id}`}>
        <div className="relative overflow-hidden aspect-[4/3] bg-white">
          <motion.div className="w-full h-full" whileHover={{ scale: 1.04 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-contain ${["obsidian", "krypt", "azure"].includes(product.id) ? "p-2" : "p-4"}`}
              unoptimized
            />
          </motion.div>
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-gold text-dark-1 text-[10px] font-bold tracking-widest uppercase px-2 py-1">
              -{Math.round(100 - (product.price / product.originalPrice) * 100)}%
            </span>
          )}
          {isSoldOut && (
            <span className="absolute top-3 right-3 bg-white/10 border border-white/30 text-white/60 text-[10px] font-bold tracking-widest uppercase px-2 py-1">
              Sold Out
            </span>
          )}
          {!isSoldOut && product.bestSeller && (
            <span className="absolute top-3 right-3 bg-dark-1/90 border border-gold text-gold text-[10px] font-bold tracking-widest uppercase px-2 py-1">
              Best Seller
            </span>
          )}
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
          <div className="text-right">
            {product.originalPrice && (
              <span className="block text-white/30 text-xs line-through font-sans">{product.originalPrice} €</span>
            )}
            <span className="font-serif text-gold text-lg font-semibold">{product.price} €</span>
          </div>
        </div>
        <p className="text-white/40 text-xs font-sans leading-relaxed line-clamp-2 mt-2 mb-4">
          {product.description[lang]}
        </p>
        {isSoldOut ? (
          <div className="w-full border border-white/10 py-3 text-center">
            <span className="text-white/30 text-xs tracking-[0.3em] uppercase font-sans">Sold Out</span>
          </div>
        ) : cartItem ? (
          <div className="relative border border-gold w-full flex items-center overflow-hidden" style={{ height: "46px" }}>
            <motion.button
              onClick={(e) => { e.preventDefault(); updateQuantity(product.id, cartItem.quantity - 1); }}
              className="relative z-10 w-11 h-full flex items-center justify-center text-gold hover:text-dark-1 hover:bg-gold text-xl font-serif transition-all duration-200 flex-shrink-0"
              whileTap={{ scale: 0.9 }}
            >
              −
            </motion.button>
            <div className="flex-1 flex flex-col items-center justify-center h-full border-x border-gold/30">
              <span className="text-gold font-serif text-lg leading-none">{cartItem.quantity}</span>
              <span className="text-gold/50 text-[8px] tracking-[0.2em] uppercase font-sans mt-0.5">{t("product", "inCart")}</span>
            </div>
            <motion.button
              onClick={(e) => { e.preventDefault(); if (cartItem && (stock === null || cartItem.quantity < stock)) addItem(product); }}
              disabled={cartItem && stock !== null ? cartItem.quantity >= stock : false}
              className="relative z-10 w-11 h-full flex items-center justify-center text-gold hover:text-dark-1 hover:bg-gold text-xl font-serif transition-all duration-200 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.9 }}
            >
              +
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={() => { addItem(product); trackEvent("AddToCart", { content_ids: [product.id], content_name: product.name, value: product.price, currency: "EUR" }); track("AddToCart", { product: product.name, value: product.price }); }}
            className="btn-luxury w-full text-center text-xs"
            whileTap={{ scale: 0.97 }}
          >
            <span>{t("shop", "addBtn")}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
