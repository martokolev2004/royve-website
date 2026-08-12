"use client";
import { useEffect, useRef, useState } from "react";

export interface BNSelected {
  boxnowLockerId: string;
  boxnowLockerAddressLine1: string;
  boxnowLockerPostalCode: string;
}

interface Props {
  partnerId: number;
  onSelect: (locker: BNSelected) => void;
}

export default function BoxNowWidget({ partnerId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Listen for postMessage from BoxNow iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      // Accept messages from boxnow domains
      if (!e.origin.includes("boxnow")) return;
      const data = e.data;
      if (!data) return;

      // Try various possible message shapes BoxNow might send
      const lockerId =
        data.boxnowLockerId ?? data.lockerId ?? data.id ?? data.apmId ?? data.locker_id;
      const address =
        data.boxnowLockerAddressLine1 ?? data.addressLine1 ?? data.address ?? data.locker_address;
      const postal =
        data.boxnowLockerPostalCode ?? data.postalCode ?? data.zip ?? data.postal_code ?? "";

      if (lockerId && address) {
        onSelectRef.current({
          boxnowLockerId: String(lockerId),
          boxnowLockerAddressLine1: String(address),
          boxnowLockerPostalCode: String(postal),
        });
        setOpen(false);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Create iframe only when container is visible
  useEffect(() => {
    if (!open || !containerRef.current) return;
    if (iframeRef.current) return; // already created

    const iframe = document.createElement("iframe");
    iframe.src = `https://map.boxnow.bg/popup.html?countryCode=bg&language=bg&partnerId=${partnerId}&autoselect=no&autoclose=yes&gps=yes`;
    iframe.style.cssText = "width:100%;height:100%;border:0;display:block;";
    iframe.allow = "geolocation";
    containerRef.current.appendChild(iframe);
    iframeRef.current = iframe;

    return () => {
      iframe.remove();
      iframeRef.current = null;
    };
  }, [open, partnerId]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full py-3 text-xs tracking-[0.3em] uppercase font-sans font-semibold transition-colors duration-200"
        style={{ background: "#00c853", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Избери BOX NOW автомат
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div className="relative w-full max-w-4xl mx-4" style={{ height: "80vh" }}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white text-xs tracking-widest uppercase font-sans transition-colors"
            >
              ✕ Затвори
            </button>
            <div
              ref={containerRef}
              style={{ width: "100%", height: "100%", background: "#111" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
