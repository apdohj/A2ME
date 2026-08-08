"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const coaches = [
  {
    id: 1,
    name: "ShadowFury",
    avatar: "🎭",
    game: "Valorant",
    gameIcon: "🎯",
    rank: "Radiant",
    experience: "5 years",
    languages: ["English", "German"],
    hourlyRate: 35,
    rating: 4.98,
    reviews: 234,
    specialties: ["Aim Training", "Game Sense", "Agent Selection"],
    online: true,
  },
  {
    id: 2,
    name: "PhantomAce",
    avatar: "👻",
    game: "League of Legends",
    gameIcon: "⚔️",
    rank: "Challenger",
    experience: "7 years",
    languages: ["English", "Korean"],
    hourlyRate: 45,
    rating: 4.95,
    reviews: 189,
    specialties: ["Macro Play", "Lane Control", "Jungle Pathing"],
    online: true,
  },
  {
    id: 3,
    name: "NeonStrike",
    avatar: "⚡",
    game: "CS2",
    gameIcon: "🔫",
    rank: "Global Elite",
    experience: "6 years",
    languages: ["English", "Russian"],
    hourlyRate: 40,
    rating: 4.97,
    reviews: 312,
    specialties: ["Crosshair Placement", "Economy", "Utility Usage"],
    online: false,
  },
  {
    id: 4,
    name: "IceVenom",
    avatar: "❄️",
    game: "Overwatch 2",
    gameIcon: "🛡️",
    rank: "Champion",
    experience: "4 years",
    languages: ["English", "French"],
    hourlyRate: 30,
    rating: 4.92,
    reviews: 156,
    specialties: ["Hero Picks", "Team Coordination", "Ultimate Usage"],
    online: true,
  },
];

const packages = [
  {
    name: "Single Session",
    hours: 1,
    discount: 0,
    icon: "🎓",
    description: "Perfect for a quick review and tips.",
  },
  {
    name: "Starter Pack",
    hours: 5,
    discount: 10,
    icon: "📚",
    description: "5 sessions to build solid foundations.",
    popular: true,
  },
  {
    name: "Pro Bundle",
    hours: 10,
    discount: 20,
    icon: "🏆",
    description: "Intensive coaching for serious improvement.",
  },
];

export default function CoachingContent() {
  const [selectedCoach, setSelectedCoach] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Professional{" "}
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Coaching
          </span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Learn from the best. Our coaches are top-ranked players with years of
          competitive experience ready to elevate your gameplay.
        </p>
      </motion.div>

      {/* Coaching Packages */}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        {packages.map((pkg, i) => (
          <motion.button
            key={pkg.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedPackage(i)}
            className={`glass-card p-6 text-left relative transition-all ${
              selectedPackage === i
                ? "neon-glow border-neon-blue/50"
                : "glass-card-hover"
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue text-[10px] font-bold">
                MOST POPULAR
              </div>
            )}
            <span className="text-3xl">{pkg.icon}</span>
            <h3 className="text-lg font-bold text-white mt-3 mb-1">
              {pkg.name}
            </h3>
            <p className="text-sm text-slate-400 mb-3">{pkg.description}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">
                {pkg.hours} hr{pkg.hours > 1 ? "s" : ""}
              </span>
              {pkg.discount > 0 && (
                <span className="text-xs text-neon-green ml-2">
                  Save {pkg.discount}%
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Coaches Grid */}
      <h2 className="text-2xl font-bold text-white mb-8">
        Available Coaches
      </h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {coaches.map((coach, i) => {
          const pkg = packages[selectedPackage];
          const totalPrice =
            coach.hourlyRate *
            pkg.hours *
            (1 - pkg.discount / 100);

          return (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-6 transition-all cursor-pointer ${
                selectedCoach === coach.id
                  ? "neon-glow border-neon-blue/50"
                  : "glass-card-hover"
              }`}
              onClick={() =>
                setSelectedCoach(
                  selectedCoach === coach.id ? null : coach.id
                )
              }
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center text-3xl border border-white/10">
                  {coach.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-lg">
                      {coach.name}
                    </h3>
                    {coach.online && (
                      <span className="flex items-center gap-1 text-[10px] text-neon-green">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                        Online
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>{coach.gameIcon}</span>
                    <span>{coach.game}</span>
                    <span className="text-neon-blue font-semibold">
                      {coach.rank}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    ${totalPrice.toFixed(0)}
                  </div>
                  <div className="text-xs text-slate-400">
                    for {pkg.hours}hr{pkg.hours > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {coach.specialties.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] text-slate-400"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex text-gold">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg
                        key={j}
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white font-semibold">
                    {coach.rating}
                  </span>
                  <span className="text-slate-500">
                    ({coach.reviews} reviews)
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {coach.experience} exp
                </span>
              </div>

              {selectedCoach === coach.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-4 pt-4 border-t border-white/5"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <span>🗣️ Languages: {coach.languages.join(", ")}</span>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:opacity-90 transition-opacity">
                    Book {pkg.name} — ${totalPrice.toFixed(0)}
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
