import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { SettingsProvider } from "@/lib/settings-context";
import { CurrencyProvider } from "@/lib/currency-context";
import FirebaseProvider from "@/components/FirebaseProvider";
import { LanguageProvider } from "@/lib/language-context";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "A2ME — Level Up Your Game",
  description: "Professional gaming rank boosting and account marketplace. Buy and sell game accounts with real sellers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className={`${inter.className} bg-obsidian text-slate-200 antialiased min-h-screen`}>
        <FirebaseProvider />
        <AuthProvider>
          <SettingsProvider>
            <CurrencyProvider>
              <LanguageProvider>{children}</LanguageProvider>
            </CurrencyProvider>
            <SplashScreen />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
