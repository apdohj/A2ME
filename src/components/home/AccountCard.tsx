"use client";

import { useState } from "react";
import { Heart, Eye, Monitor, Gamepad2 } from "lucide-react";
import type { Product } from "@/lib/types";

export interface HomeAccount {
  id: string;
  gameName: string;
  gameLogo: string;
  rank: string;
  info: string;
  meta: string;
  priceLabel: string;
  priceNum: number;
  image?: string;
  createdAt?: number;
  product?: Product;
}

export default function AccountCard({
  account,
  layout,
  onView,
}: {
  account: HomeAccount;
  layout: "grid" | "list";
  onView: (a: HomeAccount) => void;
}) {
  const [fav, setFav] = useState(false);

  const thumb = (
    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-a2-dark to-a2-bg2">
      {account.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={account.image}
          alt={account.gameName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={account.gameLogo}
            alt=""
            className="h-16 w-16 object-contain"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-a2-bg/90 via-transparent to-transparent" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          setFav(!fav);
        }}
        aria-label="Save"
        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur border border-white/10 hover:border-a2-gold/60 transition-colors"
      >
        <Heart
          className={`w-4 h-4 ${fav ? "fill-a2-gold text-a2-gold" : "text-white"}`}
        />
      </button>
      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-a2-gold/95 text-black text-[11px] font-bold uppercase tracking-wide">
        {account.rank}
      </span>
    </div>
  );

  if (layout === "list") {
    return (
      <div className="group relative w-full max-w-full a2-card overflow-hidden flex hover:-translate-y-0.5 transition-all duration-300 hover:border-a2-gold/50 hover:shadow-[0_0_24px_rgba(255,201,40,0.14)]">
        <div className="w-44 shrink-0">{thumb}</div>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 p-4 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={account.gameLogo}
                alt=""
                className="h-5 w-5 object-contain shrink-0"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-white truncate">
                {account.gameName}
              </span>
            </div>
            <div className="text-sm text-a2-light/85 font-medium truncate">
              {account.info}
            </div>
            <div className="text-xs text-a2-light/50 mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                {account.meta}
              </span>
              <span className="flex items-center gap-1">
                <Gamepad2 className="w-3 h-3" />
                {account.rank}
              </span>
            </div>
          </div>
          <div className="flex sm:flex-col sm:items-end gap-3 sm:gap-2 shrink-0">
            <div className="font-display font-bold text-xl text-a2-gold whitespace-nowrap">
              {account.priceLabel}
            </div>
            <button
              onClick={() => onView(account)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-a2-gold text-black text-xs font-bold hover:bg-a2-gold-bright transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative w-full max-w-full a2-card overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 hover:border-a2-gold/60 hover:shadow-[0_0_24px_rgba(255,201,40,0.18)]">
      {thumb}
      <div className="p-4 flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-2.5 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={account.gameLogo}
            alt=""
            className="h-5 w-5 object-contain shrink-0"
          />
          <span className="text-xs font-bold uppercase tracking-wider text-white truncate">
            {account.gameName}
          </span>
        </div>
        <div className="text-sm text-a2-light/80 font-medium line-clamp-2 break-words">
          {account.info}
        </div>
        <div className="text-xs text-a2-light/50 mt-1 truncate">{account.meta}</div>
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-a2-border gap-3">
          <div className="font-display font-bold text-xl text-a2-gold whitespace-nowrap">
            {account.priceLabel}
          </div>
          <button
            onClick={() => onView(account)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-a2-gold text-black text-xs font-bold hover:bg-a2-gold-bright transition-colors shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
