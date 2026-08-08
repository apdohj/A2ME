"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { subscribeSettings } from "./store";
import type { SiteSettings } from "./types";

export const defaultSettings: SiteSettings = {
  siteName: "A2ME",
  tagline: "Level Up Your Game",
  logoUrl: "",
  colors: {
    primary: "#f5c518",
    secondary: "#c9a227",
    background: "#050505",
    text: "#f5f5f5",
  },
  texts: {
    heroBadge: "Boosters online now — ready to help",
    heroTitle: "Level Up Your",
    heroHighlight: "Rank",
    heroTitle2: "Fast & Secure",
    heroSubtitle:
      "Professional boosting services for your favorite games. VPN protected, 24/7 support, and real-time progress tracking.",
    sellTitle: "Sell Your Accounts",
    sellSubtitle:
      "List your account and start earning today. Simple, fast, and secure.",
    sellButton: "Start Selling",
  },
};

interface SettingsContextValue {
  settings: SiteSettings;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const unsub = subscribeSettings((s) => {
      if (s) {
        setSettings({
          ...defaultSettings,
          ...s,
          colors: { ...defaultSettings.colors, ...s.colors },
          texts: { ...defaultSettings.texts, ...s.texts },
        });
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const c = settings.colors;
    const root = document.documentElement;
    root.style.setProperty("--color-neon-blue", c.primary);
    root.style.setProperty("--color-neon-purple", c.secondary);
    root.style.setProperty("--color-neon-green", c.primary);
    root.style.setProperty("--color-neon-pink", c.primary);
    root.style.setProperty("--color-gold", c.primary);
    root.style.setProperty("--color-obsidian", c.background);
    root.style.setProperty("--color-charcoal", c.background);
    document.title = settings.siteName;
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
