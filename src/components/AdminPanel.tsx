"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  subscribeUsers,
  subscribeProducts,
  setUserProfile,
  hideProductsBySeller,
  restoreProductsBySeller,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  uploadImage,
  saveSettings,
  saveGameLogos,
  adjustWallet,
} from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { useSettings } from "@/lib/settings-context";
import { games } from "@/lib/gameData";
import { GameLogo } from "@/components/GameLogo";
import type { AppUser, Product, Currency } from "@/lib/types";

type Tab = "users" | "products" | "games" | "settings";

export default function AdminPanel() {
  const { user: me } = useAuth();
  const { settings } = useSettings();
  const [tab, setTab] = useState<Tab>("users");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">
            Full control over users, sellers, products and the whole site.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to site
        </Link>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {(
          [
            { key: "users" as const, label: "👥 Users & Sellers" },
            { key: "products" as const, label: "🛒 Products" },
            { key: "games" as const, label: "🎮 Game Logos" },
            { key: "settings" as const, label: "⚙️ Site Settings" },
          ]
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.key
                ? "bg-gold/20 border border-gold/50 text-white"
                : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && <UsersTab me={me?.uid ?? ""} />}
      {tab === "products" && <ProductsTab />}
      {tab === "games" && <GamesTab gameLogos={settings.gameLogos} />}
      {tab === "settings" && (
        <SettingsTab
          key={settings.siteName + settings.colors.primary + settings.logoUrl}
          settings={settings}
        />
      )}
    </div>
  );
}

/* ---------------- Users Tab ---------------- */

