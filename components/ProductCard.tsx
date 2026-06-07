"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/products";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { t, lang } = useLang();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div
      className="group product-card bg-dark-2 border border-white/5 hover:border-gold/40 transition-all duration-500 overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/shop/${product.id}`}>
        <div className="relative overflow-hidden aspect-[4/3] bg-dark-1">
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src={`/products/${product.id}.svg`}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </motion.div>
          {/* Gold border flash on hover */}
          <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/30 transition-all duration-500 pointer-events-none" />
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
          <span className="font-serif text-gold text-lg font-semibold">
            {product.price} {t("shop", "currency")}
          </span>
        </div>

        <p className="text-white/40 text-xs font-sans leading-relaxed line-clamp-2 mt-2 mb-4">
          {product.description[lang]}
        </p>

        <button
          onClick={() => addItem(product)}
          className="btn-luxury w-full text-center text-xs"
        >
          <span>{t("shop", "addBtn")}</span>
        </button>
      </div>
    </motion.div>
  );
}
