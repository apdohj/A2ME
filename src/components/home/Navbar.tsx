"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  UserPlus,
  LogIn,
  Home,
  Store,
  BadgeDollarSign,
  HelpCircle,
  Headphones,
  ChevronDown,
  GraduationCap,
  Crown,
  Wallet,
  MessageCircle,
  LogOut,
  LayoutDashboard,
  Gamepad2,
  Languages,
} from "lucide-react";
import { games } from "@/lib/gameData";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { CURRENCIES } from "@/lib/currency";
import { useSettings } from "@/lib/settings-context";
import { useLanguage } from "@/lib/language-context";
import { currencySymbols, type Currency } from "@/lib/types";

const NAV = [
  { label: "Home", href: "/", icon: Home },
  { label: "Browse Accounts", href: "/marketplace", icon: Store },
  { label: "Sell Account", href: "/sell", icon: BadgeDollarSign },
  { label: "How It Works", href: "/#how-it-works", icon: HelpCircle },
  { label: "Support", href: "/support", icon: Headphones },
];

const MORE_NAV = [
  { label: "Coaching", href: "/coaching", icon: GraduationCap },
  { label: "Boosters", href: "/booster", icon: Crown },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, logout } = useAuth();
  const { currency, setCurrency, format } = useCurrency();
  const { settings } = useSettings();
  const { language, toggleLanguage } = useLanguage();
  const walletFrom = (profile?.walletCurrency ?? "USD") as Currency;
  const walletBalance = profile?.wallet?.[walletFrom] ?? 0;

  const gameLogo = (id: string) =>
    settings.gameLogos?.[id] || `/home/games/${id}.png`;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-a2-bg/85 backdrop-blur-xl border-b border-a2-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16 gap-2">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-1.5 min-w-0 shrink-0">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="p-1.5 -ml-1 rounded-lg text-a2-light/80 hover:text-a2-gold hover:bg-white/5 transition-colors"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <Link href="/" className="flex items-center group shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home/header-logo.png"
                alt="A2ME — Middle East Gaming Accounts"
                className="h-8 lg:h-9 w-auto object-contain drop-shadow-[0_0_14px_rgba(255,201,40,0.25)] group-hover:drop-shadow-[0_0_18px_rgba(255,201,40,0.4)] transition-[filter]"
              />
            </Link>
          </div>

          {/* Center nav — desktop */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "text-a2-gold"
                      : "text-a2-light/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-[1px] left-2.5 right-2.5 h-0.5 rounded-full bg-a2-gold a2-glow-soft" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: desktop */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-a2-border text-a2-light/80 hover:border-a2-gold/40 hover:text-a2-gold transition-colors text-[13px] font-semibold"
            >
              <Languages className="w-3.5 h-3.5" />
              {language === "en" ? "عربي" : "EN"}
            </button>

            {/* Currency selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                aria-label="Currency"
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-a2-border text-a2-light/80 hover:border-a2-gold/40 hover:text-a2-gold transition-colors text-[13px] font-semibold"
              >
                <span className="text-a2-gold">{currencySymbols[currency]}</span>
                {currency}
                <ChevronDown
                  className={`w-3 h-3 text-a2-light/50 transition-transform ${
                    currencyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 p-1 min-w-[180px] rounded-xl bg-a2-bg2 border border-a2-border shadow-2xl shadow-black/60"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-a2-light/50 border-b border-a2-border mb-1">
                      Display currency
                    </div>
                    {CURRENCIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setCurrencyOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          currency === c
                            ? "bg-a2-gold/15 text-a2-gold"
                            : "text-a2-light/80 hover:bg-white/5"
                        }`}
                      >
                        <span className="font-medium">{c}</span>
                        <span className="text-xs text-a2-light/50">
                          {currencySymbols[c]}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              aria-label="Search"
              className="p-1.5 rounded-lg text-a2-light/70 hover:text-a2-gold hover:bg-white/5 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/marketplace"
              aria-label="Cart"
              className="relative p-1.5 rounded-lg text-a2-light/70 hover:text-a2-gold hover:bg-white/5 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-a2-gold text-black text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </Link>

            <span className="mx-1 h-5 w-px bg-a2-border" />

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  title="Wallet balance"
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-a2-gold/10 border border-a2-gold/30 text-a2-gold text-xs font-bold hover:bg-a2-gold/20 transition-colors whitespace-nowrap"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  {format(walletBalance, walletFrom)}
                </Link>
                <Link
                  href="/messages"
                  aria-label="Messages"
                  className="p-1.5 rounded-lg text-a2-light/70 hover:text-a2-gold hover:bg-white/5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-a2-gold text-black text-[13px] font-bold hover:bg-a2-gold-bright transition-colors a2-glow-soft whitespace-nowrap"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="p-1.5 rounded-lg text-a2-light/70 hover:text-a2-gold hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-a2-border text-a2-light text-[13px] font-semibold hover:border-a2-gold/50 hover:text-a2-gold transition-colors whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-a2-gold text-black text-[13px] font-bold hover:bg-a2-gold-bright transition-colors a2-glow-soft whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Right: mobile icons */}
          <div className="lg:hidden flex items-center gap-0.5 shrink-0">
            <button
              aria-label="Search"
              className="p-1.5 rounded-lg text-a2-light/80 hover:text-a2-gold transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/marketplace"
              aria-label="Cart"
              className="relative p-1.5 rounded-lg text-a2-light/80 hover:text-a2-gold transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-a2-gold text-black text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-a2-border bg-a2-bg2/95 backdrop-blur-xl max-h-[calc(100dvh-3.5rem)] overflow-y-auto shadow-2xl shadow-black/50"
          >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
              {[...NAV, ...MORE_NAV].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-a2-gold/10 text-a2-gold border border-a2-gold/30"
                        : "text-a2-light/80 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Games */}
              <div className="pt-3 mt-1 border-t border-a2-border">
                <div className="flex items-center gap-2 px-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-a2-light/50">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  Choose your game
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {games.map((game) => (
                    <a
                      key={game.id}
                      href={`/boost?game=${game.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-a2-light/80 transition-colors"
                    >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={gameLogo(game.id)}
                            alt={game.name}
                            className="h-6 w-6 object-contain"
                          />
                      <span className="truncate">{game.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="pt-3 mt-1 border-t border-a2-border">
                <div className="flex items-center gap-2 px-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-a2-light/50">
                  <Languages className="w-3.5 h-3.5" />
                  Language
                </div>
                <div className="flex gap-1.5 px-4">
                  <button
                    onClick={() => language !== "en" && toggleLanguage()}
                    className={`flex-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      language === "en"
                        ? "bg-a2-gold/20 border border-a2-gold/50 text-a2-gold"
                        : "bg-white/5 border border-a2-border text-a2-light/70"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => language !== "ar" && toggleLanguage()}
                    className={`flex-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      language === "ar"
                        ? "bg-a2-gold/20 border border-a2-gold/50 text-a2-gold"
                        : "bg-white/5 border border-a2-border text-a2-light/70"
                    }`}
                  >
                    العربية
                  </button>
                </div>
              </div>

              {/* Currency */}
              <div className="pt-3 mt-1 border-t border-a2-border">
                <div className="flex items-center gap-2 px-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-a2-light/50">
                  Display currency
                </div>
                <div className="flex flex-wrap gap-1.5 px-4">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        currency === c
                          ? "bg-a2-gold/20 border border-a2-gold/50 text-a2-gold"
                          : "bg-white/5 border border-a2-border text-a2-light/70"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-1 border-t border-a2-border flex gap-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-a2-gold/10 border border-a2-gold/30 text-a2-gold text-sm font-bold"
                    >
                      <Wallet className="w-4 h-4" />
                      {format(walletBalance, walletFrom)}
                    </Link>
                    <Link
                      href="/messages"
                      onClick={() => setOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-a2-card border border-a2-border text-a2-light text-sm font-semibold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Messages
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-3 rounded-xl bg-a2-card border border-a2-border text-a2-light/70"
                      aria-label="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-a2-border text-a2-light text-sm font-semibold"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-a2-gold text-black text-sm font-bold"
                    >
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
