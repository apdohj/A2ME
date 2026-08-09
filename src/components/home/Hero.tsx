"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/marketplace?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative isolate overflow-hidden bg-a2-bg">
      {/* Background layer (z-0) */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home/hero-background.png"
          alt=""
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-a2-bg via-a2-bg/85 to-a2-bg/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-a2-bg via-transparent to-a2-bg/70" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 72% 40%, rgba(255,201,40,0.14), transparent 55%)",
          }}
        />
      </div>

      {/* Content (z-10) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 min-h-[86vh] flex items-center">
        <div className="grid w-full lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left: copy + search */}
          <div className="lg:col-span-7 text-center lg:text-left min-w-0">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-a2-gold/30 bg-a2-gold/5 text-a2-gold text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-a2-gold animate-pulse shrink-0" />
              Level Up Your Gaming
            </div>

            <h1 className="font-display font-bold uppercase leading-[1.02] tracking-tight max-w-full">
              <span className="block text-[2.6rem] leading-[1.02] sm:text-6xl xl:text-8xl text-a2-gold neon-text">
                Buy &amp; Sell
              </span>
              <span className="block text-[2.1rem] leading-[1.05] sm:text-5xl xl:text-7xl text-white mt-2">
                Game Accounts
              </span>
            </h1>

            <div className="mt-5 text-a2-gold font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm">
              Trusted &nbsp;•&nbsp; Secure &nbsp;•&nbsp; Fast
            </div>

            <p className="mt-4 text-a2-light/80 max-w-lg mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed">
              The best marketplace for gaming accounts in the Middle East.
              <br className="hidden sm:block" />
              Find your dream account or sell yours with complete safety.
            </p>

            {/* Search bar */}
            <form onSubmit={submit} className="mt-8 w-full max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-a2-bg/70 border border-white/20 backdrop-blur-md focus-within:border-a2-gold/60 transition-colors">
                <Search className="w-5 h-5 text-a2-gold ml-2 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for games, ranks, skins, or accounts..."
                  className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-a2-light/40 outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-a2-gold text-black text-sm font-bold hover:bg-a2-gold-bright transition-colors a2-glow-soft shrink-0"
                >
                  <span className="hidden sm:inline">Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right: decorative art (desktop only, contained) */}
          <div className="hidden lg:block lg:col-span-5 relative h-[520px] min-h-0">
            <div className="absolute top-2 right-6 w-64 xl:w-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home/a2-logo.png"
                alt="A2ME"
                className="w-full h-auto object-contain a2-glow-soft"
              />
            </div>
            <div className="absolute bottom-0 right-0 h-[420px] xl:h-[460px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home/gamer-art.png"
                alt=""
                className="h-full w-auto max-w-full object-contain drop-shadow-[0_0_45px_rgba(255,201,40,0.25)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
