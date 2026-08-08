"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { useAuth } from "@/lib/auth-context";

export default function SellCTA() {
  const { settings } = useSettings();
  const { user } = useAuth();
  const href = user ? "/sell" : "/login?next=%2Fsell";

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10 sm:p-16 text-center neon-glow relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue via-gold to-neon-purple" />
          <div className="text-5xl mb-6">💰</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {settings.texts.sellTitle}
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">
            {settings.texts.sellSubtitle}
          </p>
          <Link
            href={href}
            className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold text-lg hover:opacity-90 transition-opacity neon-glow"
          >
            {settings.texts.sellButton} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
