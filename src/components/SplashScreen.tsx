"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/lib/settings-context";

export default function SplashScreen() {
  const { settings } = useSettings();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2800);
    return () => clearTimeout(t);
  }, []);

  const name = settings.siteName || "A2ME";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian cursor-pointer overflow-hidden"
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.7 } }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          onClick={() => setShow(false)}
        >
          <div className="absolute inset-0 gradient-radial" />

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mb-8"
          >
            <motion.div
              className="absolute -inset-4 rounded-3xl bg-gold/20 blur-2xl"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.12, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home/header-logo.png"
              alt={name}
              className="relative w-64 sm:w-80 object-contain"
            />
          </motion.div>

          <div className="flex text-5xl sm:text-7xl font-black tracking-widest">
            {name.split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.45 + i * 0.14, duration: 0.6, ease: "backOut" }}
                className="inline-block bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent neon-text"
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-5 text-xs sm:text-sm text-slate-400 uppercase"
          >
            Level Up Your Game
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 1.4, ease: "easeInOut" }}
            className="mt-6 h-0.5 w-48 bg-gradient-to-r from-transparent via-gold to-transparent origin-center"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 2, duration: 0.8 }}
            className="absolute bottom-8 text-[11px] text-slate-500"
          >
            tap anywhere to skip
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
