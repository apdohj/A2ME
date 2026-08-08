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
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [banned, setBanned] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setProfile(null);
        setBanned(false);
        setLoading(false);
        return;
      }
      const p = await getUser(u.uid);
      if (!p) {
        await setDoc(doc(firestore, "users", u.uid), {
          uid: u.uid,
          email: u.email ?? "",
          nickname: u.displayName ?? u.email?.split("@")[0] ?? "Player",
          role: "client",
          isSeller: false,
          banned: false,
          createdAt: Date.now(),
        });
      }
      setLoading(false);
    });

    const onDoc = () => {
      if (!user) return;
      const unsub = onSnapshot(
        doc(firestore, "users", user.uid),
        (snap) => {
          if (snap.exists()) {
            const p = { uid: snap.id, ...snap.data() } as AppUser;
            setProfile(p);
            setBanned(!!p.banned);
          }
        },
        () => {}
      );
      return unsub;
    };

    let unsubProfile: (() => void) | undefined;
    if (user) unsubProfile = onDoc();

    return () => {
      unsub();
      unsubProfile?.();
    };
  }, [user]);

  const signup = async (email: string, password: string, nickname: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(firestore, "users", cred.user.uid), {
      uid: cred.user.uid,
      email,
      nickname: nickname || email.split("@")[0],
      role: "client",
      isSeller: false,
      banned: false,
      createdAt: Date.now(),
    });
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
