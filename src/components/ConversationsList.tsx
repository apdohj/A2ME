"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { subscribeConversations } from "@/lib/store";
import type { Conversation } from "@/lib/types";

export default function ConversationsList() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeConversations(user.uid, (convs) => {
      setConversations(convs);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const otherName = (conv: Conversation) => {
    const otherId = conv.participants.find((p) => p !== user?.uid);
    return otherId ? conv.names[otherId] ?? "User" : "User";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">Messages</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20 text-slate-400 glass-card">
          <div className="text-4xl mb-4">💬</div>
          <p>No conversations yet.</p>
          <p className="text-sm mt-2">
            Browse the marketplace and contact a seller to start chatting.
          </p>
          <Link
            href="/marketplace"
            className="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-semibold hover:opacity-90 transition-opacity"
          >
            Go to Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/messages/${conv.id}`}
              className="glass-card glass-card-hover p-4 flex items-center gap-4 block"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center text-xl border border-white/10 shrink-0">
                {otherName(conv).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">
                    {otherName(conv)}
                  </span>
                  {conv.lastTime > 0 && (
                    <span className="text-[11px] text-slate-500">
                      {new Date(conv.lastTime).toLocaleString()}
                    </span>
                  )}
                </div>
                {conv.productTitle && (
                  <div className="text-[11px] text-gold mb-1">
                    🎮 {conv.productTitle}
                  </div>
                )}
                <div className="text-sm text-slate-400 truncate">
                  {conv.lastMessage || "Start the conversation..."}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
