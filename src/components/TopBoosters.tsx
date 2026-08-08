"use client";

import { motion } from "framer-motion";

const boosters = [
  {
    name: "ShadowFury",
    avatar: "🎭",
    games: ["🎯 Valorant", "🔫 CS2"],
    winRate: 96.8,
    rating: 4.98,
    orders: 1247,
    online: true,
  },
  {
    name: "PhantomAce",
    avatar: "👻",
    games: ["⚔️ LoL", "🛡️ OW2"],
    winRate: 95.2,
    rating: 4.95,
    orders: 982,
    online: true,
  },
  {
    name: "NeonStrike",
    avatar: "⚡",
    games: ["🎯 Valorant"],
    winRate: 97.1,
    rating: 4.97,
    orders: 1563,
    online: false,
  },
  {
    name: "IceVenom",
    avatar: "❄️",
    games: ["⚔️ LoL", "🎯 Valorant"],
    winRate: 94.5,
    rating: 4.92,
    orders: 756,
    online: true,
  },
  {
    name: "CyberWolf",
    avatar: "🐺",
    games: ["🔫 CS2", "🛡️ OW2"],
    winRate: 96.3,
    rating: 4.96,
    orders: 1120,
    online: true,
  },
  {
    name: "BlazeMaster",
    avatar: "🔥",
    games: ["⚔️ LoL"],
    winRate: 95.8,
    rating: 4.94,
    orders: 890,
    online: false,
  },
];

export default function TopBoosters() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/[0.03] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Top{" "}
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Boosters
            </span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Our elite team of verified professionals with proven track records
            and exceptional win rates.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boosters.map((booster, i) => (
            <motion.div
              key={booster.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card glass-card-hover p-6 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center text-2xl border border-white/10">
                  {booster.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{booster.name}</h3>
                    {booster.online && (
                      <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {booster.games.map((g) => (
                      <span
                        key={g}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-sm font-bold text-neon-blue">
                    {booster.winRate}%
                  </div>
                  <div className="text-[10px] text-slate-500">Win Rate</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-sm font-bold text-gold flex items-center justify-center gap-0.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {booster.rating}
                  </div>
                  <div className="text-[10px] text-slate-500">Rating</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-sm font-bold text-white">
                    {booster.orders}
                  </div>
                  <div className="text-[10px] text-slate-500">Orders</div>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl border border-neon-blue/30 text-neon-blue text-sm font-medium hover:bg-neon-blue/10 transition-colors group-hover:border-neon-blue/60">
                Select This Booster
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
