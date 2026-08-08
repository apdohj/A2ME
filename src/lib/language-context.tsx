"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Language = "en" | "ar";
type Translation = {
  home: string;
  marketplace: string;
  coaching: string;
  booster: string;
  sell: string;
  messages: string;
  dashboard: string;
  signIn: string;
  create: string;
  language: string;
};

const translations: Record<Language, Translation> = {
  en: { home: "Home", marketplace: "Marketplace", coaching: "Coaching", booster: "Become a Booster", sell: "Sell Accounts", messages: "Messages", dashboard: "Dashboard", signIn: "Sign In", create: "Create Account", language: "العربية" },
  ar: { home: "الرئيسية", marketplace: "السوق", coaching: "التدريب", booster: "كن بوستر", sell: "بيع الحسابات", messages: "الرسائل", dashboard: "لوحة التحكم", signIn: "دخول", create: "إنشاء حساب", language: "English" },
} as const;

const LanguageContext = createContext({ language: "en" as Language, t: translations.en, toggleLanguage: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    const saved = window.localStorage.getItem("a2me-language") as Language | null;
    if (saved === "ar" || saved === "en") setLanguage(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("a2me-language", language);
  }, [language]);
  return <LanguageContext.Provider value={{ language, t: translations[language], toggleLanguage: () => setLanguage((current) => current === "en" ? "ar" : "en") }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
