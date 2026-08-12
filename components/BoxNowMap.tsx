"use client";
import { useEffect, useRef } from "react";

export interface Locker {
  id: string;
  name: string;
  addressLine1: string;
  postalCode?: string;
  note?: string;
  lat?: string;
  lng?: string;
}

interface Props {
  lockers: Locker[];
  selected: string | null;
  onSelect: (locker: Locker) => void;
  userLat?: number;
  userLng?: number;
}

export default function BoxNowMap({ lockers, selected, onSelect, userLat, userLng }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || lockers.length === 0) return;

    const valid = lockers.filter((l) => l.lat && l.lng);
    if (valid.length === 0) return;

    import("leaflet").then((L) => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }

      const centerLat = userLat ?? parseFloat(valid[0].lat!);
      const centerLng = userLng ?? parseFloat(valid[0].lng!);

      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: false }).setView(
        [centerLat, centerLng],
        14
      );
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      // User location pin
      if (userLat && userLng) {
        const userIcon = L.divIcon({
          html: `<div style="width:12px;height:12px;background:#C9A96E;border-radius:50%;border:2px solid #fff;box-shadow:0 0 6px rgba(201,169,110,0.8)"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
          className: "",
        });
        L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup("Вашият адрес");
      }

      // BoxNow pins
      valid.forEach((locker) => {
        const isSelected = locker.id === selected;
        const icon = L.divIcon({
          html: `<div style="
            background:${isSelected ? "#00c853" : "#1a1a1a"};
            border:2px solid ${isSelected ? "#00c853" : "#C9A96E"};
            color:${isSelected ? "#fff" : "#C9A96E"};
            font-size:9px;font-weight:bold;
            padding:3px 5px;
            white-space:nowrap;
            box-shadow:0 2px 6px rgba(0,0,0,0.5);
            cursor:pointer;
          ">BN</div>`,
          iconSize: [28, 20],
          iconAnchor: [14, 10],
          className: "",
        });

        const marker = L.marker([parseFloat(locker.lat!), parseFloat(locker.lng!)], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;font-size:12px;min-width:160px">
              <strong>${locker.name}</strong><br/>
              <span style="color:#666">${locker.addressLine1}</span>
              ${locker.note ? `<br/><span style="color:#999;font-size:11px">${locker.note}</span>` : ""}
              <br/><br/>
              <button onclick="window.__boxnowSelectLocker('${locker.id}')" style="background:#00c853;color:#fff;border:none;padding:4px 10px;cursor:pointer;font-size:11px">Избери</button>
            </div>`
          );

        marker.on("click", () => {
          onSelect(locker);
          marker.openPopup();
        });
      });

      // Expose select function for popup button
      (window as unknown as Record<string, unknown>).__boxnowSelectLocker = (id: string) => {
        const locker = valid.find((l) => l.id === id);
        if (locker) onSelect(locker);
      };
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lockers, selected, userLat, userLng, onSelect]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} style={{ height: "320px", width: "100%", background: "#111" }} />
    </>
  );
}
