"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type CookiePrefs = { marketing: boolean };

const STORAGE_KEY = "royve_cookie_consent";

export function getCookiePrefs(): CookiePrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function useCookiePrefs(): CookiePrefs | null {
  const [prefs, setPrefs] = useState<CookiePrefs | null>(null);
  useEffect(() => {
    setPrefs(getCookiePrefs());
    function onStorage() { setPrefs(getCookiePrefs()); }
    window.addEventListener("royve_cookie_update", onStorage);
    return () => window.removeEventListener("royve_cookie_update", onStorage);
  }, []);
  return prefs;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefs = getCookiePrefs();
    if (!prefs) setVisible(true);
  }, []);

  function save(marketing: boolean) {
    const prefs: CookiePrefs = { marketing };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new Event("royve_cookie_update"));
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[200] bg-[#111] border-t border-white/10 px-4 sm:px-8 py-5"
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex-1">
              <p className="text-white/70 text-xs font-sans leading-relaxed">
                Използваме бисквитки за маркетинг и анализ, за да подобрим твоето изживяване.
                Можеш да приемеш всички или само необходимите.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => save(false)}
                className="px-4 py-2 text-[10px] tracking-widest uppercase font-sans border border-white/20 text-white/40 hover:text-white hover:border-white/40 transition-colors"
              >
                Само необходими
              </button>
              <button
                onClick={() => save(true)}
                className="px-4 py-2 text-[10px] tracking-widest uppercase font-sans border border-gold text-gold hover:bg-gold hover:text-black transition-colors"
              >
                Приемам всички
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
