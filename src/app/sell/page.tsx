import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import SellDashboard from "@/components/SellDashboard";

export const metadata: Metadata = { title: "Sell Accounts — A2ME" };

export default function SellPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <AuthGuard>
          <SellDashboard />
        </AuthGuard>
      </main>
      <Footer />
    </>
  );
}
