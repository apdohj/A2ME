"use client";

import { motion } from "framer-motion";

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
          Learn from the best. Top-ranked players with years of competitive
          experience ready to elevate your gameplay.
        </p>
      </motion.div>

      {/* Coaching Packages */}
      <div className="grid sm:grid-cols-3 gap-6">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 text-left relative glass-card-hover"
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
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-slate-500 mt-10">
        🕒 Coaches and online booking will be available soon.
      </p>
    </div>
  );
}
