"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { subscribeUsers, subscribeProducts } from "@/lib/store";
import type { AppUser, Product } from "@/lib/types";

export default function TopBoosters() {
  const [sellers, setSellers] = useState<AppUser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubUsers = subscribeUsers((users) => {
      setSellers(
        users
          .filter((u) => u.isSeller && !u.banned)
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 6)
      );
    });
    const unsubProducts = subscribeProducts((ps) => setProducts(ps));
    return () => {
      unsubUsers();
      unsubProducts();
    };
  }, []);

  const activeCount = (uid: string) =>
    products.filter(
      (p) => p.sellerId === uid && p.status === "active" && !p.sellerBanned
    ).length;

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Sellers
            </span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Real verified sellers listing accounts right now on the marketplace.
          </p>
        </motion.div>

        {sellers.length === 0 ? (
          <div className="text-center py-10 text-slate-400 glass-card">
            No sellers yet. Be the first to sell an account!
            <div className="mt-4">
              <Link
                href="/sell"
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-semibold"
              >
                Start Selling
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller, i) => (
              <motion.div
                key={seller.uid}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card glass-card-hover p-6 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center text-2xl border border-white/10">
                    {seller.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">
                      {seller.nickname}
                    </h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/15 text-gold font-semibold">
                      Verified Seller
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-sm font-bold text-gold">
                      {activeCount(seller.uid)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Active Listings
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-sm font-bold text-white">✓</div>
                    <div className="text-[10px] text-slate-500">Trusted</div>
                  </div>
                </div>

                <Link
                  href="/marketplace"
                  className="block w-full py-2.5 rounded-xl border border-gold/30 text-gold text-sm font-medium hover:bg-gold/10 transition-colors text-center group-hover:border-gold/60"
                >
                  View Their Listings
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
