"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { currencySymbols, type Currency } from "./types";
import { CURRENCIES, convertAmount } from "./currency";

const STORAGE_KEY = "a2me_currency";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (amount: number, from?: Currency) => number;
  format: (amount: number, from?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  setCurrency: () => {},
  convert: (amount) => amount,
  format: (amount) => `${currencySymbols.USD}${amount.toFixed(2)}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    if (stored && (CURRENCIES as string[]).includes(stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrencyState(stored as Currency);
    } else if (profile?.walletCurrency) {
      setCurrencyState(profile.walletCurrency);
    }
  }, [profile?.walletCurrency]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, c);
    }
  };

  const convert = (amount: number, from: Currency = "USD") =>
    convertAmount(amount, from, currency);

  const format = (amount: number, from: Currency = "USD") =>
    `${currencySymbols[currency]}${convert(amount, from).toFixed(2)}`;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
