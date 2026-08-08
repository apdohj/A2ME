import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  real,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("client"), // client | booster | admin
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  game: text("game").notNull(),
  currentRank: text("current_rank").notNull(),
  desiredRank: text("desired_rank").notNull(),
  price: real("price").notNull(),
  status: text("status").notNull().default("pending"), // pending | in_progress | paused | completed
  progress: integer("progress").notNull().default(0),
  boosterId: integer("booster_id").references(() => users.id),
  extras: jsonb("extras"),
  eta: text("eta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const boosters = pgTable("boosters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  games: jsonb("games").notNull(), // array of games
  winRate: real("win_rate").notNull().default(95),
  rating: real("rating").notNull().default(4.9),
  ordersCompleted: integer("orders_completed").notNull().default(0),
  isOnline: boolean("is_online").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  senderId: integer("sender_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  userId: integer("user_id").references(() => users.id),
  boosterId: integer("booster_id").references(() => boosters.id),
  rating: real("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
