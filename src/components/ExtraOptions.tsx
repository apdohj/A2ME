"use client";

import { motion } from "framer-motion";

const options = [
  {
    icon: "🛡️",
    title: "VPN Protection",
    description:
      "Local VPN usage ensures your account stays safe. We match your login location to prevent suspicious activity flags.",
    tag: "+10%",
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    icon: "👥",
    title: "Duo Queue",
    description:
      "Play alongside the booster yourself! Improve your skills while climbing ranks together with a professional player.",
    tag: "+50%",
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    icon: "🎥",
    title: "Live Stream",
    description:
      "Watch the booster play on your account in real-time. Learn strategies and techniques from top-level gameplay.",
    tag: "+15%",
    gradient: "from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/30",
  },
  {
    icon: "⚡",
    title: "Express Delivery",
    description:
      "Get maximum priority for your order. Your boost will be started and completed as fast as humanly possible.",
    tag: "+30%",
    gradient: "from-yellow-500/20 to-amber-500/20",
    borderColor: "border-yellow-500/30",
  },
];

export default function ExtraOptions() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/[0.03] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Customize Your{" "}
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Add extra features to your boost for enhanced safety, speed, or a
            learning experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card glass-card-hover p-6 relative overflow-hidden group cursor-pointer`}
            >
              {/* Tag */}
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-neon-blue/10 text-neon-blue text-xs font-semibold">
                {opt.tag}
              </div>

              <div className="text-3xl mb-4">{opt.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{opt.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {opt.description}
              </p>

              {/* Hover gradient bg */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${opt.gradient} opacity-0 group-hover:opacity-100 transition-opacity -z-10`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
