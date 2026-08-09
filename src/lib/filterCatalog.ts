import { games, getAllDivisions, type GameConfig } from "./gameData";

export type FilterFieldType =
  | "select"
  | "multi"
  | "number"
  | "range"
  | "toggle"
  | "text";

export interface FilterField {
  id: string;
  label: string;
  type: FilterFieldType;
  options?: string[];
  placeholder?: string;
}

export type GameDetails = Record<string, string>;

/* ---------------- helpers ---------------- */

function rankField(game: GameConfig, options?: string[]): FilterField {
  return {
    id: "rank",
    label: "Rank",
    type: "select",
    options: options ?? getAllDivisions(game),
  };
}

function rlRanks(): string[] {
  const tiers = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Champion",
    "Grand Champion",
  ];
  const list: string[] = ["Unranked"];
  for (const t of tiers) {
    for (let i = 1; i <= 3; i++) list.push(`${t} ${["I", "II", "III"][i - 1]}`);
  }
  list.push("Supersonic Legend");
  return list;
}

function ow2RoleTiers(): string[] {
  const tiers = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Master",
    "Grandmaster",
    "Champion",
  ];
  const list: string[] = [];
  for (const t of tiers) {
    for (let i = 5; i >= 1; i--) list.push(`${t} ${i}`);
  }
  return list;
}

function tierDivisions(tiers: string[], divs = 5): string[] {
  const list: string[] = [];
  for (const t of tiers) {
    for (let i = divs; i >= 1; i--) list.push(`${t} ${["I", "II", "III", "IV", "V"][i - 1]}`);
  }
  return list;
}

/* ---------------- common fields (all games) ---------------- */

export const commonFields: FilterField[] = [
  {
    id: "platform",
    label: "Platform",
    type: "select",
    options: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
  },
  {
    id: "accountLevel",
    label: "Account Level",
    type: "select",
    options: [
      "1 - 20",
      "21 - 50",
      "51 - 100",
      "101 - 150",
      "151 - 200",
      "201 - 300",
      "300+",
    ],
  },
];

const emailField: FilterField = {
  id: "email",
  label: "Email",
  type: "select",
  options: ["Email Changeable", "Original Email"],
};

const twoFaField: FilterField = {
  id: "twoFa",
  label: "2FA",
  type: "toggle",
};

/* ---------------- per-game catalogs ---------------- */

const VALORANT: FilterField[] = (() => {
  const g = games.find((x) => x.id === "valorant")!;
  return [
    rankField(g),
    commonFields[1], // account level
    {
      id: "skins",
      label: "Weapon Skins",
      type: "number",
      options: ["0+", "10+", "25+", "50+", "75+", "100+", "150+", "200+"],
      placeholder: "e.g. 120",
    },
    {
      id: "knifeSkins",
      label: "Knife Skins",
      type: "number",
      options: ["0", "1+", "3+", "5+", "10+", "15+"],
      placeholder: "e.g. 2",
    },
    {
      id: "agents",
      label: "Agents",
      type: "select",
      options: ["All Agents", "25+", "20+", "15+", "10+"],
    },
    {
      id: "vp",
      label: "VP",
      type: "number",
      options: ["0+", "1,000+", "2,500+", "5,000+", "10,000+"],
      placeholder: "e.g. 3000",
    },
    {
      id: "radianite",
      label: "Radianite",
      type: "number",
      options: ["0+", "100+", "250+", "500+"],
      placeholder: "e.g. 300",
    },
    emailField,
    twoFaField,
  ];
})();

