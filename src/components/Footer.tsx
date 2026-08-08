"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings-context";

export default function Footer() {
  const { settings } = useSettings();

  return (    <footer className="border-t border-white/5 bg-charcoal/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {settings.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logoUrl} alt={settings.siteName} className="w-36 h-12 rounded-lg object-contain" />
              ) : (
                <img src="/logo.svg" alt={settings.siteName} className="w-36 h-12 rounded-lg object-contain" />
              )}
              <span className="text-lg font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                {settings.siteName}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {settings.tagline}
            </p>
            <div className="flex gap-3">
              {["Discord", "Twitter", "Instagram"].map((social) => (
                <button
                  key={social}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {social[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/boost?game=valorant" className="hover:text-neon-blue transition-colors">
                  Valorant Boosting
                </a>
              </li>
              <li>
                <a href="/boost?game=lol" className="hover:text-neon-blue transition-colors">
                  LoL Boosting
                </a>
              </li>
              <li>
                <a href="/boost?game=cs2" className="hover:text-neon-blue transition-colors">
                  CS2 Boosting
                </a>
              </li>
              <li>
                <a href="/boost?game=overwatch" className="hover:text-neon-blue transition-colors">
                  Overwatch 2 Boosting
                </a>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-neon-blue transition-colors">
                  Account Marketplace
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-neon-blue transition-colors">
                  Sell Accounts
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#faq" className="hover:text-neon-blue transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-neon-blue transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-neon-blue transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/messages" className="hover:text-neon-blue transition-colors">
                  Messages
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-neon-blue transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-blue transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-blue transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2026 {settings.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>💳 Visa</span>
            <span>💳 Mastercard</span>
            <span>💰 PayPal</span>
            <span>₿ Crypto</span>
          </div>
        </div>

        {/* Hidden admin access — very small, at the very bottom */}
        <div className="flex justify-center pt-4">
          <a
            href="/admin"
            title="Admin"
            className="text-[9px] text-slate-700 hover:text-gold transition-colors select-none"
          >
            ●
          </a>
        </div>
      </div>
    </footer>
  );
}
