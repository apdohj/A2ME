"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getOrCreateSupportConversation } from "@/lib/store";

export default function SupportClient() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !profile) return;
    getOrCreateSupportConversation(profile)
      .then((convId) => router.replace(`/messages/${convId}`))
      .catch(() => setError("Support is not available yet. Please try again later."));
  }, [user, profile, router]);

  if (!user || !profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-6">💬</div>
        <h1 className="text-2xl font-bold text-white mb-3">Contact Support</h1>
        <p className="text-slate-400 mb-8">
          Sign in to start a private chat with our team.
        </p>
        <Link
          href="/login?next=/support"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-semibold hover:opacity-90 transition-opacity"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      {error ? (
        <>
          <div className="text-4xl mb-4">😕</div>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Opening your support chat...</p>
        </>
      )}
    </div>
  );
}
