"use client";
import MetaPixel from "./MetaPixel";
import { useCookiePrefs } from "./CookieConsent";

export default function TrackingProvider() {
  const prefs = useCookiePrefs();
  return <MetaPixel enabled={prefs?.marketing === true} />;
}
