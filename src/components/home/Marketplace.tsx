"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, SlidersHorizontal, X, LayoutGrid, List, ChevronDown } from "lucide-react";
import { subscribeProducts, getOrCreateConversation } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { useSettings } from "@/lib/settings-context";
import { gameIdForName } from "@/lib/filterCatalog";
import type { Currency, Product } from "@/lib/types";import AccountCard, { type HomeAccount } from "./AccountCard";

const GAME_NAMES = [
  "VALORANT",
  "LEAGUE OF LEGENDS",
  "CS2",
  "OVERWATCH 2",
  "FORTNITE",
  "APEX LEGENDS",
  "PUBG",
  "WARZONE",
  "R6 SIEGE",
  "ROCKET LEAGUE",
  "EA FC",
  "DOTA 2",
  "OTHER",
];

const SHOWCASE: HomeAccount[] = [
  {
    id: "s-valorant",
    gameName: "VALORANT",
    gameLogo: "/home/games/valorant.png",
    rank: "Immortal 2",
    info: "Level 184 • 73 Skins • 6 Knives",
    meta: "EU • PC",
    priceLabel: "$129.99",
    priceNum: 129.99,
  },
  {
    id: "s-cs2",
    gameName: "CS2",
    gameLogo: "/home/games/cs2.png",
    rank: "Global Elite",
    info: "18,420 Rating • Knife • Gloves • 150+ Skins",
    meta: "EU • PC",
    priceLabel: "$249.99",
    priceNum: 249.99,
  },
  {
    id: "s-fortnite",
    gameName: "FORTNITE",
    gameLogo: "/home/games/fortnite.png",
    rank: "Unreal",
    info: "250+ Skins • OG Items",
    meta: "NA • PC",
    priceLabel: "$199.99",
    priceNum: 199.99,
  },
  {
    id: "s-apex",
    gameName: "APEX LEGENDS",
    gameLogo: "/home/games/apex.png",
    rank: "Master",
    info: "4 Heirlooms • 120 Skins",
    meta: "EU • PC",
    priceLabel: "$179.99",
    priceNum: 179.99,
    image: "/home/apex-product.png",
  },
];

function toHomeAccount(
  p: Product,
  format: (n: number, c?: Currency) => string,
  gameLogos: Record<string, string> | undefined
): HomeAccount {
  const gid = gameIdForName(p.game) ?? "other";
  const detailValues = Object.entries(p.details ?? {})
    .filter(([, v]) => v && v !== "No" && v !== "N/A")
    .map(([, v]) => String(v))
    .slice(0, 3);
  return {
    id: p.id,
    gameName: p.game.toUpperCase(),
    gameLogo: gameLogos?.[gid] || `/home/games/${gid}.png`,
    rank: p.rank && p.rank !== "N/A" ? p.rank : "Premium",
    info: detailValues.length ? detailValues.join(" • ") : p.title,
    meta: `${p.region} • PC`,
    priceLabel: format(p.price, p.currency ?? "USD"),
    priceNum: p.price,
    image: p.images?.[0],
    createdAt: p.createdAt ? p.createdAt : undefined,
    product: p,
  };
}

