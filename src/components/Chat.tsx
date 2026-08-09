"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getConversation, subscribeMessages, sendMessage } from "@/lib/store";
import type { Conversation, ChatMessage } from "@/lib/types";

export default function Chat({ convId }: { convId: string }) {
  const { user, profile } = useAuth();
  const [conv, setConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getConversation(convId)
      .then(setConv)
      .catch(() => setConv(null));
    const unsub = subscribeMessages(convId, (msgs) => {
      setMessages(msgs);
    });
    return unsub;
  }, [convId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const otherId = conv?.participants.find((p) => p !== user?.uid);
  const otherName = otherId ? conv?.names[otherId] ?? "User" : "User";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || sending) return;
    setSending(true);
    setError("");
    try {
      await sendMessage(convId, user.uid, text.trim());
      setText("");
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/messages" className="text-sm text-slate-400 hover:text-white transition-colors">
          ← Back
        </Link>
        <div className="flex-1 text-center">
          <div className="font-bold text-white">{otherName}</div>
          {conv?.productTitle && (
            <div className="text-xs text-gold">🎮 {conv.productTitle}</div>
          )}
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg) => {
            const mine = msg.from === user?.uid;
            return (
              <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    mine
                      ? "bg-gradient-to-r from-neon-blue to-neon-purple text-black rounded-br-sm"
                      : "bg-white/5 text-slate-300 rounded-bl-sm"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div className={`text-[10px] mt-1 ${mine ? "text-black/60" : "text-slate-500"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-gold/60 transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>

      <p className="text-xs text-slate-500 text-center mt-4">
        {conv?.productId === null
          ? "Support chat — the team will reply as soon as possible."
          : profile?.isSeller
            ? "You can also share account details securely here."
            : "Buyer chat — only you and the seller can see these messages."}
      </p>
    </div>
  );
}
