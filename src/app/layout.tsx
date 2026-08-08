import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import FirebaseProvider from "@/components/FirebaseProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "A2ME — Level Up Your Game",
  description: "Professional gaming rank boosting services. Fast, safe, and affordable. LoL, Valorant, CS2, Overwatch and more.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-obsidian text-slate-200 antialiased min-h-screen`}>
        <FirebaseProvider />
        {children}
      </body>
    </html>
  );
}
