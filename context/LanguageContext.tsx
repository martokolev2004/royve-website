"use client";
import React, { createContext, useContext, useState } from "react";
import { Lang } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, subkey: string) => string;
}

import { translations } from "@/lib/i18n";

const LanguageContext = createContext<LanguageContextType>({
  lang: "bg",
  setLang: () => {},
  t: () => "",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("bg");

  function t(key: string, subkey: string): string {
    const section = (translations as Record<string, Record<string, { bg: string; en: string }>>)[key];
    return section?.[subkey]?.[lang] ?? section?.[subkey]?.en ?? "";
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
