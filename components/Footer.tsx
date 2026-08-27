"use client";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-dark-2 border-t border-white/5 py-16 px-6 lg:px-12 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <span className="font-serif text-3xl font-bold text-gold-gradient block mb-4">ROYVÉ</span>
            <p className="text-white/30 text-xs tracking-widest uppercase font-sans">NOT FOR EVERYONE.</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-gold uppercase mb-4 font-sans">{t("footer", "contact")}</h4>
            <a href="mailto:royve.eyewear@gmail.com" className="text-white/40 text-sm hover:text-gold transition-colors">
              royve.eyewear@gmail.com
            </a>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-gold uppercase mb-4 font-sans">{t("footer", "follow")}</h4>
            <div className="flex flex-col gap-2">
              <a href="https://www.instagram.com/royve.eyewear?igsh=Nmtxb2NiZ3J4eGp2" target="_blank" rel="noopener noreferrer" className="text-white/40 text-xs tracking-widest hover:text-gold transition-colors font-sans">
                INSTAGRAM
              </a>
              <a href="https://www.tiktok.com/@royve.eyewear?_r=1&_t=ZN-98xdilAYnwM" target="_blank" rel="noopener noreferrer" className="text-white/40 text-xs tracking-widest hover:text-gold transition-colors font-sans">
                TIKTOK
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-sans">
            © {new Date().getFullYear()} ROYVÉ Eyewear. {t("footer", "rights")}.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/shop" className="text-white/20 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">
              {t("nav", "shop")}
            </Link>
            <Link href="/cart" className="text-white/20 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">
              {t("nav", "cart")}
            </Link>
            <Link href="/terms" className="text-white/20 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">
              Общи условия
            </Link>
            <Link href="/privacy" className="text-white/20 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">
              Поверителност
            </Link>
            <Link href="/cookies" className="text-white/20 text-xs hover:text-gold transition-colors font-sans tracking-widest uppercase">
              Бисквитки
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
