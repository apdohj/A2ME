"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { games } from "@/lib/gameData";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Coaching", href: "/coaching" },
  { label: "Become a Booster", href: "/booster" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card border-0 border-b border-glass-border rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center font-black text-white text-lg">
                A
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                A2ME
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Games Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setGamesOpen(true)}
                onMouseLeave={() => setGamesOpen(false)}
              >
                <button className="px-4 py-2 text-sm text-slate-300 hover:text-neon-blue transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1">
                  Games
                  <svg
                    className={`w-4 h-4 transition-transform ${gamesOpen ? "rotate-180" : ""}`}
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
                      className="absolute top-full left-0 mt-1 glass-card p-2 min-w-[200px]"
                    >
                      {games.map((game) => (
                        <a
                          key={game.id}
                          href={`/boost?game=${game.id}`}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm text-slate-300 hover:text-neon-blue transition-colors"
                        >
                          <span className="text-lg">{game.icon}</span>
                          {game.name}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.slice(1).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-neon-blue transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                Sign In
              </button>
              <a
                href="/dashboard"
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:opacity-90 transition-opacity neon-glow"
              >
                Dashboard
              </a>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-slate-300"
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
            className="md:hidden glass-card border-0 border-b border-glass-border rounded-none"
          >
            <div className="px-4 py-4 space-y-2">
              {games.map((game) => (
                <a
                  key={game.id}
                  href={`/boost?game=${game.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm text-slate-300"
                >
                  <span>{game.icon}</span>
                  {game.name}
                </a>
              ))}
              <hr className="border-white/10 my-2" />
              {navLinks.slice(1).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2.5 rounded-lg hover:bg-white/5 text-sm text-slate-300"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-white/10 my-2" />
              <a
                href="/dashboard"
                className="block px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-center text-sm font-semibold"
              >
                Dashboard
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