function UsersTab({ me }: { me: string }) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [walletCurrency, setWalletCurrency] = useState<Currency>("USD");
  const [walletAmount, setWalletAmount] = useState("1");

  useEffect(() => {
    const unsub = subscribeUsers((u) => setUsers(u));
    return unsub;
  }, []);

  const act = async (uid: string, patch: Partial<AppUser>, extra?: () => Promise<void>) => {
    setBusy(uid);
    await setUserProfile(uid, patch);
    await extra?.();
    setBusy(null);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/10 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400">Wallet adjustment:</span>
        <select value={walletCurrency} onChange={(e) => setWalletCurrency(e.target.value as Currency)} className="px-2 py-1 rounded bg-white/5 text-xs text-white">
          {(["EGP", "USD", "EUR", "KWD", "SAR"] as Currency[]).map((currency) => <option key={currency}>{currency}</option>)}
        </select>
        <input value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} type="number" min="0.01" step="0.01" className="w-20 px-2 py-1 rounded bg-white/5 text-xs text-white" />
        <span className="text-[11px] text-slate-500">Use + or - beside each customer.</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-slate-400">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Seller</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isMe = u.uid === me;
              return (
                <tr key={u.uid} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{u.nickname}</div>
                    {isMe && (
                      <span className="text-[10px] text-gold">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        u.role === "admin"
                          ? "bg-red-500/15 text-red-400"
                          : u.role === "booster"
                            ? "bg-gold/15 text-gold"
                            : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {u.isSeller ? "✅" : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        u.banned
                          ? "bg-red-500/15 text-red-400"
                          : "bg-green-500/15 text-green-400"
                      }`}
                    >
                      {u.banned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {busy === u.uid && (
                        <span className="text-[11px] text-slate-500">...</span>
                      )}
                      <button onClick={() => act(u.uid, {}, () => adjustWallet(u.uid, walletCurrency, Number(walletAmount)))} className="px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-semibold">+ Wallet</button>
                      <button onClick={() => act(u.uid, {}, () => adjustWallet(u.uid, walletCurrency, -Number(walletAmount)))} className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-semibold">- Wallet</button>
                      {!u.isSeller && (
                        <button
                          onClick={() => act(u.uid, { isSeller: true })}
                          className="px-2 py-1 rounded-lg bg-gold/10 border border-gold/40 text-gold text-[11px] font-semibold hover:bg-gold/20 transition-colors"
                        >
                          Make Seller
                        </button>
                      )}
                      {u.sellerPaymentStatus === "pending" && (
                        <button
                          onClick={() =>
                            act(u.uid, {
                              isSeller: true,
                              sellerPaymentStatus: "paid",
                            })
                          }
                          className="px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-semibold hover:bg-green-500/20 transition-colors"
                        >
                          Verify $1 seller payment
                        </button>
                      )}
                      {u.isSeller && !u.banned && (
                        <button
                          onClick={() => act(u.uid, { isSeller: false })}
                          className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-slate-300 text-[11px] font-semibold hover:bg-white/20 transition-colors"
                        >
                          Remove Seller
                        </button>
                      )}
                      {u.role !== "admin" && (
                        <button
                          onClick={() => act(u.uid, { role: "admin" })}
                          className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-semibold hover:bg-red-500/20 transition-colors"
                        >
                          Make Admin
                        </button>
                      )}
                      {u.role === "admin" && !isMe && (
                        <button
                          onClick={() => act(u.uid, { role: "client" })}
                          className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-slate-300 text-[11px] font-semibold hover:bg-white/20 transition-colors"
                        >
                          Remove Admin
                        </button>
                      )}
                      {!u.banned ? (
                        <button
                          onClick={() =>
                            act(
                              u.uid,
                              { banned: true, isSeller: false },
                              () => hideProductsBySeller(u.uid)
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-semibold hover:bg-red-500/20 transition-colors"
                        >
                          Ban
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            act(
                              u.uid,
                              { banned: false },
                              () => restoreProductsBySeller(u.uid)
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-semibold hover:bg-green-500/20 transition-colors"
                        >
                          Unban
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Products Tab ---------------- */

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeProducts((p) => setProducts(p));
    return unsub;
  }, []);

  const act = async (id: string, fn: () => Promise<void>) => {
    setBusy(id);
    await fn();
    setBusy(null);
  };

  const clearProducts = async () => {
    if (!window.confirm("Delete every product from the marketplace?")) return;
    setBusy("all");
    await deleteAllProducts();
    setBusy(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={clearProducts}
          disabled={busy === "all" || products.length === 0}
          className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold disabled:opacity-40"
        >
          {busy === "all" ? "Deleting..." : "Delete all products"}
        </button>
      </div>
      {products.length === 0 && (
        <div className="glass-card p-10 text-center text-slate-400">
          No products in the database yet.
        </div>
      )}
      {products.map((p) => (
        <div key={p.id} className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-14 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
            {p.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>🎮</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white truncate">{p.title}</div>
            <div className="text-xs text-slate-400">
              Seller: <span className="text-slate-300">{p.sellerName}</span> ·{" "}
              {p.game} · {p.rank} · ${p.price} · {p.region}
            </div>
            <div className="text-[11px] mt-1">
              <span
                className={`px-2 py-0.5 rounded-full font-semibold ${
                  p.status === "active"
                    ? "bg-green-500/15 text-green-400"
                    : p.status === "sold"
                      ? "bg-sky-500/15 text-sky-400"
                      : "bg-red-500/15 text-red-400"
                }`}
              >
                {p.status}
              </span>
              {p.sellerBanned && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold">
                  seller banned
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {busy === p.id && <span className="text-xs text-slate-500">...</span>}
            {p.status !== "active" && (
              <button
                onClick={() => act(p.id, () => updateProduct(p.id, { status: "active", sellerBanned: false }))}
                className="px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/40 text-gold text-xs font-semibold hover:bg-gold/20 transition-colors"
              >
                Activate
              </button>
            )}
            {p.status === "active" && (
              <button
                onClick={() => act(p.id, () => updateProduct(p.id, { status: "hidden" }))}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-slate-300 text-xs font-semibold hover:bg-white/20 transition-colors"
              >
                Hide
              </button>
            )}
            <button
              onClick={() => act(p.id, () => updateProduct(p.id, { status: "sold" }))}
              className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold hover:bg-sky-500/20 transition-colors"
            >
              Mark Sold
            </button>
            <button
              onClick={() => act(p.id, () => deleteProduct(p.id))}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Game Logos Tab ---------------- */

function GamesTab({
  gameLogos,
}: {
  gameLogos: Record<string, string> | undefined;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<Record<string, string>>({});

  const upload = async (gameId: string, file: File) => {
    setBusy(gameId);
    setMsg({});
    try {
      const url = await uploadImage(file);
      await saveGameLogos({ ...(gameLogos ?? {}), [gameId]: url });
      setMsg({ [gameId]: "✅ Logo updated — appears site-wide instantly." });
    } catch (error) {
      const code = (error as { code?: string; message?: string })?.code ?? (error as { message?: string })?.message ?? "unknown";
      setMsg({ [gameId]: `❌ Upload failed (${code}).` });
    } finally {
      setBusy(null);
    }
  };

  const reset = async (gameId: string) => {
    setBusy(gameId);
    setMsg({});
    try {
      const next = { ...(gameLogos ?? {}) };
      delete next[gameId];
      await saveGameLogos(next);
      setMsg({ [gameId]: "✅ Reset to default logo." });
    } catch (error) {
      const code = (error as { code?: string; message?: string })?.code ?? (error as { message?: string })?.message ?? "unknown";
      setMsg({ [gameId]: `❌ Reset failed (${code}).` });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="glass-card p-5 mb-6 text-sm text-slate-300">
        Upload a logo for each game. Uploaded logos appear everywhere the game
        icon shows: the header <span className="text-gold">Games</span> menu,
        the home calculator, the boost page and the marketplace. Games without
        an upload keep their default logo.
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {games.map((g) => {
          const uploaded = gameLogos?.[g.id];
          return (
            <div key={g.id} className="glass-card p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  <GameLogo game={g} className="h-6 w-auto max-w-14" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    {g.name}
                  </div>
                  <div
                    className={`text-[11px] ${
                      uploaded ? "text-gold" : "text-slate-500"
                    }`}
                  >
                    {uploaded ? "Custom logo ✓" : "Default logo"}
                  </div>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                disabled={busy === g.id}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(g.id, f);
                  e.target.value = "";
                }}
                className="w-full text-xs text-slate-300 file:mr-2 file:px-2 file:py-1 file:rounded-md file:border-0 file:bg-gold/20 file:text-gold file:text-[11px] file:font-semibold disabled:opacity-50"
              />
              {uploaded && (
                <button
                  onClick={() => reset(g.id)}
                  disabled={busy === g.id}
                  className="text-[11px] text-red-400 hover:underline text-left disabled:opacity-50"
                >
                  Reset to default
                </button>
              )}
              {busy === g.id && (
                <span className="text-[11px] text-slate-400">Saving...</span>
              )}
              {msg[g.id] && (
                <span className="text-[11px] text-slate-300">{msg[g.id]}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Settings Tab ---------------- */

function SettingsTab({ settings }: { settings: ReturnType<typeof useSettings>["settings"] }) {
  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [primary, setPrimary] = useState(settings.colors.primary);
  const [secondary, setSecondary] = useState(settings.colors.secondary);
  const [background, setBackground] = useState(settings.colors.background);
  const [texts, setTexts] = useState(settings.texts);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);

  const onLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
    } catch (error) {
      const code = (error as { code?: string; message?: string })?.code ?? (error as { message?: string })?.message ?? "unknown";
      setMsg(`Logo upload failed (${code}). Check Firebase Storage rules and configuration.`);
    } finally {
      setLogoUploading(false);
    }
  };

  const save = async () => {
    setBusy(true);
    setMsg("");
    try {
      await saveSettings({
        siteName: siteName.trim() || "A2ME",
        tagline,
        logoUrl,
        colors: { primary, secondary, background, text: "#f5f5f5" },
        texts,
      });
      setMsg("✅ Settings saved. The site updates immediately.");
    } catch (error) {
      const code = (error as { code?: string; message?: string })?.code ?? (error as { message?: string })?.message ?? "unknown";
      setMsg(`Save failed (${code}). Check Firebase Firestore rules and configuration.`);
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h3 className="font-bold text-white mb-4">Branding</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Site Name</label>
              <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Tagline</label>
              <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">
                Logo ({logoUrl ? "uploaded ✓" : "default"})
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onLogoUpload}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-gold/20 file:text-gold file:text-xs file:font-semibold"
              />
              {logoUploading && (
                <div className="text-xs text-slate-400 mt-1">Uploading...</div>
              )}
              {logoUrl && (
                <button
                  onClick={() => setLogoUrl("")}
                  className="text-xs text-red-400 mt-2 hover:underline"
                >
                  Remove uploaded logo (use default)
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold text-white mb-4">Colors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Main Gold</label>
              <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="w-full h-10 rounded-xl bg-white/5 border border-white/10" />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Dark Gold</label>
              <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="w-full h-10 rounded-xl bg-white/5 border border-white/10" />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Background</label>
              <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="w-full h-10 rounded-xl bg-white/5 border border-white/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold text-white mb-4">Site Texts</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Hero Badge</label>
            <input value={texts.heroBadge} onChange={(e) => setTexts({ ...texts, heroBadge: e.target.value })} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Hero Title</label>
              <input value={texts.heroTitle} onChange={(e) => setTexts({ ...texts, heroTitle: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Hero Highlight</label>
              <input value={texts.heroHighlight} onChange={(e) => setTexts({ ...texts, heroHighlight: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Hero Title 2</label>
              <input value={texts.heroTitle2} onChange={(e) => setTexts({ ...texts, heroTitle2: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Sell Button</label>
              <input value={texts.sellButton} onChange={(e) => setTexts({ ...texts, sellButton: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Hero Subtitle</label>
            <textarea value={texts.heroSubtitle} onChange={(e) => setTexts({ ...texts, heroSubtitle: e.target.value })} rows={3} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Sell Section Title</label>
            <input value={texts.sellTitle} onChange={(e) => setTexts({ ...texts, sellTitle: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Sell Section Subtitle</label>
            <textarea value={texts.sellSubtitle} onChange={(e) => setTexts({ ...texts, sellSubtitle: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
          </div>

          {msg && (
            <div className="text-sm text-slate-300 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              {msg}
            </div>
          )}

          <button
            onClick={save}
            disabled={busy}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {busy ? "Saving..." : "Save Site Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