const LOL: FilterField[] = (() => {
  const g = games.find((x) => x.id === "lol")!;
  return [
    rankField(g),
    commonFields[1],
    {
      id: "championCount",
      label: "Champion Count",
      type: "number",
      options: ["20+", "50+", "100+", "150+", "200+", "All Champions"],
      placeholder: "e.g. 140",
    },
    {
      id: "skins",
      label: "Skin Count",
      type: "number",
      options: ["10+", "25+", "50+", "100+", "150+", "200+", "300+"],
      placeholder: "e.g. 80",
    },
    {
      id: "rareSkins",
      label: "Rare / Prestige / Mythic Skins",
      type: "number",
      options: ["5+", "10+", "25+", "50+"],
      placeholder: "e.g. 15",
    },
    {
      id: "blueEssence",
      label: "Blue Essence",
      type: "number",
      options: ["10,000+", "50,000+", "100,000+", "200,000+"],
      placeholder: "e.g. 60000",
    },
    {
      id: "riotPoints",
      label: "Riot Points",
      type: "number",
      options: ["500+", "1,000+", "2,500+", "5,000+", "10,000+"],
      placeholder: "e.g. 1500",
    },
    {
      id: "honorLevel",
      label: "Honor Level",
      type: "select",
      options: ["0", "1", "2", "3", "4", "5"],
    },
    emailField,
    twoFaField,
  ];
})();

const CS2: FilterField[] = (() => {
  const g = games.find((x) => x.id === "cs2")!;
  return [
    {
      id: "premierRating",
      label: "Premier Rating",
      type: "select",
      options: [
        "0 - 4,999",
        "5,000 - 9,999",
        "10,000 - 14,999",
        "15,000 - 19,999",
        "20,000 - 24,999",
        "25,000+",
      ],
    },
    rankField(g),
    {
      id: "inventoryValue",
      label: "Inventory Value",
      type: "number",
      options: ["$50+", "$100+", "$250+", "$500+", "$1,000+", "$2,500+"],
      placeholder: "e.g. 300",
    },
    {
      id: "skinsCount",
      label: "Skins Count",
      type: "number",
      options: ["10+", "25+", "50+", "100+", "200+"],
      placeholder: "e.g. 60",
    },
    { id: "knife", label: "Knife", type: "toggle" },
    {
      id: "knivesCount",
      label: "Knives Count",
      type: "number",
      options: ["1+", "2+", "3+", "5+"],
      placeholder: "e.g. 1",
    },
    { id: "gloves", label: "Gloves", type: "toggle" },
    { id: "statTrak", label: "StatTrak", type: "toggle" },
    { id: "souvenir", label: "Souvenir", type: "toggle" },
    {
      id: "float",
      label: "Float",
      type: "select",
      options: [
        "Factory New",
        "Minimal Wear",
        "Field-Tested",
        "Well-Worn",
        "Battle-Scarred",
      ],
    },
    {
      id: "steamLevel",
      label: "Steam Level",
      type: "number",
      options: ["10+", "25+", "50+", "100+", "200+"],
      placeholder: "e.g. 60",
    },
    {
      id: "hoursPlayed",
      label: "Hours Played",
      type: "number",
      options: ["100+", "500+", "1,000+", "2,000+", "5,000+"],
      placeholder: "e.g. 800",
    },
    { id: "prime", label: "Prime Status", type: "toggle" },
    emailField,
    twoFaField,
  ];
})();

const OVERWATCH: FilterField[] = (() => {
  const tiers = ow2RoleTiers();
  return [
    rankField(games.find((x) => x.id === "overwatch")!, [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Master",
      "Grandmaster",
      "Champion",
    ]),
    { id: "tankRank", label: "Tank Rank", type: "select", options: tiers },
    { id: "dpsRank", label: "DPS Rank", type: "select", options: tiers },
    { id: "supportRank", label: "Support Rank", type: "select", options: tiers },
    {
      id: "heroCount",
      label: "Hero Count",
      type: "number",
      options: ["10+", "20+", "30+", "All Heroes"],
      placeholder: "e.g. 25",
    },
    {
      id: "heroSkins",
      label: "Hero Skins",
      type: "number",
      options: ["10+", "25+", "50+", "100+"],
      placeholder: "e.g. 40",
    },
    {
      id: "legendarySkins",
      label: "Legendary Skins",
      type: "number",
      options: ["5+", "10+", "25+", "50+"],
      placeholder: "e.g. 20",
    },
    { id: "mythicSkins", label: "Mythic Skins", type: "toggle" },
    {
      id: "overwatchCoins",
      label: "Overwatch Coins",
      type: "number",
      options: ["500+", "1,000+", "2,500+", "5,000+"],
      placeholder: "e.g. 1200",
    },
    {
      id: "competitivePoints",
      label: "Competitive Points",
      type: "number",
      options: ["1,000+", "3,000+", "5,000+", "10,000+"],
      placeholder: "e.g. 2000",
    },
    {
      id: "credits",
      label: "Credits",
      type: "number",
      options: ["500+", "1,000+", "2,500+", "5,000+"],
      placeholder: "e.g. 800",
    },
    emailField,
    twoFaField,
  ];
})();

