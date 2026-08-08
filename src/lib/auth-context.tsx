"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  type User,
} from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import { getUser } from "./store";
import type { AppUser } from "./types";

interface AuthContextValue {
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  banned: boolean;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
  becomeSeller: () => Promise<void>;
  requestSellerAccess: (paymentReference: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [banned, setBanned] = useState(false);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(true);
      unsubProfile?.();
      unsubProfile = undefined;

      if (!u) {
        setProfile(null);
        setBanned(false);
        setLoading(false);
        return;
      }

      const userRef = doc(firestore, "users", u.uid);
      try {
        const existingProfile = await getUser(u.uid);
        if (!existingProfile) {
          await setDoc(userRef, {
            uid: u.uid,
            email: u.email ?? "",
            nickname: u.displayName ?? u.email?.split("@")[0] ?? "Player",
            role: "client",
            isSeller: false,
            banned: false,
            createdAt: Date.now(),
          });
        }

        unsubProfile = onSnapshot(
          userRef,
          (snap) => {
            if (!snap.exists()) return;
            const nextProfile = { uid: snap.id, ...snap.data() } as AppUser;
            setProfile(nextProfile);
            setBanned(!!nextProfile.banned);
            setLoading(false);
          },
          () => setLoading(false)
        );
      } catch {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
    };
  }, []);

  const signup = async (email: string, password: string, nickname: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await setDoc(doc(firestore, "users", cred.user.uid), {
        uid: cred.user.uid,
        email,
        nickname: nickname || email.split("@")[0],
        role: "client",
        isSeller: false,
        banned: false,
        createdAt: Date.now(),
      });
    } catch (error) {
      await deleteUser(cred.user).catch(() => undefined);
      throw Object.assign(new Error("profile-write-failed"), {
        code: "profile-write-failed",
        cause: error,
      });
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateNickname = async (nickname: string) => {
    if (!user) return;
    await setDoc(doc(firestore, "users", user.uid), { nickname }, { merge: true });
  };

  const becomeSeller = async () => {
    if (!user) return;
    await setDoc(
      doc(firestore, "users", user.uid),
      { isSeller: true },
      { merge: true }
    );
  };

  const requestSellerAccess = async (paymentReference: string) => {
    if (!user) return;
    await setDoc(
      doc(firestore, "users", user.uid),
      { sellerPaymentStatus: "pending", sellerPaymentReference: paymentReference },
      { merge: true }
    );
  };

  const refresh = async () => {
    if (user) setProfile(await getUser(user.uid));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        banned,
        signup,
        login,
        logout,
        updateNickname,
        becomeSeller,
        requestSellerAccess,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
