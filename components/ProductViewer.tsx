"use client";
import { useRef, useState } from "react";
import Image from "next/image";

interface ProductViewerProps {
  images: string[];
  alt: string;
}

export default function ProductViewer({ images, alt }: ProductViewerProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) { if (delta < 0) next(); else prev(); }
    touchStartX.current = null;
  }

  function handleMouseDown(e: React.MouseEvent) {
    mouseStartX.current = e.clientX;
  }
  function handleMouseUp(e: React.MouseEvent) {
    if (mouseStartX.current === null) return;
    const delta = e.clientX - mouseStartX.current;
    if (Math.abs(delta) > 40) { if (delta < 0) next(); else prev(); }
    mouseStartX.current = null;
  }

  return (
    <div
      className="relative aspect-square bg-white border border-white/8 overflow-hidden group flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="relative w-full h-full">
        <Image
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          fill
          className="object-contain p-10 transition-opacity duration-200"
          unoptimized
          draggable={false}
        />
      </div>

      {/* Arrow buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-dark-1/60 border border-white/10 text-white/50 hover:text-gold hover:border-gold/40 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-dark-1/60 border border-white/10 text-white/50 hover:text-gold hover:border-gold/40 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            ›
          </button>
        </>
      )}

      {/* Corner accents */}
      <div className="absolute top-5 left-5 w-8 h-8 border-l border-t border-gold/40 pointer-events-none" />
      <div className="absolute top-5 right-5 w-8 h-8 border-r border-t border-gold/40 pointer-events-none" />
      <div className="absolute bottom-5 left-5 w-8 h-8 border-l border-b border-gold/40 pointer-events-none" />
      <div className="absolute bottom-5 right-5 w-8 h-8 border-r border-b border-gold/40 pointer-events-none" />

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
          {images.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-200 ${i === index ? "w-4 h-1 bg-gold" : "w-1 h-1 bg-white/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