const FORTNITE: FilterField[] = (() => {
  const g = games.find((x) => x.id === "fortnite")!;
  return [
    rankField(g),
    {
      id: "mode",
      label: "Game Mode",
      type: "multi",
      options: ["Battle Royale", "Zero Build", "Reload"],
    },
    commonFields[1],
    {
      id: "skins",
      label: "Skins / Outfits",
      type: "number",
      options: ["25+", "50+", "100+", "200+", "300+"],
      placeholder: "e.g. 150",
    },
    {
      id: "pickaxes",
      label: "Pickaxes",
      type: "number",
      options: ["10+", "25+", "50+", "100+"],
      placeholder: "e.g. 30",
    },
    {
      id: "gliders",
      label: "Gliders",
      type: "number",
      options: ["10+", "25+", "50+"],
      placeholder: "e.g. 20",
    },
    {
      id: "emotes",
      label: "Emotes",
      type: "number",
      options: ["25+", "50+", "100+", "200+"],
      placeholder: "e.g. 90",
    },
    { id: "ogSkins", label: "OG Skins", type: "toggle" },
    { id: "rareSkins", label: "Rare / Exclusive Skins", type: "toggle" },
    {
      id: "vbucks",
      label: "V-Bucks",
      type: "number",
      options: ["500+", "1,000+", "2,500+", "5,000+", "10,000+"],
      placeholder: "e.g. 2000",
    },
    { id: "battlePass", label: "Battle Pass", type: "toggle" },
  ];
})();

const APEX: FilterField[] = (() => {
  const g = games.find((x) => x.id === "apex")!;
  return [
    rankField(g),
    {
      id: "rp",
      label: "RP",
      type: "number",
      options: ["1,000+", "3,000+", "5,000+", "10,000+", "15,000+", "20,000+"],
      placeholder: "e.g. 4500",
    },
    commonFields[1],
    {
      id: "legendsUnlocked",
      label: "Legends Unlocked",
      type: "number",
      options: ["10+", "20+", "All Legends"],
      placeholder: "e.g. 18",
    },
    {
      id: "legendSkins",
      label: "Legend Skins",
      type: "number",
      options: ["10+", "25+", "50+", "100+"],
      placeholder: "e.g. 40",
    },
    { id: "heirlooms", label: "Heirlooms", type: "toggle" },
    {
      id: "kills",
      label: "Kills",
      type: "number",
      options: ["1,000+", "5,000+", "10,000+", "25,000+"],
      placeholder: "e.g. 8000",
    },
    {
      id: "wins",
      label: "Wins",
      type: "number",
      options: ["100+", "500+", "1,000+", "2,500+"],
      placeholder: "e.g. 300",
    },
    {
      id: "kd",
      label: "K/D",
      type: "range",
      placeholder: "e.g. 2.5",
    },
    {
      id: "apexCoins",
      label: "Apex Coins",
      type: "number",
      options: ["500+", "1,000+", "2,500+", "5,000+"],
      placeholder: "e.g. 1500",
    },
    emailField,
    twoFaField,
  ];
})();

