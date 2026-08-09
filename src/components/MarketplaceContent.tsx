"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { subscribeProducts, getOrCreateConversation } from "@/lib/store";
import { games } from "@/lib/gameData";
import { GameLogoById } from "@/components/GameLogo";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import type { Product } from "@/lib/types";

const gameFilters = ["All", ...games.map((game) => game.name), "Other"];
const regionFilters = ["All", "EU", "NA", "ASIA", "ME"];

export default function MarketplaceContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [gameFilter, setGameFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [sortBy, setSortBy] = useState("price-asc");
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { format } = useCurrency();
  const router = useRouter();

  useEffect(() => {
    const unsub = subscribeProducts((all) => {
      setProducts(all);
      setLoading(false);
    });
    return unsub;
  }, []);

  const visible = products
    .filter((p) => p.status === "active" && !p.sellerBanned)
    .filter((p) => gameFilter === "All" || p.game === gameFilter)
    .filter((p) => regionFilter === "All" || p.region === regionFilter)
    .sort((a, b) =>
      sortBy === "price-asc" ? a.price - b.price : b.price - a.price
    );

  const contactSeller = async (product: Product) => {
    if (!user || !profile) {
      router.push(`/login?next=/marketplace`);
      return;
    }
    const sellerId = product.sellerId;
    const seller = { uid: sellerId, nickname: product.sellerName } as never;
    const convId = await getOrCreateConversation(
      { ...profile, uid: user.uid, nickname: profile.nickname },
      seller,
      product
    );
    router.push(`/messages/${convId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Account{" "}
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Marketplace
          </span>
        </h1>
        <p className="text-slate-400">
          Real accounts listed by verified sellers. Contact the seller directly to buy.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="glass-card p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-slate-400 mb-2 block">Game</label>
            <div className="flex flex-wrap gap-2">
              {gameFilters.map((g) => (
                <button
                  key={g}
                  onClick={() => setGameFilter(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    gameFilter === g
                      ? "bg-gold/20 border border-gold/50 text-white"
                      : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Region</label>
            <div className="flex gap-2">
              {regionFilters.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    regionFilter === r
                      ? "bg-gold/20 border border-gold/50 text-white"
                      : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-2 block">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 outline-none"
            >
              <option value="price-asc" className="bg-charcoal">Price: Low → High</option>
              <option value="price-desc" className="bg-charcoal">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-4xl mb-4">🔍</div>
          <p>No accounts listed yet. Be the first seller to add one!</p>
          <a
            href="/sell"
            className="inline-block mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-semibold hover:opacity-90 transition-opacity"
          >
            Sell Your Account
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visible.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card glass-card-hover overflow-hidden group relative flex flex-col"
            >
              <div className="aspect-video w-full bg-white/5 overflow-hidden flex items-center justify-center">
                {product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GameLogoById
                    name={product.game}
                    className="h-10 w-auto max-w-32 opacity-60"
                  />
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/15 text-gold font-semibold">
                    {product.game}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {product.region}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-1">{product.title}</h3>
                <div className="text-xs text-neon-blue font-semibold mb-3">
                  {product.rank}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xl font-black text-white">
                    {format(product.price, product.currency ?? "USD")}
                  </div>
                  <button
                    onClick={() => contactSeller(product)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    💬 Contact Seller
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
