import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportClient from "@/components/SupportClient";

export const metadata: Metadata = { title: "Support — A2ME" };

export default function SupportPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <SupportClient />
      </main>
      <Footer />
    </>
  );
}