const PUBG: FilterField[] = (() => {
  const g = games.find((x) => x.id === "pubg")!;
  return [
    rankField(g),
    {
      id: "kd",
      label: "K/D",
      type: "range",
      placeholder: "e.g. 3.1",
    },
    {
      id: "wins",
      label: "Wins",
      type: "number",
      options: ["50+", "100+", "500+", "1,000+"],
      placeholder: "e.g. 250",
    },
    {
      id: "rankPoints",
      label: "Rank Points",
      type: "number",
      options: ["2,000+", "3,000+", "4,000+", "5,000+"],
      placeholder: "e.g. 3200",
    },
    {
      id: "weaponSkins",
      label: "Weapon Skins",
      type: "number",
      options: ["10+", "25+", "50+"],
      placeholder: "e.g. 30",
    },
    {
      id: "outfits",
      label: "Outfits",
      type: "number",
      options: ["10+", "25+", "50+", "100+"],
      placeholder: "e.g. 40",
    },
    { id: "rareSkins", label: "Rare / Limited Items", type: "toggle" },
    {
      id: "gCoin",
      label: "G-Coin",
      type: "number",
      options: ["500+", "1,000+", "2,500+", "5,000+"],
      placeholder: "e.g. 1200",
    },
    {
      id: "platform",
      label: "Platform",
      type: "select",
      options: ["PC", "PlayStation", "Xbox"],
    },
    emailField,
    twoFaField,
  ];
})();

const WARZONE: FilterField[] = (() => {
  const g = games.find((x) => x.id === "warzone")!;
  return [
    rankField(g),
    {
      id: "sr",
      label: "SR",
      type: "range",
      placeholder: "e.g. 6500",
    },
    commonFields[1],
    {
      id: "kills",
      label: "Kills",
      type: "number",
      options: ["1,000+", "5,000+", "10,000+", "25,000+"],
      placeholder: "e.g. 7000",
    },
    {
      id: "kd",
      label: "K/D",
      type: "range",
      placeholder: "e.g. 2.2",
    },
    {
      id: "camos",
      label: "Camos",
      type: "number",
      options: ["50+", "100+", "200+", "400+"],
      placeholder: "e.g. 150",
    },
    { id: "masteryCamos", label: "Mastery Camos", type: "toggle" },
    {
      id: "operators",
      label: "Operators",
      type: "number",
      options: ["5+", "10+", "25+", "50+"],
      placeholder: "e.g. 15",
    },
    {
      id: "codPoints",
      label: "COD Points",
      type: "number",
      options: ["500+", "1,000+", "2,500+", "5,000+", "10,000+"],
      placeholder: "e.g. 2000",
    },
    { id: "battlePass", label: "Battle Pass", type: "toggle" },
    { id: "blackCell", label: "BlackCell", type: "toggle" },
    emailField,
    twoFaField,
  ];
})();

const R6: FilterField[] = (() => {
  const g = games.find((x) => x.id === "rainbow-six")!;
  return [
    rankField(g),
    {
      id: "rankPoints",
      label: "Rank Points",
      type: "number",
      options: ["1,000+", "2,000+", "3,000+", "4,000+", "5,000+"],
      placeholder: "e.g. 2800",
    },
    {
      id: "peakRank",
      label: "Peak Rank",
      type: "select",
      options: ["Copper", "Bronze", "Silver", "Gold", "Platinum", "Emerald", "Diamond", "Champion"],
    },
    {
      id: "operatorsUnlocked",
      label: "Operators Unlocked",
      type: "number",
      options: ["20+", "30+", "All Operators"],
      placeholder: "e.g. 25",
    },
    {
      id: "eliteSkins",
      label: "Elite Skins",
      type: "number",
      options: ["1+", "3+", "5+", "10+"],
      placeholder: "e.g. 4",
    },
    {
      id: "renown",
      label: "Renown",
      type: "number",
      options: ["50,000+", "100,000+", "250,000+", "500,000+"],
      placeholder: "e.g. 120000",
    },
    {
      id: "r6Credits",
      label: "R6 Credits",
      type: "number",
      options: ["500+", "1,000+", "2,500+", "5,000+"],
      placeholder: "e.g. 1000",
    },
    commonFields[1],
    emailField,
    twoFaField,
  ];
})();

