"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
  id: number;
  game: string;
  gameIcon: string;
  currentRank: string;
  desiredRank: string;
  status: "in_progress" | "paused" | "completed" | "pending";
  progress: number;
  booster: string;
  price: number;
  eta: string;
  startDate: string;
}

const mockOrders: Order[] = [
  {
    id: 1042,
    game: "Valorant",
    gameIcon: "🎯",
    currentRank: "Gold 3",
    desiredRank: "Diamond 1",
    status: "in_progress",
    progress: 62,
    booster: "ShadowFury",
    price: 89.99,
    eta: "~2 days",
    startDate: "2026-01-10",
  },
  {
    id: 1038,
    game: "League of Legends",
    gameIcon: "⚔️",
    currentRank: "Silver 2",
    desiredRank: "Gold 4",
    status: "completed",
    progress: 100,
    booster: "PhantomAce",
    price: 45.0,
    eta: "Done",
    startDate: "2026-01-05",
  },
  {
    id: 1045,
    game: "CS2",
    gameIcon: "🔫",
    currentRank: "Gold Nova 3",
    desiredRank: "MG 2",
    status: "pending",
    progress: 0,
    booster: "—",
    price: 69.99,
    eta: "~3 days",
    startDate: "2026-01-12",
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "ShadowFury",
    content: "Just won 3 in a row! Moving fast 💪",
    time: "2 min ago",
    isBooster: true,
  },
  {
    id: 2,
    sender: "You",
    content: "Awesome! Keep it up!",
    time: "1 min ago",
    isBooster: false,
  },
  {
    id: 3,
    sender: "ShadowFury",
    content: "Now in Platinum 3, almost there!",
    time: "30 sec ago",
    isBooster: true,
  },
];

const statusColors: Record<string, string> = {
  in_progress: "text-neon-green",
  paused: "text-yellow-400",
  completed: "text-neon-blue",
  pending: "text-slate-400",
};

const statusLabels: Record<string, string> = {
  in_progress: "In Progress",
  paused: "Paused",
  completed: "Completed",
  pending: "Pending",
};

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState<"orders" | "chat" | "security">(
    "orders"
  );
  const [selectedOrder, setSelectedOrder] = useState<Order>(mockOrders[0]);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [isPaused, setIsPaused] = useState(false);

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "You",
        content: chatMessage,
        time: "Just now",
        isBooster: false,
      },
    ]);
    setChatMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Welcome back, Player! 👋
        </h1>
        <p className="text-slate-400">
          Track your orders, communicate with boosters, and manage your account.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Active Orders",
            value: "1",
            icon: "🔥",
            color: "text-neon-blue",
          },
          {
            label: "Completed",
            value: "12",
            icon: "✅",
            color: "text-neon-green",
          },
          {
            label: "Total Spent",
            value: "$847",
            icon: "💰",
            color: "text-gold",
          },
          {
            label: "Member Since",
            value: "2025",
            icon: "⭐",
            color: "text-neon-purple",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span>{stat.icon}</span>
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {(
          [
            { key: "orders" as const, label: "My Orders", icon: "📦" },
            { key: "chat" as const, label: "Live Chat", icon: "💬" },
            { key: "security" as const, label: "Security", icon: "🔐" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/50 text-white"
                : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {mockOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full glass-card p-5 text-left transition-all ${
                    selectedOrder.id === order.id
                      ? "border-neon-blue/50 bg-neon-blue/5"
                      : "glass-card-hover"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{order.gameIcon}</span>
                      <div>
                        <div className="text-sm font-bold text-white">
                          Order #{order.id}
                        </div>
                        <div className="text-xs text-slate-400">
                          {order.game}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold ${statusColors[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="text-slate-400">
                      {order.currentRank}
                    </span>
                    <span className="text-neon-blue">→</span>
                    <span className="text-white font-semibold">
                      {order.desiredRank}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
                      initial={{ width: 0 }}
                      animate={{ width: `${order.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1.5 text-right">
                    {order.progress}% complete
                  </div>
                </button>
              ))}
            </div>

            {/* Order Detail */}
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">
                Order #{selectedOrder.id}
              </h3>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Game", value: `${selectedOrder.gameIcon} ${selectedOrder.game}` },
                  { label: "From", value: selectedOrder.currentRank },
                  { label: "To", value: selectedOrder.desiredRank },
                  { label: "Booster", value: selectedOrder.booster },
                  { label: "Price", value: `$${selectedOrder.price}` },
                  { label: "ETA", value: selectedOrder.eta },
                  { label: "Started", value: selectedOrder.startDate },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-white font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {selectedOrder.status === "in_progress" && (
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    isPaused
                      ? "bg-neon-green/20 border border-neon-green/50 text-neon-green hover:bg-neon-green/30"
                      : "bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30"
                  }`}
                >
                  {isPaused ? "▶️ Resume Order" : "⏸️ Pause Order"}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center text-lg">
                🎭
              </div>
              <div>
                <div className="font-bold text-white">ShadowFury</div>
                <div className="flex items-center gap-1 text-xs text-neon-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                  Online — Order #1042
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBooster ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.isBooster
                        ? "bg-white/5 text-slate-300 rounded-bl-sm"
                        : "bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-br-sm"
                    }`}
                  >
                    <div>{msg.content}</div>
                    <div
                      className={`text-[10px] mt-1 ${msg.isBooster ? "text-slate-500" : "text-white/60"}`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-neon-blue/50 transition-colors"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🔐</span>
              <div>
                <h3 className="font-bold text-white text-lg">
                  Encrypted Credentials Vault
                </h3>
                <p className="text-xs text-slate-400">
                  Your data is encrypted end-to-end and auto-deleted after order
                  completion.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Game Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your game username"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Game Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your game password"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  2FA Backup Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter backup code if applicable"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-neon-green/5 border border-neon-green/20">
                <span>🔒</span>
                <div className="text-xs text-slate-400">
                  <strong className="text-white">AES-256 Encryption:</strong>{" "}
                  Your credentials are encrypted before storage and can only be
                  accessed by your assigned booster during the active order.
                  Data is permanently deleted upon completion.
                </div>
              </div>

              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:opacity-90 transition-opacity">
                Save Credentials Securely
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
