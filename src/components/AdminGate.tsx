"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { hasAdminAccess } from "@/lib/admin";
import AdminLoginModal from "@/components/AdminLoginModal";
import AdminPanel from "@/components/AdminPanel";

export default function AdminGate() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [granted, setGranted] = useState(() => hasAdminAccess());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (granted || profile?.role === "admin") {
    return <AdminPanel />;
  }

  return (
    <AdminLoginModal
      open
      onSuccess={() => setGranted(true)}
      onClose={() => {
        router.push("/");
      }}
    />
  );
}
