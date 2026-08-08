"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  subscribeProducts,
  createProduct,
  deleteProduct,
  setProductStatus,
  uploadImage,
} from "@/lib/store";
import { games, getAllDivisions } from "@/lib/gameData";
import type { AppUser, Product } from "@/lib/types";

export default function SellDashboard() {
  const { user, profile, requestSellerAccess, updateNickname } = useAuth();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentSent, setPaymentSent] = useState(false);

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile.isSeller) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="glass-card p-12 neon-glow">
          <div className="text-6xl mb-6">💰</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Become a Seller
          </h2>
          <p className="text-slate-400 mb-4">
            Activate your seller account once for $1, then list accounts and chat with buyers directly.
          </p>
          {profile.sellerPaymentStatus === "pending" || paymentSent ? (
            <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-gold">
              Payment submitted. An admin will verify it before seller access is enabled.
            </div>
          ) : (
            <button
              onClick={() => setPaymentOpen(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold hover:opacity-90 transition-opacity"
            >
              Activate Seller Account — $1
            </button>
          )}
        </div>
        {paymentOpen && (
          <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-6 text-left">
              <h3 className="text-xl font-bold text-white mb-2">Seller activation payment</h3>
              <p className="text-sm text-slate-400 mb-4">Pay $1 using any method below, then enter the transaction reference.</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-white p-2 flex items-center justify-center">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=apdoapdo5%40instapay" alt="InstaPay QR for apdoapdo5@instapay" className="w-full max-w-[180px]" />
                </div>
                <div className="rounded-xl border border-gold/30 bg-gold/5 p-3 text-xs text-slate-300 space-y-2">
                  <strong className="text-gold block">Payment methods</strong>
                  <div>InstaPay: <b>01229938115</b></div>
                  <div>Vodafone Cash: <b>01229938115</b></div>
                  <div>Orange Cash: <b>01229938115</b></div>
                  <div className="text-slate-500">InstaPay account: apdoapdo5@instapay</div>
                </div>
              </div>
              <input value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none mb-4" placeholder="Transaction reference" />
              <div className="flex gap-3">
                <button onClick={() => setPaymentOpen(false)} className="flex-1 py-2.5 rounded-xl bg-white/10 text-slate-300">Cancel</button>
                <button disabled={!paymentReference.trim()} onClick={async () => { await requestSellerAccess(paymentReference.trim()); setPaymentSent(true); setPaymentOpen(false); }} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-semibold disabled:opacity-40">Submit payment</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <SellDashboardInner
      userId={user.uid}
      profile={profile}
      updateNickname={updateNickname}
    />
  );
}

function SellDashboardInner({
  userId,
  profile,
  updateNickname,
}: {
  userId: string;
  profile: AppUser;
  updateNickname: (nickname: string) => Promise<void>;
}) {
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [nickname, setNickname] = useState(profile.nickname);
  const [savingNickname, setSavingNickname] = useState(false);

  const [title, setTitle] = useState("");
  const [game, setGame] = useState("Valorant");
  const [rank, setRank] = useState("");
  const [region, setRegion] = useState("EU");
  const [price, setPrice] = useState("50");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formOk, setFormOk] = useState("");
  const selectedGame = games.find((item) => item.name === game) ?? games[0];

  useEffect(() => {
    const unsub = subscribeProducts((all) => {
      setMyProducts(all.filter((p) => p.sellerId === userId));
    });
    return unsub;
  }, [userId]);

  const saveNickname = async () => {
    setSavingNickname(true);
    await updateNickname(nickname.trim() || "Player");
    setSavingNickname(false);
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormOk("");
    const priceNum = parseFloat(price);
    if (!title.trim() || !rank.trim() || isNaN(priceNum) || priceNum <= 0) {
      setFormError("Please fill in the title, rank and a valid price.");
      return;
    }
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of imageFiles) {
        urls.push(await uploadImage(file));
      }
      await createProduct({
        sellerId: userId,
        sellerName: nickname.trim() || profile.nickname,
        title: title.trim(),
        game,
        rank: rank.trim(),
        region,
        price: Math.round(priceNum * 100) / 100,
        description: description.trim(),
        images: urls,
      });
      setTitle("");
      setRank("");
      setPrice("50");
      setDescription("");
      setImageFiles([]);
      setFormOk("Product listed successfully!");
    } catch {
      setFormError("Failed to list the product. Check that Firebase Storage is enabled.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Seller Dashboard</h1>
        <p className="text-slate-400">
          Manage your nickname, list new accounts, and track your listings.
        </p>
      </div>

      {/* Profile / Nickname */}
      <div className="glass-card p-6 mb-10">
        <h3 className="font-bold text-white mb-4">Your Profile</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1">
            <label className="text-sm text-slate-400 mb-1 block">
              Nickname (shown to buyers)
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors"
            />
          </div>
          <button
            onClick={saveNickname}
            disabled={savingNickname}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {savingNickname ? "Saving..." : "Save Nickname"}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Email: {profile.email}
        </p>
      </div>

      {/* Add Product */}
      <div className="glass-card p-6 mb-10">
        <h3 className="font-bold text-white mb-6">List a New Account</h3>
        <form onSubmit={submitProduct} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-400 mb-1 block">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors"
                placeholder="e.g., Radiant account with all skins"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Game</label>
              <select
                value={game}
                onChange={(e) => {
                  setGame(e.target.value);
                  setRank("");
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors"
              >
                {games.map((g) => (
                  <option key={g.id} value={g.name} className="bg-charcoal">
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Rank</label>
              <select
                required
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors"
              >
                <option value="" className="bg-charcoal">Select rank</option>
                {getAllDivisions(selectedGame).map((r) => (
                  <option key={r} value={r} className="bg-charcoal">
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors"
              >
                {["EU", "NA", "ASIA", "ME"].map((r) => (
                  <option key={r} value={r} className="bg-charcoal">
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">
                Price (USD)
              </label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-gold/60 transition-colors resize-none"
              placeholder="Describe the account: skins, level, characters..."
            />
          </div>


          <div>
            <label className="text-sm text-slate-400 mb-1 block">
              Photos ({imageFiles.length} selected)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setImageFiles(Array.from(e.target.files ?? []))
              }
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-gold/20 file:text-gold file:text-xs file:font-semibold"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Add screenshots of the account (optional but recommended).
            </p>
          </div>

          {formError && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              {formError}
            </div>
          )}
          {formOk && (
            <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
              ✅ {formOk}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Publish Account"}
          </button>
        </form>
      </div>

      {/* My Products */}
      <div>
        <h3 className="font-bold text-white mb-4">My Listings ({myProducts.length})</h3>
        {myProducts.length === 0 ? (
          <div className="text-center py-10 text-slate-400 glass-card">
            You haven&apos;t listed any accounts yet.
          </div>
        ) : (
          <div className="space-y-3">
            {myProducts.map((p) => (
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
                    {p.game} · {p.rank} · ${p.price} ·{" "}
                    <span
                      className={
                        p.status === "active"
                          ? "text-green-400"
                          : p.status === "sold"
                            ? "text-sky-400"
                            : "text-red-400"
                      }
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {p.status === "active" ? (
                    <button
                      onClick={() => setProductStatus(p.id, "sold")}
                      className="px-3 py-1.5 rounded-lg bg-green-500/15 border border-green-500/40 text-green-400 text-xs font-semibold hover:bg-green-500/25 transition-colors"
                    >
                      Mark Sold
                    </button>
                  ) : (
                    <button
                      onClick={() => setProductStatus(p.id, "active")}
                      className="px-3 py-1.5 rounded-lg bg-gold/15 border border-gold/40 text-gold text-xs font-semibold hover:bg-gold/25 transition-colors"
                    >
                      Re-list
                    </button>
                  )}
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
