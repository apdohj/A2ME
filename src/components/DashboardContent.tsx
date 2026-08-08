"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import WalletPanel from "@/components/WalletPanel";

export default function DashboardContent() {
  const { user, profile, banned, logout, updateNickname } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveNickname = async () => {
    if (!nickname.trim()) return;
    setSaving(true);
    await updateNickname(nickname.trim());
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (banned) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="glass-card p-12">
          <div className="text-5xl mb-6">🚫</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Account Banned
          </h2>
          <p className="text-slate-400 mb-8">
            Your account has been banned. If you think this is a mistake,
            please contact the site admin.
          </p>
          <button
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-semibold"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Welcome, {profile?.nickname || "Player"}! 👋
        </h1>
        <p className="text-slate-400">
          Manage your account, nickname and seller status.
        </p>
      </motion.div>

      <WalletPanel />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-white mb-4">Account</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Email</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Nickname</span>
              <span className="text-white">{profile?.nickname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Role</span>
              <span className="text-gold font-semibold">{profile?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Seller Status</span>
              <span className="text-white">
                {profile?.isSeller ? "✅ Active seller" : "Not a seller"}
              </span>
            </div>
            {profile?.createdAt && (
              <div className="flex justify-between">
                <span className="text-slate-400">Member Since</span>
                <span className="text-white">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/sell"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black text-center font-bold hover:opacity-90 transition-opacity"
            >
              💰 {profile?.isSeller ? "Seller Dashboard" : "Become a Seller"}
            </Link>
            <Link
              href="/messages"
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center font-semibold hover:bg-white/10 transition-colors"
            >
              💬 Messages
            </Link>
            <Link
              href="/marketplace"
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center font-semibold hover:bg-white/10 transition-colors"
            >
              🛒 Marketplace
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Nickname */}
        <div className="glass-card p-6 h-fit">
          <h3 className="font-bold text-white mb-4">Edit Nickname</h3>
          <p className="text-xs text-slate-400 mb-4">
            Your nickname is what sellers and buyers see. You can change it
            anytime.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors"
            />
            <button
              onClick={saveNickname}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "..." : "Save"}
            </button>
          </div>
          {saved && (
            <div className="text-xs text-green-400 mt-3">
              ✅ Nickname updated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
