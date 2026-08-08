"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: "💰",
    title: "Competitive Pay",
    description: "Earn up to $3,000+/month with our industry-leading commission rates. Get paid weekly.",
  },
  {
    icon: "🕐",
    title: "Flexible Hours",
    description: "Work whenever you want. Accept orders on your own schedule with no minimum requirements.",
  },
  {
    icon: "🌍",
    title: "Work From Anywhere",
    description: "All you need is a stable internet connection. Boost from anywhere in the world.",
  },
  {
    icon: "📈",
    title: "Growth Opportunities",
    description: "Top performers get priority access to high-value orders and coaching positions.",
  },
];

const requirements = [
  "Minimum Diamond rank (or equivalent) in at least one supported game",
  "Stable internet connection with low ping",
  "Ability to use VPN for account security",
  "Professional attitude and good communication skills",
  "Must be 18 years or older",
  "Available for at least 20 hours per week",
];

export default function BoosterPortal() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    discord: "",
    game: "",
    rank: "",
    experience: "",
    hours: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-12 neon-purple-glow"
        >
          <div className="text-6xl mb-6">🎮</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Application Submitted!
          </h2>
          <p className="text-slate-400 mb-8">
            Thank you for your interest in joining A2ME! We&apos;ll review
            your application and get back to you within 24-48 hours via Discord
            or email.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-neon-purple mb-6">
          <span>🎮</span>
          Now Recruiting
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          Become a{" "}
          <span className="bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
            A2ME Booster
          </span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-lg">
          Turn your gaming skills into income. Join our elite team of
          professional boosters and coaches.
        </p>
      </motion.div>

      {/* Benefits */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {benefits.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card glass-card-hover p-6 text-center"
          >
            <div className="text-3xl mb-4">{benefit.icon}</div>
            <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
            <p className="text-sm text-slate-400">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Requirements */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Requirements</h2>
          <div className="space-y-3">
            {requirements.map((req, i) => (
              <div
                key={i}
                className="flex items-start gap-3 glass-card p-4"
              >
                <span className="text-neon-green mt-0.5">✓</span>
                <span className="text-sm text-slate-300">{req}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 glass-card p-6 neon-purple-glow">
            <h3 className="font-bold text-white mb-3">Booster Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Avg. Monthly Earnings", value: "$2,400" },
                { label: "Active Boosters", value: "500+" },
                { label: "Weekly Payouts", value: "Every Friday" },
                { label: "Commission Rate", value: "Up to 70%" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-bold text-neon-blue">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Apply Now</h2>
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-neon-purple/50 transition-colors"
                  placeholder="Your gaming username"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-neon-purple/50 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1 block">
                Discord Tag
              </label>
              <input
                type="text"
                required
                value={formData.discord}
                onChange={(e) =>
                  setFormData({ ...formData, discord: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-neon-purple/50 transition-colors"
                placeholder="username#1234"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Primary Game
                </label>
                <select
                  required
                  value={formData.game}
                  onChange={(e) =>
                    setFormData({ ...formData, game: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-neon-purple/50 transition-colors"
                >
                  <option value="" className="bg-charcoal">Select a game</option>
                  <option value="valorant" className="bg-charcoal">Valorant</option>
                  <option value="lol" className="bg-charcoal">League of Legends</option>
                  <option value="cs2" className="bg-charcoal">CS2</option>
                  <option value="overwatch" className="bg-charcoal">Overwatch 2</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Current Rank
                </label>
                <input
                  type="text"
                  required
                  value={formData.rank}
                  onChange={(e) =>
                    setFormData({ ...formData, rank: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-neon-purple/50 transition-colors"
                  placeholder="e.g., Immortal 3"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Boosting Experience
                </label>
                <select
                  required
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-neon-purple/50 transition-colors"
                >
                  <option value="" className="bg-charcoal">Select</option>
                  <option value="none" className="bg-charcoal">None - First time</option>
                  <option value="1year" className="bg-charcoal">Less than 1 year</option>
                  <option value="1-3years" className="bg-charcoal">1-3 years</option>
                  <option value="3+years" className="bg-charcoal">3+ years</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">
                  Weekly Availability
                </label>
                <select
                  required
                  value={formData.hours}
                  onChange={(e) =>
                    setFormData({ ...formData, hours: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-neon-purple/50 transition-colors"
                >
                  <option value="" className="bg-charcoal">Select</option>
                  <option value="20-30" className="bg-charcoal">20-30 hours</option>
                  <option value="30-40" className="bg-charcoal">30-40 hours</option>
                  <option value="40+" className="bg-charcoal">40+ hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1 block">
                Why should we pick you? (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-neon-purple/50 transition-colors resize-none"
                placeholder="Tell us about your experience, achievements..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Submit Application 🚀
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
