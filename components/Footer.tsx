"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-dark-2 border-t border-white/5 py-16 px-6 lg:px-12 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="relative h-16 w-40 mb-4">
              <Image src="/logo.png" alt="ROYVÉ" fill className="object-contain object-left" unoptimized />
            </div>
            <p className="text-white/30 text-xs tracking-widest uppercase font-sans">NOT FOR EVERYONE.</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-gold uppercase mb-4 font-sans">{t("footer", "contact")}</h4>
            <a href="mailto:hello@royve.com" className="text-white/40 text-sm hover:text-gold transition-colors">
              hello@royve.com
            </a>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-gold uppercase mb-4 font-sans">{t("footer", "follow")}</h4>
            <div className="flex flex-col gap-2">
              {["INSTAGRAM", "TIKTOK", "FACEBOOK"].map((s) => (
                <a key={s} href="#" className="text-white/40 text-xs tracking-widest hover:text-gold transition-colors font-sans">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-sans">
            © {new Date().getFullYear()} ROYVÉ Eyewear. {t("footer", "rights")}.
          </p>
          <div className="flex gap-6">
            <Link href="/shop" className="text-white/20 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">
              {t("nav", "shop")}
            </Link>
            <Link href="/cart" className="text-white/20 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">
              {t("nav", "cart")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
