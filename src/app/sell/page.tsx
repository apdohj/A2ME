import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import SellDashboard from "@/components/SellDashboard";

export const metadata: Metadata = { title: "Sell Accounts — A2ME" };

export default function SellPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <AuthGuard>
          <SellDashboard />
        </AuthGuard>
      </main>
      <Footer />
    </>
  );
}
