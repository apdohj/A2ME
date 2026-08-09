"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Bell,
  UserPlus,
  LogIn,
  Home,
  Store,
  BadgeDollarSign,
  HelpCircle,
  Headphones,
} from "lucide-react";

const NAV = [
  { label: "Home", href: "/", icon: Home },
  { label: "Browse Accounts", href: "/marketplace", icon: Store },
  { label: "Sell Account", href: "/sell", icon: BadgeDollarSign },
  { label: "How It Works", href: "/#how-it-works", icon: HelpCircle },
  { label: "Support", href: "/support", icon: Headphones },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-a2-bg/85 backdrop-blur-xl border-b border-a2-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px] gap-3">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="lg:hidden p-2 -ml-1 rounded-lg text-a2-light/80 hover:text-a2-gold hover:bg-white/5 transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home/header-logo.png"
                alt="A2ME"
                className="h-9 w-9 lg:h-11 lg:w-11 object-contain rounded-lg bg-a2-card border border-a2-border p-1 group-hover:border-a2-gold/50 transition-colors"
              />
              <span className="flex flex-col leading-none">
                <span className="font-logo text-lg lg:text-xl font-bold text-a2-gold">
                  A2ME
                </span>
                <span className="mt-1 text-[8px] lg:text-[9px] font-semibold tracking-[0.3em] text-a2-light/70">
                  MIDDLE EAST
                </span>
                <span className="mt-0.5 text-[8px] lg:text-[9px] font-semibold tracking-[0.3em] text-a2-light/70">
                  GAMING ACCOUNTS
                </span>
              </span>
            </Link>
          </div>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-a2-gold"
                      : "text-a2-light/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-[1px] left-3.5 right-3.5 h-0.5 rounded-full bg-a2-gold a2-glow-soft" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: desktop */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              aria-label="Search"
              className="p-2 rounded-lg text-a2-light/70 hover:text-a2-gold hover:bg-white/5 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/marketplace"
              aria-label="Cart"
              className="p-2 rounded-lg text-a2-light/70 hover:text-a2-gold hover:bg-white/5 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <button
              aria-label="Notifications"
              className="relative p-2 rounded-lg text-a2-light/70 hover:text-a2-gold hover:bg-white/5 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-a2-gold text-black text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </button>

            <span className="mx-1.5 h-6 w-px bg-a2-border" />

            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-a2-border text-a2-light text-sm font-semibold hover:border-a2-gold/50 hover:text-a2-gold transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-a2-gold text-black text-sm font-bold hover:bg-a2-gold-bright transition-colors a2-glow-soft"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
          </div>

          {/* Right: mobile icons */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              aria-label="Search"
              className="p-2 rounded-lg text-a2-light/80 hover:text-a2-gold transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/marketplace"
              aria-label="Cart"
              className="relative p-2 rounded-lg text-a2-light/80 hover:text-a2-gold transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-a2-gold text-black text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-a2-border bg-a2-bg2/95 backdrop-blur-xl max-h-[calc(100dvh-4rem)] overflow-y-auto"
          >
            <nav className="px-4 py-4 space-y-1">
              {NAV.map((item) => {
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
              <div className="pt-3 mt-1 border-t border-a2-border flex gap-2">
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
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
