import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/Footer";
import AdminGate from "@/components/AdminGate";

export const metadata: Metadata = { title: "Admin — A2ME" };

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <AdminGate />
      </main>
      <Footer />
    </>
  );
}
