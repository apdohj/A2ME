import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminGate from "@/components/AdminGate";

export const metadata: Metadata = { title: "Admin — A2ME" };

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <AdminGate />
      </main>
      <Footer />
    </>
  );
}
