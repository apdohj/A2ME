"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const accounts = [
  {
    id: 1,
    game: "Valorant",
    gameIcon: "🎯",
    rank: "Immortal 2",
    level: 142,
    skins: 45,
    agents: "All",
    price: 249.99,
    region: "EU",
    featured: true,
  },
  {
    id: 2,
    game: "League of Legends",
    gameIcon: "⚔️",
    rank: "Diamond 1",
    level: 230,
    skins: 120,
    agents: "140+ Champions",
    price: 199.99,
    region: "NA",
    featured: true,
  },
  {
    id: 3,
    game: "CS2",
    gameIcon: "🔫",
    rank: "LEM",
    level: 87,
    skins: 30,
    agents: "N/A",
    price: 149.99,
    region: "EU",
    featured: false,
  },
  {
    id: 4,
    game: "Overwatch 2",
    gameIcon: "🛡️",
    rank: "Master 3",
    level: 310,
    skins: 85,
    agents: "All Heroes",
    price: 179.99,
    region: "NA",
    featured: false,
  },
  {
    id: 5,
    game: "Valorant",
    gameIcon: "🎯",
    rank: "Diamond 3",
    level: 98,
    skins: 22,
    agents: "18 Agents",
    price: 129.99,
    region: "NA",
    featured: false,
  },
  {
    id: 6,
    game: "League of Legends",
    gameIcon: "⚔️",
    rank: "Master",
    level: 340,
    skins: 200,
    agents: "All Champions",
    price: 349.99,
    region: "EU",
    featured: true,
  },
  {
    id: 7,
    game: "CS2",
    gameIcon: "🔫",
    rank: "Supreme",
    level: 120,
    skins: 55,
    agents: "N/A",
    price: 219.99,
    region: "EU",
    featured: false,
  },
  {
    id: 8,
    game: "Valorant",
    gameIcon: "🎯",
    rank: "Radiant",
    level: 200,
    skins: 80,
    agents: "All",
    price: 499.99,
    region: "EU",
    featured: true,
  },
];

const gameFilters = ["All", "Valorant", "League of Legends", "CS2", "Overwatch 2"];
const regionFilters = ["All", "EU", "NA", "ASIA"];

export default function MarketplaceContent() {
  const [gameFilter, setGameFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [sortBy, setSortBy] = useState("price-asc");
  const [previewAccount, setPreviewAccount] = useState<number | null>(null);

  const filtered = accounts
    .filter((a) => gameFilter === "All" || a.game === gameFilter)
    .filter((a) => regionFilter === "All" || a.region === regionFilter)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Account{" "}
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Marketplace
          </span>
        </h1>
        <p className="text-slate-400">
          Browse pre-leveled accounts ready to play. Instant delivery guaranteed.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="glass-card p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-slate-400 mb-2 block">Game</label>
            <div className="flex flex-wrap gap-2">
              {gameFilters.map((g) => (
                <button
                  key={g}
                  onClick={() => setGameFilter(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    gameFilter === g
                      ? "bg-neon-blue/20 border border-neon-blue/50 text-white"
                      : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Region</label>
            <div className="flex gap-2">
              {regionFilters.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    regionFilter === r
                      ? "bg-neon-purple/20 border border-neon-purple/50 text-white"
                      : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 outline-none"
            >
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((account, i) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card glass-card-hover overflow-hidden group relative"
          >
            {account.featured && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold z-10">
                ⭐ FEATURED
              </div>
            )}

            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{account.gameIcon}</span>
                <div>
                  <div className="text-sm font-bold text-white">
                    {account.game}
                  </div>
                  <div className="text-xs text-neon-blue font-semibold">
                    {account.rank}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-slate-500">Level</div>
                  <div className="text-sm font-bold text-white">
                    {account.level}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-slate-500">Skins</div>
                  <div className="text-sm font-bold text-white">
                    {account.skins}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-slate-500">Characters</div>
                  <div className="text-sm font-bold text-white text-[10px]">
                    {account.agents}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white/5 text-center">
                  <div className="text-xs text-slate-500">Region</div>
                  <div className="text-sm font-bold text-white">
                    {account.region}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-xs text-slate-500">Price</div>
                  <div className="text-2xl font-black text-white">
                    ${account.price}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPreviewAccount(
                      previewAccount === account.id ? null : account.id
                    )
                  }
                  className="text-xs text-neon-blue hover:underline"
                >
                  Quick View
                </button>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                Buy Now
              </button>
            </div>

            {/* Quick Preview */}
            {previewAccount === account.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                className="border-t border-white/5 p-4 bg-white/[0.02]"
              >
                <div className="text-xs text-slate-400 space-y-1.5">
                  <p>✅ Email verified & changeable</p>
                  <p>✅ Original owner information</p>
                  <p>✅ Instant delivery via email</p>
                  <p>✅ 30-day warranty included</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <div className="text-4xl mb-4">🔍</div>
          <p>No accounts found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
