import { currencySymbols, type Currency } from "./types";

export const CURRENCIES: Currency[] = ["EGP", "USD", "EUR", "KWD", "SAR"];

export const currencyNames: Record<Currency, string> = {
  EGP: "Egyptian Pound",
  USD: "US Dollar",
  EUR: "Euro",
  KWD: "Kuwaiti Dinar",
  SAR: "Saudi Riyal",
};

// How many units of each currency are equal to 1 USD.
export const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EGP: 50,
  EUR: 0.92,
  KWD: 0.31,
  SAR: 3.75,
};

export function convertAmount(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (!isFinite(amount)) return 0;
  if (from === to) return amount;
  const usd = amount / exchangeRates[from];
  return Math.round(usd * exchangeRates[to] * 100) / 100;
}

export function totalUsd(
  wallet: Partial<Record<Currency, number>> | undefined
): number {
  return CURRENCIES.reduce(
    (sum, c) => sum + (wallet?.[c] ?? 0) / exchangeRates[c],
    0
  );
}

export function formatAmount(amount: number, currency: Currency): string {
  return `${currencySymbols[currency]}${amount.toFixed(2)}`;
}

export function symbolFor(currency: Currency): string {
  return currencySymbols[currency];
}
