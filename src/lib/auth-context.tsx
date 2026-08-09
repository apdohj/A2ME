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
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import { debitSellerActivation, getUser } from "./store";
import type { AppUser } from "./types";

interface AuthContextValue {
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  banned: boolean;
  deleted: boolean;
  signup: (email: string, password: string, nickname: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
  becomeSeller: () => Promise<void>;
  requestSellerAccess: (paymentReference: string) => Promise<void>;
  activateSellerFromWallet: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [banned, setBanned] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    let unsubDeleted: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      unsubProfile?.();
      unsubProfile = undefined;
      unsubDeleted?.();
      unsubDeleted = undefined;
      setUser(u);
      setLoading(true);

      if (!u) {
        setProfile(null);
        setBanned(false);
        setDeleted(false);
        setLoading(false);
        return;
      }

      const userRef = doc(firestore, "users", u.uid);
      const deletedRef = doc(firestore, "deletedUsers", u.uid);

      unsubDeleted = onSnapshot(deletedRef, (snap) => {
        if (snap.exists()) {
          setDeleted(true);
          setProfile(null);
          setBanned(false);
          setLoading(false);
        } else {
          setDeleted(false);
        }
      });

      try {
        const existingProfile = await getUser(u.uid);
        if (!existingProfile) {
          const deletedSnap = await getDoc(deletedRef);
          if (deletedSnap.exists()) {
            setDeleted(true);
            setProfile(null);
            setBanned(false);
            setLoading(false);
            return;
          }
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
      unsubDeleted?.();
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

  const activateSellerFromWallet = async () => {
    if (!user) return;
    await debitSellerActivation(user.uid);
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
        deleted,
        signup,
        login,
        logout,
        updateNickname,
        becomeSeller,
        requestSellerAccess,
        activateSellerFromWallet,
        refresh,
      }}
    >
      {deleted ? (
        <DeletedAccountScreen onExit={() => signOut(auth)} />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

function DeletedAccountScreen({ onExit }: { onExit: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-card p-8 text-center">
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="text-xl font-bold text-white mb-3">
          This account has been deleted
        </h1>
        <p className="text-sm text-slate-400 mb-2">
          This account has been permanently deleted and can no longer be used to
          log in again.
        </p>
        <p className="text-sm text-slate-400 mb-8" dir="rtl">
          تم حذف هذا الحساب نهائيًا ولا يمكن تسجيل الدخول به مرة أخرى.
        </p>
        <button
          onClick={onExit}
          className="w-full py-3 rounded-xl bg-white/10 text-slate-200 font-semibold hover:bg-white/20 transition-colors"
        >
          Sign out / تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
