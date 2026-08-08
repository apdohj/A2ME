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
  uploadImage,
  saveSettings,
} from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { useSettings } from "@/lib/settings-context";
import type { AppUser, Product } from "@/lib/types";

type Tab = "users" | "products" | "settings";

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
                      {!u.isSeller && (
                        <button
                          onClick={() => act(u.uid, { isSeller: true })}
                          className="px-2 py-1 rounded-lg bg-gold/10 border border-gold/40 text-gold text-[11px] font-semibold hover:bg-gold/20 transition-colors"
                        >
                          Make Seller
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

  return (
    <div className="space-y-3">
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
    } catch {
      setMsg("Logo upload failed. Check Firebase Storage is enabled.");
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
    } catch {
      setMsg("Failed to save. Check that Firestore is enabled in Firebase.");
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
