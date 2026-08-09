import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/Footer";
import SupportClient from "@/components/SupportClient";

export const metadata: Metadata = { title: "Support — A2ME" };

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <SupportClient />
      </main>
      <Footer />
    </>
  );
}
