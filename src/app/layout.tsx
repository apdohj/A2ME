import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { SettingsProvider } from "@/lib/settings-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { CatalogProvider } from "@/lib/catalog-context";
import FirebaseProvider from "@/components/FirebaseProvider";
import { LanguageProvider } from "@/lib/language-context";
import SplashScreen from "@/components/SplashScreen";
import FloatingSupportButton from "@/components/FloatingSupportButton";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A2ME — Level Up Your Game",
  description: "Professional gaming rank boosting and account marketplace. Buy and sell game accounts with real sellers.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: { url: "/favicon.ico", type: "image/x-icon" },
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className={`${inter.className} ${rajdhani.variable} ${orbitron.variable} bg-obsidian text-slate-200 antialiased min-h-screen`}>
        <FirebaseProvider />
        <AuthProvider>
          <SettingsProvider>
            <CurrencyProvider>
              <CatalogProvider>
                <LanguageProvider>{children}</LanguageProvider>
              </CatalogProvider>
            </CurrencyProvider>
            <SplashScreen />
            <FloatingSupportButton />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
