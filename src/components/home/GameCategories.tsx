"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GAMES = [
  { id: "valorant", name: "VALORANT" },
  { id: "lol", name: "LEAGUE OF LEGENDS" },
  { id: "cs2", name: "CS2" },
  { id: "overwatch", name: "OVERWATCH 2" },
  { id: "fortnite", name: "FORTNITE" },
  { id: "apex", name: "APEX LEGENDS" },
  { id: "pubg", name: "PUBG" },
  { id: "warzone", name: "WARZONE" },
  { id: "rainbow-six", name: "R6 SIEGE" },
  { id: "rocket-league", name: "ROCKET LEAGUE" },
  { id: "ea-fc", name: "EA FC" },
  { id: "dota2", name: "DOTA 2" },
  { id: "other", name: "OTHER" },
];

export default function GameCategories() {
  const router = useRouter();
  const [active, setActive] = useState("valorant");

  return (
    <section className="bg-a2-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:overflow-visible lg:flex-wrap lg:justify-center lg:gap-3 lg:mx-0 lg:px-0 scrollbar-none">
          {GAMES.map((g) => {
            const selected = active === g.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  setActive(g.id);
                  router.push(`/marketplace?game=${encodeURIComponent(g.name)}`);
                }}
                className={`group flex flex-col items-center gap-2.5 px-5 py-4 rounded-2xl border min-w-[118px] transition-all duration-300 ${
                  selected
                    ? "border-a2-gold bg-a2-gold/10 a2-glow-soft"
                    : "border-a2-border bg-a2-card hover:border-a2-gold/40 hover:bg-a2-card/80"
                }`}
              >
                <span className="h-10 w-10 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/home/games/${g.id}.png`}
                    alt={g.name}
                    className={`h-8 w-auto object-contain transition-opacity ${
                      selected ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                    }`}
                  />
                </span>
                <span
                  className={`text-[11px] font-semibold tracking-wide whitespace-nowrap ${
                    selected ? "text-a2-gold" : "text-a2-light/70"
                  }`}
                >
                  {g.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
