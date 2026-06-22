"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
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
              className="relative h-32 w-56 mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <Image src="/logo.png" alt="ROYVÉ" fill className="object-contain" unoptimized priority />
            </motion.div>
            <motion.div
              className="mt-4 h-px bg-gold mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