const RL: FilterField[] = (() => {
  const ranks = rlRanks();
  return [
    { id: "rank1v1", label: "1v1 Rank", type: "select", options: ranks },
    { id: "rank2v2", label: "2v2 Rank", type: "select", options: ranks },
    { id: "rank3v3", label: "3v3 Rank", type: "select", options: ranks },
    {
      id: "extraModes",
      label: "Extra Modes",
      type: "multi",
      options: ["Hoops", "Rumble", "Dropshot", "Snow Day"],
    },
    {
      id: "carBodies",
      label: "Car Bodies",
      type: "number",
      options: ["10+", "25+", "50+", "100+"],
      placeholder: "e.g. 30",
    },
    {
      id: "decals",
      label: "Decals",
      type: "number",
      options: ["10+", "25+", "50+", "100+"],
      placeholder: "e.g. 40",
    },
    {
      id: "wheels",
      label: "Wheels",
      type: "number",
      options: ["10+", "25+", "50+", "100+"],
      placeholder: "e.g. 35",
    },
    {
      id: "boosts",
      label: "Boosts",
      type: "number",
      options: ["10+", "25+", "50+", "100+"],
      placeholder: "e.g. 30",
    },
    {
      id: "goalExplosions",
      label: "Goal Explosions",
      type: "number",
      options: ["1+", "5+", "10+", "20+"],
      placeholder: "e.g. 8",
    },
    { id: "blackMarket", label: "Black Market Items", type: "toggle" },
    {
      id: "credits",
      label: "Credits",
      type: "number",
      options: ["500+", "1,000+", "2,500+", "5,000+", "10,000+"],
      placeholder: "e.g. 1500",
    },
    commonFields[1],
    emailField,
    twoFaField,
  ];
})();

const EAFC: FilterField[] = (() => {
  return [
    {
      id: "divisionRivals",
      label: "Division Rivals",
      type: "select",
      options: [
        "Division 10",
        "Division 9",
        "Division 8",
        "Division 7",
        "Division 6",
        "Division 5",
        "Division 4",
        "Division 3",
        "Division 2",
        "Division 1",
        "Elite",
      ],
    },
    {
      id: "champsWins",
      label: "Champions Wins",
      type: "select",
      options: ["0 Wins", "1-5 Wins", "6-8 Wins", "9-10 Wins", "11+ Wins"],
    },
    {
      id: "squadRating",
      label: "Squad Rating",
      type: "number",
      options: ["85+", "87+", "89+", "90+", "92+"],
      placeholder: "e.g. 89",
    },
    {
      id: "coins",
      label: "Coins",
      type: "number",
      options: ["50,000+", "100,000+", "500,000+", "1,000,000+"],
      placeholder: "e.g. 250000",
    },
    {
      id: "fcPoints",
      label: "FC Points",
      type: "number",
      options: ["500+", "1,000+", "2,500+", "5,000+", "10,000+"],
      placeholder: "e.g. 1500",
    },
    { id: "icons", label: "Icons", type: "toggle" },
    { id: "heroes", label: "Heroes", type: "toggle" },
    { id: "toty", label: "TOTY", type: "toggle" },
    { id: "tots", label: "TOTS", type: "toggle" },
    {
      id: "clubLevel",
      label: "Club Level",
      type: "number",
      options: ["10+", "25+", "50+"],
      placeholder: "e.g. 35",
    },
    {
      id: "platform",
      label: "Platform",
      type: "select",
      options: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    },
    emailField,
    twoFaField,
  ];
})();

const DOTA2: FilterField[] = (() => {
  const g = games.find((x) => x.id === "dota2")!;
  return [
    rankField(g),
    { id: "mmr", label: "MMR", type: "range", placeholder: "e.g. 4800" },
    commonFields[1],
    {
      id: "matches",
      label: "Matches",
      type: "number",
      options: ["500+", "1,000+", "3,000+", "5,000+"],
      placeholder: "e.g. 1200",
    },
    {
      id: "winRate",
      label: "Win Rate",
      type: "range",
      placeholder: "e.g. 55",
    },
    { id: "arcana", label: "Arcana", type: "toggle" },
    { id: "immortalItems", label: "Immortal Items", type: "toggle" },
    { id: "rareItems", label: "Rare Items", type: "toggle" },
    {
      id: "sets",
      label: "Sets",
      type: "number",
      options: ["10+", "25+", "50+", "100+"],
      placeholder: "e.g. 40",
    },
    { id: "courier", label: "Courier", type: "toggle" },
    { id: "wardSkins", label: "Ward Skins", type: "toggle" },
    emailField,
    twoFaField,
  ];
})();

