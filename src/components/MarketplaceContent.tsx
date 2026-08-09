"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { subscribeProducts, getOrCreateConversation } from "@/lib/store";
import { games } from "@/lib/gameData";
import { GameLogoById } from "@/components/GameLogo";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { useCatalog } from "@/lib/catalog-context";
import { matchesDetails, type FilterField } from "@/lib/filterCatalog";
import type { Product } from "@/lib/types";

const gameFilters = ["All", ...games.map((game) => game.name), "Other"];
const regionFilters = ["All", "EU", "NA", "ASIA", "ME"];

export default function MarketplaceContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [gameFilter, setGameFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [sortBy, setSortBy] = useState("price-asc");
  const [loading, setLoading] = useState(true);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [fieldMaxes, setFieldMaxes] = useState<Record<string, string>>({});
  const { user, profile } = useAuth();
  const { format } = useCurrency();
  const { getCatalogFields } = useCatalog();
  const router = useRouter();

  useEffect(() => {
    const unsub = subscribeProducts((all) => {
      setProducts(all);
      setLoading(false);
    });
    return unsub;
  }, []);

  const activeFields =
    gameFilter === "All"
      ? []
      : getCatalogFields(gameFilter === "Other" ? "Other" : gameFilter);

  const selectGame = (g: string) => {
    setGameFilter(g);
    setFieldValues({});
    setFieldMaxes({});
  };

  const visible = products
    .filter((p) => p.status === "active" && !p.sellerBanned)
    .filter((p) => gameFilter === "All" || p.game === gameFilter)
    .filter((p) => regionFilter === "All" || p.region === regionFilter)
    .filter((p) => {
      for (const f of activeFields) {
        if (f.type === "range") {
          if (!matchesDetails(p.details, f, fieldValues[f.id], fieldMaxes[f.id]))
            return false;
        } else if (!matchesDetails(p.details, f, fieldValues[f.id])) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) =>
      sortBy === "price-asc" ? a.price - b.price : b.price - a.price
    );

  const setField = (id: string, value: string) =>
    setFieldValues((v) => ({ ...v, [id]: value }));

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
                  onClick={() => selectGame(g)}
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

        {/* Dynamic per-game fields */}
        {activeFields.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-xs text-slate-400 mb-3">
              Refine by <span className="text-gold">{gameFilter}</span> account details
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeFields.map((f) => (
                <FilterControl
                  key={f.id}
                  field={f}
                  value={fieldValues[f.id] ?? ""}
                  max={fieldMaxes[f.id] ?? ""}
                  onChange={setField}
                  onMaxChange={(v) =>
                    setFieldMaxes((m) => ({ ...m, [f.id]: v }))
                  }
                />
              ))}
            </div>
            {(Object.keys(fieldValues).some((k) => fieldValues[k]) ||
              Object.keys(fieldMaxes).some((k) => fieldMaxes[k])) && (
              <button
                onClick={() => {
                  setFieldValues({});
                  setFieldMaxes({});
                }}
                className="mt-4 text-xs text-slate-400 hover:text-gold transition-colors"
              >
                ✕ Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-4xl mb-4">🔍</div>
          <p>No accounts match these filters. Try widening your search.</p>
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
                {product.details && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {Object.entries(product.details)
                      .filter(([, v]) => v && v !== "No")
                      .slice(0, 4)
                      .map(([k, v]) => (
                        <span
                          key={k}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300"
                        >
                          {v}
                        </span>
                      ))}
                  </div>
                )}
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

/* ---------------- Dynamic filter control ---------------- */

function FilterControl({
  field,
  value,
  max,
  onChange,
  onMaxChange,
}: {
  field: FilterField;
  value: string;
  max: string;
  onChange: (id: string, value: string) => void;
  onMaxChange: (value: string) => void;
}) {
  const inputCls =
    "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-gold/60 transition-colors";

  switch (field.type) {
    case "select":
      return (
        <div>
          <label className="text-[11px] text-slate-400 mb-1 block">
            {field.label}
          </label>
          <select
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={inputCls}
          >
            <option value="Any" className="bg-charcoal">Any</option>
            {field.options?.map((o) => (
              <option key={o} value={o} className="bg-charcoal">
                {o}
              </option>
            ))}
          </select>
        </div>
      );
    case "number":
      return (
        <div>
          <label className="text-[11px] text-slate-400 mb-1 block">
            {field.label}
          </label>
          <select
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={inputCls}
          >
            <option value="Any" className="bg-charcoal">Any</option>
            {field.options?.map((o) => (
              <option key={o} value={o} className="bg-charcoal">
                {o}
              </option>
            ))}
          </select>
        </div>
      );
    case "range":
      return (
        <div>
          <label className="text-[11px] text-slate-400 mb-1 block">
            {field.label}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={value}
              onChange={(e) => onChange(field.id, e.target.value)}
              placeholder="Min"
              className={inputCls}
            />
            <span className="text-slate-500 text-xs">–</span>
            <input
              type="number"
              value={max}
              onChange={(e) => onMaxChange(e.target.value)}
              placeholder="Max"
              className={inputCls}
            />
          </div>
        </div>
      );
    case "multi":
      return (
        <div className="lg:col-span-2 xl:col-span-2">
          <label className="text-[11px] text-slate-400 mb-1 block">
            {field.label}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {field.options?.map((o) => {
              const selected = value.split(",").includes(o);
              return (
                <button
                  key={o}
                  onClick={() => {
                    const cur = value ? value.split(",") : [];
                    const next = selected
                      ? cur.filter((x) => x !== o)
                      : [...cur, o];
                    onChange(field.id, next.join(","));
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    selected
                      ? "bg-gold/20 border border-gold/50 text-white"
                      : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      );
    case "toggle":
      return (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <span className="text-[11px] text-slate-300">{field.label}</span>
          <input
            type="checkbox"
            checked={value === "on"}
            onChange={(e) => onChange(field.id, e.target.checked ? "on" : "")}
            className="w-4 h-4 accent-gold"
          />
        </div>
      );
    case "text":
      return (
        <div>
          <label className="text-[11px] text-slate-400 mb-1 block">
            {field.label}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={inputCls}
          />
        </div>
      );
    default:
      return null;
  }
}
