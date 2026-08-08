"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AuthGuard({
  children,
  sellerOnly = false,
}: {
  children: React.ReactNode;
  sellerOnly?: boolean;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (sellerOnly && !profile?.isSeller && profile?.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Seller Access Only</h2>
        <p className="text-slate-400 mb-8">
          You need to become a seller to access this page.
        </p>
        <a
          href="/sell"
          className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Become a Seller
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
