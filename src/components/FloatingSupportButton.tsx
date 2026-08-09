"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getOrCreateSupportConversation } from "@/lib/store";

export default function FloatingSupportButton() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const openSupport = async () => {
    if (busy) return;
    if (!user || !profile) {
      router.push("/login?next=/support");
      return;
    }
    setBusy(true);
    setError(false);
    try {
      const convId = await getOrCreateSupportConversation(profile);
      router.push(`/messages/${convId}`);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-[90] flex flex-col items-end gap-2">
      {error && (
        <div className="text-[11px] text-red-400 bg-black/90 border border-red-500/30 rounded-lg px-3 py-2 max-w-[220px] shadow-xl shadow-black/50">
          Support isn&apos;t available yet. Try again later.
        </div>
      )}
      <button
        onClick={openSupport}
        disabled={busy}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold text-sm shadow-lg shadow-black/50 hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {busy ? (
          <span className="w-4 h-4 rounded-full border-2 border-black/40 border-t-transparent animate-spin" />
        ) : (
          <span>💬</span>
        )}
        Support
      </button>
    </div>
  );
}
