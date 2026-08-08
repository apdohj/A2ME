"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { setUserProfile } from "@/lib/store";
import { checkAdminPassword, setAdminAccess } from "@/lib/admin";

export default function AdminLoginModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, profile } = useAuth();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (checkAdminPassword(password)) {
      setAdminAccess(true);
      // Promote the logged-in user to admin so access persists.
      if (user) {
        await setUserProfile(user.uid, { role: "admin" });
      }
      onSuccess?.();
      onClose();
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong admin password.");
      setPassword("");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-8 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-xl font-bold text-white">Developer Mode</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the admin password to manage the site.
              </p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors"
                placeholder="Admin password"
              />
              {error && (
                <div className="text-xs text-red-400 text-center">{error}</div>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold hover:opacity-90 transition-opacity"
              >
                Enter Admin Panel
              </button>
            </form>
            {profile?.role === "admin" && (
              <div className="text-[11px] text-green-400 text-center mt-4">
                ✓ You are already an admin.
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
