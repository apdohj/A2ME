"use client";

import { motion } from "framer-motion";

const stats = [
  { icon: "🟢", value: "50,000+", label: "Orders Completed" },
  { icon: "⭐", value: "4.9/5", label: "Customer Rating" },
  { icon: "⚡", value: "15 min", label: "Avg. Start Time" },
  { icon: "🎮", value: "500+", label: "Active Boosters" },
  { icon: "🌍", value: "120+", label: "Countries Served" },
  { icon: "🔒", value: "100%", label: "Secure & Safe" },
];

export default function SocialProofBar() {
  return (
    <section className="relative py-8 overflow-hidden border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
