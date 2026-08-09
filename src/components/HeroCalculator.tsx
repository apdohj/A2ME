"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  games,
  getAllDivisions,
  getRankColor,
  getRankIcon,
  calculatePrice,
} from "@/lib/gameData";
import { GameLogo } from "@/components/GameLogo";
import { useSettings } from "@/lib/settings-context";
import { useCurrency } from "@/lib/currency-context";

export default function HeroCalculator() {
  const { settings } = useSettings();
  const { format } = useCurrency();
  const [selectedGame, setSelectedGame] = useState(0);
  const [fromRank, setFromRank] = useState(0);
  const [toRank, setToRank] = useState(3);
  const [extras, setExtras] = useState({
    vpn: false,
    duo: false,
    stream: false,
    express: false,
  });

  const game = games[selectedGame];
  const divisions = useMemo(() => getAllDivisions(game), [game]);

  const { price, eta } = useMemo(
    () => calculatePrice(game, fromRank, toRank, extras),
    [game, fromRank, toRank, extras]
  );

  const handleToRankChange = (val: number) => {
    if (val > fromRank) setToRank(val);
  };

  const handleFromRankChange = (val: number) => {
    setFromRank(val);
    if (toRank <= val) setToRank(Math.min(val + 1, divisions.length - 1));
  };

  return (
    <section className="relative min-h-screen flex items-center gradient-hero pt-20">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-neon-purple/10 blur-3xl animate-float pointer-events-none" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-neon-blue/10 blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-8 flex items-center justify-start">
              <img
                src={settings.logoUrl || "/logo.svg"}
                alt={`${settings.siteName} logo`}
                className="w-full max-w-[430px] h-auto max-h-36 object-contain object-left drop-shadow-[0_0_28px_rgba(245,197,24,0.28)]"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-neon-blue mb-6">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              {settings.texts.heroBadge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              {settings.texts.heroTitle}{" "}
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent neon-text">
                {settings.texts.heroHighlight}
              </span>
              <br />
              {settings.texts.heroTitle2}
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-lg">
              {settings.texts.heroSubtitle}
            </p>

            {/* Trust Points */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: "🛡️", label: "VPN Protected" },
                { icon: "⚡", label: "Fast Delivery" },
                { icon: "💬", label: "24/7 Support" },
                { icon: "🔒", label: "100% Safe" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Trustpilot */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className="w-5 h-5 text-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-slate-400">
                <span className="text-white font-semibold">4.9/5</span> from
                12,000+ reviews on Trustpilot
              </span>
            </div>
          </motion.div>

          {/* Right: Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="glass-card p-6 sm:p-8 neon-glow">
              <h2 className="text-xl font-bold mb-6 text-center">
                ⚡ Quick Boost Calculator
              </h2>

              {/* Game Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 max-h-52 overflow-y-auto pr-1">
                {games.map((g, i) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedGame(i);
                      setFromRank(0);
                      setToRank(3);
                    }}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                      selectedGame === i
                        ? "bg-gradient-to-br from-neon-blue/25 to-neon-purple/20 border border-neon-blue/60 text-white shadow-[0_0_18px_rgba(245,197,24,0.18)]"
                        : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-gold/40"
                    }`}
                  >
                    <span className="w-9 h-9 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      <GameLogo game={g} className="h-6 w-auto max-w-7" />
                    </span>
                    <span className="truncate">{g.name}</span>
                  </button>
                ))}
              </div>

              {/* Rank Selection */}
              <div className="space-y-6 mb-6">
                {/* Current Rank */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Current Rank
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">
                      {getRankIcon(game, divisions[fromRank])}
                    </span>
                    <div className="flex-1">
                      <div
                        className="text-sm font-semibold mb-1"
                        style={{ color: getRankColor(game, divisions[fromRank]) }}
                      >
                        {divisions[fromRank]}
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={divisions.length - 2}
                        value={fromRank}
                        onChange={(e) =>
                          handleFromRankChange(parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Desired Rank */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Desired Rank
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">
                      {getRankIcon(game, divisions[toRank])}
                    </span>
                    <div className="flex-1">
                      <div
                        className="text-sm font-semibold mb-1"
                        style={{ color: getRankColor(game, divisions[toRank]) }}
                      >
                        {divisions[toRank]}
                      </div>
                      <input
                        type="range"
                        min={fromRank + 1}
                        max={divisions.length - 1}
                        value={toRank}
                        onChange={(e) =>
                          handleToRankChange(parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick extras toggles */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { key: "vpn" as const, label: "VPN Protection", icon: "🛡️", extra: "+10%" },
                  { key: "duo" as const, label: "Duo Queue", icon: "👥", extra: "+50%" },
                  { key: "stream" as const, label: "Live Stream", icon: "🎥", extra: "+15%" },
                  { key: "express" as const, label: "Express", icon: "⚡", extra: "+30%" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() =>
                      setExtras((prev) => ({
                        ...prev,
                        [opt.key]: !prev[opt.key],
                      }))
                    }
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all ${
                      extras[opt.key]
                        ? "bg-neon-blue/15 border border-neon-blue/50 text-white"
                        : "bg-white/5 border border-white/5 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span className="flex-1 text-left">{opt.label}</span>
                    <span className="text-neon-blue text-[10px]">{opt.extra}</span>
                  </button>
                ))}
              </div>

              {/* Price Display */}
              <div className="flex items-end justify-between mb-6 p-4 rounded-xl bg-white/5">
                <div>
                  <div className="text-xs text-slate-400 mb-1">
                    Estimated Price
                  </div>
                  <div className="text-3xl font-black text-white">
                    {format(price)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-1">ETA</div>
                  <div className="text-lg font-semibold text-neon-blue">
                    ~{eta}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href={`/boost?game=${game.id}&from=${fromRank}&to=${toRank}`}
                className="block w-full py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-center font-bold text-lg hover:opacity-90 transition-opacity neon-glow"
              >
                Start Boosting Now →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
