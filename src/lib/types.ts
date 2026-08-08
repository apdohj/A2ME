export type Role = "client" | "booster" | "admin";

export interface AppUser {
  uid: string;
  email: string;
  nickname: string;
  role: Role;
  isSeller: boolean;
  banned: boolean;
  sellerPaymentStatus?: "not_required" | "pending" | "paid";
  sellerPaymentReference?: string;
  createdAt: number;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  game: string;
  rank: string;
  region: string;
  price: number;
  description: string;
  images: string[];
  status: "active" | "sold" | "hidden";
  sellerBanned: boolean;
  createdAt: number;
}

export interface Conversation {
  id: string;
  key: string;
  participants: string[];
  names: Record<string, string>;
  productId: string | null;
  productTitle: string | null;
  lastMessage: string;
  lastFrom: string;
  lastTime: number;
}

export interface ChatMessage {
  id: string;
  from: string;
  text: string;
  createdAt: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  texts: {
    heroBadge: string;
    heroTitle: string;
    heroHighlight: string;
    heroTitle2: string;
    heroSubtitle: string;
    sellTitle: string;
    sellSubtitle: string;
    sellButton: string;
  };
}
