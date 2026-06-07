"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] mix-blend-difference"
        animate={{ x: pos.x - 6, y: pos.y - 6 }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <motion.div
          className="rounded-full bg-gold"
          animate={{ width: isHovering ? 20 : 12, height: isHovering ? 20 : 12 }}
          transition={{ duration: 0.2 }}
          style={{ width: 12, height: 12 }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        animate={{ x: pos.x - 20, y: pos.y - 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.8 }}
      >
        <motion.div
          className="rounded-full border border-gold/40"
          animate={{ width: isHovering ? 50 : 40, height: isHovering ? 50 : 40, opacity: isHovering ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
          style={{ width: 40, height: 40 }}
        />
      </motion.div>
    </>
  );
}
