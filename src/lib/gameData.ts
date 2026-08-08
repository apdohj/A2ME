export interface Rank {
  name: string;
  divisions: number;
  icon: string;
  color: string;
}

export interface GameConfig {
  id: string;
  name: string;
  icon: string;
  ranks: Rank[];
  basePrice: number;
}

export const games: GameConfig[] = [
  {
    id: "valorant",
    name: "Valorant",
    icon: "🎯",
    basePrice: 8,
    ranks: [
      { name: "Iron", divisions: 3, icon: "⬜", color: "#8B8B8B" },
      { name: "Bronze", divisions: 3, icon: "🟫", color: "#CD7F32" },
      { name: "Silver", divisions: 3, icon: "⬜", color: "#C0C0C0" },
      { name: "Gold", divisions: 3, icon: "🟨", color: "#FFD700" },
      { name: "Platinum", divisions: 3, icon: "🟦", color: "#00CED1" },
      { name: "Diamond", divisions: 3, icon: "💎", color: "#B9F2FF" },
      { name: "Ascendant", divisions: 3, icon: "🟢", color: "#00FF88" },
      { name: "Immortal", divisions: 3, icon: "🔴", color: "#FF4444" },
      { name: "Radiant", divisions: 1, icon: "👑", color: "#FFD700" },
    ],
  },
  {
    id: "lol",
    name: "League of Legends",
    icon: "⚔️",
    basePrice: 7,
    ranks: [
      { name: "Iron", divisions: 4, icon: "⬜", color: "#8B8B8B" },
      { name: "Bronze", divisions: 4, icon: "🟫", color: "#CD7F32" },
      { name: "Silver", divisions: 4, icon: "⬜", color: "#C0C0C0" },
      { name: "Gold", divisions: 4, icon: "🟨", color: "#FFD700" },
      { name: "Platinum", divisions: 4, icon: "🟦", color: "#00CED1" },
      { name: "Emerald", divisions: 4, icon: "🟩", color: "#50C878" },
      { name: "Diamond", divisions: 4, icon: "💎", color: "#B9F2FF" },
      { name: "Master", divisions: 1, icon: "🟣", color: "#9B59B6" },
      { name: "Grandmaster", divisions: 1, icon: "🔴", color: "#E74C3C" },
      { name: "Challenger", divisions: 1, icon: "👑", color: "#FFD700" },
    ],
  },
  {
    id: "cs2",
    name: "Counter-Strike 2",
    icon: "🔫",
    basePrice: 10,
    ranks: [
      { name: "Silver 1", divisions: 1, icon: "⬜", color: "#C0C0C0" },
      { name: "Silver 2", divisions: 1, icon: "⬜", color: "#C0C0C0" },
      { name: "Silver 3", divisions: 1, icon: "⬜", color: "#C0C0C0" },
      { name: "Silver 4", divisions: 1, icon: "⬜", color: "#C0C0C0" },
      { name: "Silver Elite", divisions: 1, icon: "⬜", color: "#D4D4D4" },
      { name: "Gold Nova 1", divisions: 1, icon: "🟨", color: "#FFD700" },
      { name: "Gold Nova 2", divisions: 1, icon: "🟨", color: "#FFD700" },
      { name: "Gold Nova 3", divisions: 1, icon: "🟨", color: "#FFD700" },
      { name: "Gold Nova Master", divisions: 1, icon: "🟨", color: "#FFA500" },
      { name: "MG 1", divisions: 1, icon: "⭐", color: "#00CED1" },
      { name: "MG 2", divisions: 1, icon: "⭐", color: "#00CED1" },
      { name: "MGE", divisions: 1, icon: "⭐", color: "#1E90FF" },
      { name: "DMG", divisions: 1, icon: "💎", color: "#B9F2FF" },
      { name: "LE", divisions: 1, icon: "🔷", color: "#4169E1" },
      { name: "LEM", divisions: 1, icon: "🔷", color: "#9B59B6" },
      { name: "Supreme", divisions: 1, icon: "🔴", color: "#E74C3C" },
      { name: "Global Elite", divisions: 1, icon: "👑", color: "#FFD700" },
    ],
  },
  {
    id: "overwatch",
    name: "Overwatch 2",
    icon: "🛡️",
    basePrice: 9,
    ranks: [
      { name: "Bronze", divisions: 5, icon: "🟫", color: "#CD7F32" },
      { name: "Silver", divisions: 5, icon: "⬜", color: "#C0C0C0" },
      { name: "Gold", divisions: 5, icon: "🟨", color: "#FFD700" },
      { name: "Platinum", divisions: 5, icon: "🟦", color: "#00CED1" },
      { name: "Diamond", divisions: 5, icon: "💎", color: "#B9F2FF" },
      { name: "Master", divisions: 5, icon: "🟣", color: "#9B59B6" },
      { name: "Grandmaster", divisions: 5, icon: "🔴", color: "#E74C3C" },
      { name: "Champion", divisions: 1, icon: "👑", color: "#FFD700" },
    ],
  },
];

export function getAllDivisions(game: GameConfig): string[] {
  const divisions: string[] = [];
  for (const rank of game.ranks) {
    if (rank.divisions === 1) {
      divisions.push(rank.name);
    } else {
      for (let i = rank.divisions; i >= 1; i--) {
        divisions.push(`${rank.name} ${i}`);
      }
    }
  }
  return divisions;
}

export function getRankColor(game: GameConfig, divisionName: string): string {
  for (const rank of game.ranks) {
    if (divisionName.startsWith(rank.name)) {
      return rank.color;
    }
  }
  return "#ffffff";
}

export function getRankIcon(game: GameConfig, divisionName: string): string {
  for (const rank of game.ranks) {
    if (divisionName.startsWith(rank.name)) {
      return rank.icon;
    }
  }
  return "⬜";
}

export function calculatePrice(
  game: GameConfig,
  fromIndex: number,
  toIndex: number,
  extras: { vpn: boolean; duo: boolean; stream: boolean; express: boolean }
): { price: number; eta: string } {
  if (toIndex <= fromIndex) return { price: 0, eta: "—" };

  const diff = toIndex - fromIndex;
  let price = diff * game.basePrice;

  // Price increases exponentially at higher ranks
  const divisions = getAllDivisions(game);
  const totalDivisions = divisions.length;
  const highRankMultiplier = 1 + (toIndex / totalDivisions) * 2;
  price = price * highRankMultiplier;

  // Apply extras
  if (extras.vpn) price *= 1.1;
  if (extras.duo) price *= 1.5;
  if (extras.stream) price *= 1.15;
  if (extras.express) price *= 1.3;

  price = Math.round(price * 100) / 100;

  // ETA calculation
  const hoursPerDiv = 2 + (toIndex / totalDivisions) * 4;
  const totalHours = Math.round(diff * hoursPerDiv);
  const eta =
    totalHours < 24
      ? `${totalHours} hours`
      : `${Math.round(totalHours / 24)} days`;

  return { price, eta };
}
