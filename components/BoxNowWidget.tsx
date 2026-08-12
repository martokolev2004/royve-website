"use client";
import { useEffect, useRef } from "react";

export interface BNSelected {
  boxnowLockerId: string;
  boxnowLockerAddressLine1: string;
  boxnowLockerPostalCode: string;
  boxnowLockerName?: string;
}

interface Props {
  partnerId: number;
  onSelect: (locker: BNSelected) => void;
}

declare global {
  interface Window {
    _bn_map_widget_config?: object;
    __bnOnSelect?: (locker: BNSelected) => void;
  }
}

export default function BoxNowWidget({ partnerId, onSelect }: Props) {
  const loaded = useRef(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    // Expose callback via ref so it always calls the latest version
    window.__bnOnSelect = (locker) => onSelectRef.current(locker);

    window._bn_map_widget_config = {
      type: "popup",
      autoselect: false,
      autoclose: true,
      partnerId,
      parentElement: "body",
      afterSelect: (selected: BNSelected) => {
        if (window.__bnOnSelect) window.__bnOnSelect(selected);
      },
    };

    const script = document.createElement("script");
    script.src = "https://widget-cdn.boxnow.bg/map-widget/client/v5.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [partnerId]);

  return null;
}
