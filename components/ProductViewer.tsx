"use client";
import { useRef, useState } from "react";
import Image from "next/image";

interface ProductViewerProps {
  images: string[];
  alt: string;
}

export default function ProductViewer({ images, alt }: ProductViewerProps) {
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);
  const lastX = useRef(0);

  const front = images[0];
  const sideRight = images[1] || images[0];
  const back = images[2] || images[1] || images[0];
  const sideLeft = images[3] || images[1] || images[0];

  // Normalize angle to 0–360
  const norm = ((angle % 360) + 360) % 360;

  let src = front;
  let flip = false;
  if (norm > 30 && norm <= 90) {
    src = sideRight; flip = false;
  } else if (norm > 90 && norm <= 150) {
    src = back; flip = false;
  } else if (norm > 150 && norm <= 210) {
    src = back; flip = false;
  } else if (norm > 210 && norm <= 270) {
    src = sideLeft; flip = false;
  } else if (norm > 270 && norm < 330) {
    src = sideLeft; flip = true;
  }

  function handleStart(x: number) {
    setDragging(true);
    lastX.current = x;
  }
  function handleMove(x: number) {
    if (!dragging) return;
    const delta = x - lastX.current;
    lastX.current = x;
    setAngle((a) => a + delta * 0.6);
  }
  function handleEnd() {
    setDragging(false);
  }

  return (
    <div
      className="relative aspect-square bg-white border border-white/8 overflow-hidden group flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing"
      onPointerDown={(e) => handleStart(e.clientX)}
      onPointerMove={(e) => handleMove(e.clientX)}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
    >
      <div
        className="relative w-full h-full transition-transform duration-150"
        style={{ transform: flip ? "scaleX(-1)" : "scaleX(1)" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-10"
          onError={(e) => { (e.target as HTMLImageElement).src = `${front.replace(/-\d\.jpg$/, "")}.svg`; }}
          unoptimized
          draggable={false}
        />
      </div>

      {/* Corner accents */}
      <div className="absolute top-5 left-5 w-8 h-8 border-l border-t border-gold/40 pointer-events-none" />
      <div className="absolute top-5 right-5 w-8 h-8 border-r border-t border-gold/40 pointer-events-none" />
      <div className="absolute bottom-5 left-5 w-8 h-8 border-l border-b border-gold/40 pointer-events-none" />
      <div className="absolute bottom-5 right-5 w-8 h-8 border-r border-b border-gold/40 pointer-events-none" />

      {/* Drag-to-rotate hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-dark-1/80 backdrop-blur-sm border border-gold/20 px-4 py-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse" />
        <span className="text-[9px] tracking-[0.4em] uppercase font-sans text-white/40">Drag to Rotate</span>
      </div>
    </div>
  );
}
