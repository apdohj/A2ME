"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { games } from "@/lib/gameData";
import { GameLogo } from "@/components/GameLogo";
import { useAuth } from "@/lib/auth-context";
import { useSettings } from "@/lib/settings-context";
import { currencySymbols, type Currency } from "@/lib/types";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();
  const localizedNavLinks = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Coaching", href: "/coaching" },
    { label: "Boosters", href: "/booster" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card border-0 border-b border-glass-border rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              {settings.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName}
                  className="w-24 h-9 rounded-lg object-contain bg-white/10 border border-white/10"
                />
              ) : (
                <img src="/logo.svg" alt={settings.siteName} className="w-24 h-9 rounded-lg object-contain bg-white/10 border border-white/10" />
              )}
              <span className="text-lg font-bold bg-gradient-to-r from-gold to-amber-400 bg-clip-text text-transparent whitespace-nowrap">
                {settings.siteName}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {/* Games Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setGamesOpen(true)}
                onMouseLeave={() => setGamesOpen(false)}
              >
                <button className="px-3 py-1.5 text-sm text-slate-300 hover:text-neon-blue transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1">
                  Games
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${gamesOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {gamesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 p-2 min-w-[240px] max-h-[75vh] overflow-y-auto rounded-2xl bg-[#0c0c0c] border border-white/10 shadow-2xl shadow-black/70"
                    >
                      <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-white/10 mb-1.5">
                        Choose your game
                      </div>
                      {games.map((game) => (
                        <a
                          key={game.id}
                          href={`/boost?game=${game.id}`}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.07] text-sm text-slate-200 hover:text-gold transition-colors"
                        >
                          <span className="w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                            <GameLogo game={game} className="h-5 w-auto max-w-7" />
                          </span>
                          <span className="whitespace-nowrap font-medium">{game.name}</span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {localizedNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-neon-blue transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/sell"
                className="px-3 py-1.5 text-sm font-semibold rounded-xl border border-gold/50 text-gold hover:bg-gold/10 transition-colors whitespace-nowrap"
              >
                Sell Accounts
              </Link>

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    title="Wallet balance"
                    className="px-3 py-1.5 rounded-xl bg-gold/10 border border-gold/30 text-gold text-xs font-bold whitespace-nowrap hover:bg-gold/20 transition-colors"
                  >
                    {currencySymbols[(profile?.walletCurrency ?? "USD") as Currency]} {(profile?.wallet?.[profile?.walletCurrency ?? "USD"] ?? 0).toFixed(2)}
                  </Link>
                  <Link
                    href="/messages"
                    className="px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    Messages
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors whitespace-nowrap"
                  >
                    Logout
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-4 py-1.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black hover:opacity-90 transition-opacity neon-glow whitespace-nowrap"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-1.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black hover:opacity-90 transition-opacity neon-glow whitespace-nowrap"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 text-slate-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-card border-0 border-b border-glass-border rounded-none"
          >
            <div className="px-4 py-4 space-y-2">
              {games.map((game) => (
                <a
                  key={game.id}
                  href={`/boost?game=${game.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm text-slate-300"
                >
                  <span className="w-6 flex items-center justify-center shrink-0">
                    <GameLogo game={game} className="h-4 w-auto max-w-6" />
                  </span>
                  {game.name}
                </a>
              ))}
              <hr className="border-white/10 my-2" />
              {localizedNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm text-slate-300"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/10 my-2" />
              <Link
                href="/sell"
                className="block px-4 py-2.5 rounded-xl border border-gold/50 text-gold text-center text-sm font-semibold"
              >
                💰 Sell Accounts
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold text-center text-sm font-bold"
                  >
                    💳 Wallet: {currencySymbols[(profile?.walletCurrency ?? "USD") as Currency]} {(profile?.wallet?.[profile?.walletCurrency ?? "USD"] ?? 0).toFixed(2)}
                  </Link>
                  <Link
                    href="/messages"
                    className="block px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm text-slate-300 text-center"
                  >
                    Messages
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black text-center text-sm font-semibold"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-sm text-slate-400 text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm text-slate-300 text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black text-center text-sm font-semibold"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
