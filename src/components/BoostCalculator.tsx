"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import {
  games,
  getAllDivisions,
  getRankColor,
  getRankIcon,
  calculatePrice,
} from "@/lib/gameData";
import { GameLogo } from "@/components/GameLogo";

function BoostCalculatorInner() {
  const searchParams = useSearchParams();
  const gameParam = searchParams.get("game");
  const initialGame = games.findIndex((g) => g.id === gameParam);

  const [selectedGame, setSelectedGame] = useState(
    initialGame >= 0 ? initialGame : 0
  );
  const [fromRank, setFromRank] = useState(
    parseInt(searchParams.get("from") || "0")
  );
  const [toRank, setToRank] = useState(
    parseInt(searchParams.get("to") || "3")
  );
  const [extras, setExtras] = useState({
    vpn: false,
    duo: false,
    stream: false,
    express: false,
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const placeOrder = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: game.id,
          currentRank: divisions[fromRank],
          desiredRank: divisions[toRank],
          price,
          eta,
          extras,
        }),
      });
      if (res.ok) setOrderPlaced(true);
    } catch {
      // silently handle
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-12 neon-glow"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-slate-400 mb-8">
            Your boost from{" "}
            <span className="text-neon-blue font-semibold">
              {divisions[fromRank]}
            </span>{" "}
            to{" "}
            <span className="text-neon-purple font-semibold">
              {divisions[toRank]}
            </span>{" "}
            in {game.name} is being processed.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Go to Dashboard →
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Boost{" "}
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Calculator
          </span>
        </h1>
        <p className="text-slate-400">
          Configure your boost order and see the price update in real-time.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Calculator */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 sm:p-8">
            {/* Game Selector */}
            <h3 className="text-sm text-slate-400 mb-3 font-medium">
              Select Game
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {games.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGame(i);
                    setFromRank(0);
                    setToRank(3);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    selectedGame === i
                      ? "bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/50 text-white"
                      : "bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <span className="h-8 flex items-center justify-center">
                    <GameLogo game={g} className="h-6 w-auto max-w-20" />
                  </span>
                  <span className="text-sm font-medium">{g.name}</span>
                </button>
              ))}
            </div>

            {/* Rank Selectors */}
            <div className="grid sm:grid-cols-2 gap-8 mb-8">
              {/* Current Rank */}
              <div>
                <label className="text-sm text-slate-400 mb-3 block font-medium">
                  Current Rank
                </label>
                <div className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">
                      {getRankIcon(game, divisions[fromRank])}
                    </span>
                    <div>
                      <div
                        className="font-bold text-lg"
                        style={{
                          color: getRankColor(game, divisions[fromRank]),
                        }}
                      >
                        {divisions[fromRank]}
                      </div>
                      <div className="text-xs text-slate-500">
                        Division {fromRank + 1} of {divisions.length}
                      </div>
                    </div>
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

              {/* Desired Rank */}
              <div>
                <label className="text-sm text-slate-400 mb-3 block font-medium">
                  Desired Rank
                </label>
                <div className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">
                      {getRankIcon(game, divisions[toRank])}
                    </span>
                    <div>
                      <div
                        className="font-bold text-lg"
                        style={{
                          color: getRankColor(game, divisions[toRank]),
                        }}
                      >
                        {divisions[toRank]}
                      </div>
                      <div className="text-xs text-slate-500">
                        Division {toRank + 1} of {divisions.length}
                      </div>
                    </div>
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

            {/* Extra Options */}
            <h3 className="text-sm text-slate-400 mb-3 font-medium">
              Extra Options
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  key: "vpn" as const,
                  label: "VPN Protection",
                  icon: "🛡️",
                  extra: "+10%",
                  desc: "Match your login region",
                },
                {
                  key: "duo" as const,
                  label: "Duo Queue",
                  icon: "👥",
                  extra: "+50%",
                  desc: "Play with the booster",
                },
                {
                  key: "stream" as const,
                  label: "Live Stream",
                  icon: "🎥",
                  extra: "+15%",
                  desc: "Watch the gameplay",
                },
                {
                  key: "express" as const,
                  label: "Express Delivery",
                  icon: "⚡",
                  extra: "+30%",
                  desc: "Maximum priority",
                },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() =>
                    setExtras((prev) => ({
                      ...prev,
                      [opt.key]: !prev[opt.key],
                    }))
                  }
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all text-left ${
                    extras[opt.key]
                      ? "bg-neon-blue/10 border border-neon-blue/40 text-white"
                      : "bg-white/5 border border-white/5 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{opt.label}</div>
                    <div className="text-xs text-slate-500">{opt.desc}</div>
                  </div>
                  <span className="text-xs text-neon-blue font-semibold">
                    {opt.extra}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24 neon-glow">
            <h3 className="text-lg font-bold text-white mb-6">
              Order Summary
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Game</span>
                <span className="text-white font-medium flex items-center gap-2">
                  <GameLogo game={game} className="h-4 w-auto max-w-16" />
                  {game.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">From</span>
                <span
                  className="font-medium"
                  style={{ color: getRankColor(game, divisions[fromRank]) }}
                >
                  {divisions[fromRank]}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">To</span>
                <span
                  className="font-medium"
                  style={{ color: getRankColor(game, divisions[toRank]) }}
                >
                  {divisions[toRank]}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Divisions</span>
                <span className="text-white font-medium">
                  {toRank - fromRank}
                </span>
              </div>

              <hr className="border-white/10" />

              {/* Extras */}
              {extras.vpn && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">🛡️ VPN</span>
                  <span className="text-neon-blue">+10%</span>
                </div>
              )}
              {extras.duo && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">👥 Duo Queue</span>
                  <span className="text-neon-blue">+50%</span>
                </div>
              )}
              {extras.stream && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">🎥 Stream</span>
                  <span className="text-neon-blue">+15%</span>
                </div>
              )}
              {extras.express && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">⚡ Express</span>
                  <span className="text-neon-blue">+30%</span>
                </div>
              )}

              <hr className="border-white/10" />

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">ETA</span>
                <span className="text-neon-green font-medium">~{eta}</span>
              </div>
            </div>

            {/* Total */}
            <div className="p-4 rounded-xl bg-white/5 mb-6">
              <div className="text-xs text-slate-400 mb-1">Total Price</div>
              <div className="text-4xl font-black text-white">
                ${price.toFixed(2)}
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Place Order →
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span>🔒</span>
              Secure & Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoostCalculator() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-24 text-center text-slate-400">
          Loading calculator...
        </div>
      }
    >
      <BoostCalculatorInner />
    </Suspense>
  );
}