/* ---------------- Other (custom games) ---------------- */

export const otherCatalog: FilterField[] = [
  {
    id: "rank",
    label: "Rank",
    type: "select",
    options: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Champion"],
  },
  {
    id: "rankPoints",
    label: "Rank Points",
    type: "number",
    options: ["1,000+", "3,000+", "5,000+", "10,000+"],
    placeholder: "e.g. 2000",
  },
  {
    id: "skins",
    label: "Skins",
    type: "number",
    options: ["10+", "25+", "50+", "100+", "200+"],
    placeholder: "e.g. 60",
  },
  {
    id: "characters",
    label: "Characters",
    type: "number",
    options: ["10+", "25+", "50+"],
    placeholder: "e.g. 30",
  },
  { id: "rareItems", label: "Rare Items", type: "toggle" },
  { id: "battlePass", label: "Battle Pass", type: "toggle" },
  {
    id: "stats",
    label: "Stats (K/D, Wins...)",
    type: "text",
    placeholder: "e.g. 2.5 KD, 300 wins",
  },
  commonFields[0], // platform
  commonFields[1], // account level
  emailField,
  twoFaField,
];

/* ---------------- catalog lookup ---------------- */

const GAME_ID_BY_NAME = new Map<string, string>(
  games.map((g) => [g.name, g.id])
);

export function gameIdForName(name: string): string | undefined {
  return GAME_ID_BY_NAME.get(name);
}

export function getCatalogFields(gameName: string): FilterField[] {
  const id = gameIdForName(gameName);
  if (!id) return otherCatalog;
  const cat = (catalogs as Record<string, FilterField[]>)[id];
  return cat ?? otherCatalog;
}

export const catalogs: Record<string, FilterField[]> = {
  valorant: VALORANT,
  lol: LOL,
  cs2: CS2,
  overwatch: OVERWATCH,
  fortnite: FORTNITE,
  apex: APEX,
  pubg: PUBG,
  warzone: WARZONE,
  "rainbow-six": R6,
  "rocket-league": RL,
  "ea-fc": EAFC,
  dota2: DOTA2,
};

/* ---------------- matching ---------------- */

export function matchesDetails(
  productDetails: GameDetails | undefined,
  field: FilterField,
  buyerValue: string | undefined,
  buyerMax?: string
): boolean {
  if (!buyerValue || buyerValue === "" || buyerValue === "Any") return true;
  const sellerVal = productDetails?.[field.id];
  if (sellerVal == null || sellerVal === "") return true;

  switch (field.type) {
    case "number": {
      const s = parseFloat(String(sellerVal).replace(/,/g, ""));
      const b = parseFloat(String(buyerValue).replace(/,/g, ""));
      if (isNaN(s) || isNaN(b)) return true;
      return s >= b;
    }
    case "range": {
      const s = parseFloat(String(sellerVal).replace(/,/g, ""));
      if (isNaN(s)) return true;
      const lo = buyerValue !== "" ? parseFloat(String(buyerValue).replace(/,/g, "")) : NaN;
      const hi = buyerMax !== undefined && buyerMax !== ""
        ? parseFloat(String(buyerMax).replace(/,/g, ""))
        : NaN;
      if (!isNaN(lo) && s < lo) return false;
      if (!isNaN(hi) && s > hi) return false;
      return true;
    }
    case "multi": {
      const selected = String(buyerValue)
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      if (selected.length === 0) return true;
      return selected.some(
        (o) => o.toLowerCase() === String(sellerVal).toLowerCase()
      );
    }
    case "toggle":
      return (
        String(sellerVal).toLowerCase() !== "no" &&
        String(sellerVal).toLowerCase() !== "false" &&
        String(sellerVal) !== ""
      );
    case "text":
      return String(sellerVal)
        .toLowerCase()
        .includes(String(buyerValue).toLowerCase());
    default:
      return (
        String(sellerVal).toLowerCase() === String(buyerValue).toLowerCase()
      );
  }
}
