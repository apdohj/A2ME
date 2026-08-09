"use client";

import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { CURRENCIES, currencyNames } from "@/lib/currency";
import { currencySymbols, type Currency } from "@/lib/types";

export default function WalletPanel() {
  const { user, profile } = useAuth();
  const { currency, setCurrency } = useCurrency();

  if (!user || !profile) return null;

  return (
    <section className="glass-card p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Local Wallet</h2>
          <p className="text-xs text-slate-400 mt-1">
            Your chosen currency is saved and used across the whole site.
          </p>
        </div>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          style={{ colorScheme: "dark" }}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white"
        >
          {CURRENCIES.map((item) => (
            <option key={item} value={item} className="bg-charcoal text-white">
              {item} — {currencyNames[item]}
            </option>
          ))}
        </select>
      </div>
      <div className="text-3xl font-black text-gold mb-5">
        {currencySymbols[currency]} {(profile.wallet?.[currency] ?? 0).toFixed(2)}
      </div>
      <p className="text-xs text-slate-500">
        Wallet deposits and withdrawals are processed by the administrator.
        Seller subscriptions are paid from the USD balance.
      </p>
    </section>
  );
}
