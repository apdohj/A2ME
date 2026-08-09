"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: "🎯",
    title: "Choose Your Rank",
    description:
      "Select your current rank and desired rank. Customize with extra options like VPN, Duo Queue, or Express delivery.",
    color: "from-neon-blue to-cyan-400",
  },
  {
    number: "02",
    icon: "💳",
    title: "Secure Checkout",
    description:
      "Pay through your preferred method. Our system instantly assigns the best available booster for your order.",
    color: "from-neon-purple to-pink-400",
  },
  {
    number: "03",
    icon: "📊",
    title: "Track Progress Live",
    description:
      "Chat with your booster and watch your rank climb in real-time from your personal dashboard.",
    color: "from-neon-green to-emerald-400",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Three simple steps to reach your dream rank. No complicated process,
            just results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card glass-card-hover p-8 text-center group relative overflow-hidden"
            >
              {/* Background number */}
              <div className="absolute top-4 right-4 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.06] transition-colors">
                {step.number}
              </div>

              <div className="text-4xl mb-6">{step.icon}</div>

              <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.description}
              </p>

              {/* Bottom accent line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
