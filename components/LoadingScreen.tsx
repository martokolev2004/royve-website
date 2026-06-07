"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99990] bg-dark-1 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <span
                className="font-serif text-5xl font-bold text-gold-gradient"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                ROYVÉ
              </span>
            </motion.div>
            <motion.div
              className="mt-4 h-px bg-gold mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
            <motion.p
              className="mt-4 text-white/30 text-xs tracking-[0.4em] font-sans uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              EYEWEAR
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
