"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDevicePreview,
  DEVICES,
  DeviceIcon,
} from "@/lib/device-preview-context";

export default function DeviceSwitcher({
  variant = "icon",
}: {
  variant?: "icon" | "menu";
}) {
  const { device, setDevice } = useDevicePreview();
  const [open, setOpen] = useState(false);
  const current = DEVICES.find((d) => d.key === device) ?? DEVICES[0];

  if (variant === "menu") {
    return (
      <div>
        <div className="flex items-center gap-2 px-1 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Preview view
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              onClick={() => setDevice(d.key)}
              className={`flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-xl text-[11px] font-semibold transition-all ${
                device === d.key
                  ? "bg-gold/20 border border-gold/50 text-gold"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              <DeviceIcon type={d.key} />
              {d.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        title={`Preview view: ${current.label}`}
        className="px-2.5 py-1.5 rounded-xl border border-white/15 text-slate-200 hover:bg-white/5 hover:border-gold/40 transition-colors flex items-center gap-1.5"
      >
        <DeviceIcon type={current.key} />
        <svg
          className={`w-3 h-3 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 p-1 min-w-[160px] rounded-xl bg-[#0c0c0c] border border-white/10 shadow-2xl shadow-black/70"
          >
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-white/10 mb-1">
              Preview view
            </div>
            {DEVICES.map((d) => (
              <button
                key={d.key}
                onClick={() => {
                  setDevice(d.key);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  device === d.key
                    ? "bg-gold/15 text-gold"
                    : "text-slate-200 hover:bg-white/5"
                }`}
              >
                <DeviceIcon type={d.key} />
                <span className="font-medium">{d.label}</span>
                {device === d.key && <span className="ml-auto text-gold">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
