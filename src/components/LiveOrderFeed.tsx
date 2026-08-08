"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const countries = [
  "Germany", "United States", "France", "United Kingdom",
  "Brazil", "Canada", "Spain", "Italy", "Netherlands",
  "Australia", "Sweden", "Poland", "Turkey", "Japan", "South Korea",
];

const ranks = [
  { game: "Valorant", ranks: ["Diamond 2", "Immortal 1", "Ascendant 3", "Platinum 1", "Diamond 3"] },
  { game: "League of Legends", ranks: ["Platinum 2", "Diamond 4", "Emerald 1", "Gold 1", "Master"] },
  { game: "CS2", ranks: ["DMG", "LE", "LEM", "Supreme", "Global Elite"] },
  { game: "Overwatch 2", ranks: ["Diamond 3", "Master 5", "Platinum 1", "Diamond 1", "Master 2"] },
];

const flags: Record<string, string> = {
  Germany: "🇩🇪", "United States": "🇺🇸", France: "🇫🇷", "United Kingdom": "🇬🇧",
  Brazil: "🇧🇷", Canada: "🇨🇦", Spain: "🇪🇸", Italy: "🇮🇹", Netherlands: "🇳🇱",
  Australia: "🇦🇺", Sweden: "🇸🇪", Poland: "🇵🇱", Turkey: "🇹🇷", Japan: "🇯🇵", "South Korea": "🇰🇷",
};

function generateOrder() {
  const country = countries[Math.floor(Math.random() * countries.length)];
  const gameData = ranks[Math.floor(Math.random() * ranks.length)];
  const rank = gameData.ranks[Math.floor(Math.random() * gameData.ranks.length)];
  const minutes = Math.floor(Math.random() * 30) + 1;
  return {
    id: Date.now() + Math.random(),
    country,
    flag: flags[country] || "🌍",
    game: gameData.game,
    rank,
    minutes,
  };
}

export default function LiveOrderFeed() {
  const [orders, setOrders] = useState(() =>
    Array.from({ length: 5 }, generateOrder)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) => {
        const newOrder = generateOrder();
        return [newOrder, ...prev.slice(0, 4)];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-neon-green mb-4">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Live Activity Feed
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Recent{" "}
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Completions
            </span>
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          <AnimatePresence initial={false}>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -50, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 50, height: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-card px-5 py-3.5 flex items-center gap-4"
              >
                <span className="text-xl">{order.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate">
                    Someone in{" "}
                    <span className="text-white font-medium">
                      {order.country}
                    </span>{" "}
                    reached{" "}
                    <span className="text-neon-blue font-semibold">
                      {order.rank}
                    </span>{" "}
                    in {order.game}
                  </p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {order.minutes}m ago
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