export default function Marketplace() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { format } = useCurrency();
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [gameFilter, setGameFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("newest");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeProducts((all) => setProducts(all));
    return unsub;
  }, []);

  const accounts = useMemo(() => {
    const all = products
      .filter((p) => p.status === "active" && !p.sellerBanned)
      .map((p) => toHomeAccount(p, format, settings.gameLogos));
    return all.length > 0 ? all : SHOWCASE;
  }, [products, format, settings.gameLogos]);

  const filtered = useMemo(() => {
    const list = accounts.filter((a) => {
      if (gameFilter !== "All" && a.gameName !== gameFilter) return false;
      if (a.priceNum > maxPrice) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sortBy === "price-asc") return a.priceNum - b.priceNum;
      if (sortBy === "price-desc") return b.priceNum - a.priceNum;
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });
  }, [accounts, gameFilter, maxPrice, sortBy]);

  const visible = filtered.slice(0, 8);

  const contactSeller = async (a: HomeAccount) => {
    if (!a.product) {
      router.push("/marketplace");
      return;
    }
    if (!user || !profile) {
      router.push(`/login?next=/marketplace`);
      return;
    }
    const seller = { uid: a.product.sellerId, nickname: a.product.sellerName } as never;
    const convId = await getOrCreateConversation(
      { ...profile, uid: user.uid, nickname: profile.nickname },
      seller,
      a.product
    );
    router.push(`/messages/${convId}`);
  };

  return (
    <section className="bg-a2-bg2 py-14" id="featured">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Star className="w-5 h-5 text-a2-gold fill-a2-gold" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white">
                Featured Accounts
              </h2>
            </div>
            <p className="text-sm text-a2-light/60">
              Hand-picked top accounts from trusted sellers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-a2-card border border-a2-border rounded-xl pl-3.5 pr-9 py-2.5 text-sm font-medium text-a2-light focus:border-a2-gold/60 outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-4 h-4 text-a2-light/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex items-center bg-a2-card border border-a2-border rounded-xl p-1">
              <button
                onClick={() => setLayout("grid")}
                aria-label="Grid view"
                className={`p-2 rounded-lg transition-colors ${
                  layout === "grid"
                    ? "bg-a2-gold text-black"
                    : "text-a2-light/60 hover:text-a2-gold"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout("list")}
                aria-label="List view"
                className={`p-2 rounded-lg transition-colors ${
                  layout === "list"
                    ? "bg-a2-gold text-black"
                    : "text-a2-light/60 hover:text-a2-gold"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="a2-card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-a2-gold" />
                  Refine Your Search
                </span>
                <button
                  onClick={() => {
                    setGameFilter("All");
                    setMaxPrice(1000);
                  }}
                  className="text-xs text-a2-light/50 hover:text-a2-gold transition-colors"
                >
                  Reset
                </button>
              </div>

              <label className="block text-xs font-semibold uppercase tracking-wider text-a2-light/60 mb-2">
                Game
              </label>
              <div className="relative mb-6">
                <select
                  value={gameFilter}
                  onChange={(e) => setGameFilter(e.target.value)}
                  className="w-full appearance-none bg-a2-bg2 border border-a2-border rounded-xl pl-3.5 pr-9 py-2.5 text-sm text-white focus:border-a2-gold/60 outline-none cursor-pointer"
                >
                  <option value="All">All Games</option>
                  {GAME_NAMES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-a2-light/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-a2-light/60">
                  Price Range
                </label>
                <span className="text-xs font-bold text-a2-gold">
                  $0 – ${maxPrice >= 1000 ? "1000+" : maxPrice}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#ffc928]"
              />
            </div>
          </aside>

          {/* Cards */}
          <div className="flex-1 min-w-0 w-full">
            {/* Mobile filters button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-a2-card border border-a2-border text-sm font-semibold text-a2-light"
              >
                <SlidersHorizontal className="w-4 h-4 text-a2-gold" />
                Filters
              </button>
            </div>

            {visible.length === 0 ? (
              <div className="a2-card p-10 text-center text-a2-light/60">
                No accounts match your filters. Try adjusting the search.
              </div>
            ) : (
              <div
                className={
                  layout === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
                    : "space-y-4"
                }
              >
                {visible.map((a) => (
                  <AccountCard
                    key={a.id}
                    account={a}
                    layout={layout}
                    onView={contactSeller}
                  />
                ))}
              </div>
            )}

            {filtered.length > 8 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push("/marketplace")}
                  className="px-6 py-3 rounded-xl bg-a2-gold text-black text-sm font-bold hover:bg-a2-gold-bright transition-colors a2-glow-soft"
                >
                  View All Accounts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-a2-bg2 border-l border-a2-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-a2-gold" />
                Refine Your Search
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close filters"
                className="p-2 rounded-lg text-a2-light/70 hover:text-a2-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  setGameFilter("All");
                  setMaxPrice(1000);
                }}
                className="text-xs text-a2-light/50 hover:text-a2-gold"
              >
                Reset
              </button>
            </div>

            <label className="block text-xs font-semibold uppercase tracking-wider text-a2-light/60 mb-2">
              Game
            </label>
            <div className="relative mb-6">
              <select
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
                className="w-full appearance-none bg-a2-card border border-a2-border rounded-xl pl-3.5 pr-9 py-2.5 text-sm text-white focus:border-a2-gold/60 outline-none cursor-pointer"
              >
                <option value="All">All Games</option>
                {GAME_NAMES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-a2-light/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-a2-light/60">
                Price Range
              </label>
              <span className="text-xs font-bold text-a2-gold">
                $0 – ${maxPrice >= 1000 ? "1000+" : maxPrice}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#ffc928]"
            />

            <button
              onClick={() => setSidebarOpen(false)}
              className="mt-6 w-full px-4 py-3 rounded-xl bg-a2-gold text-black text-sm font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
