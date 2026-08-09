import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import ConversationsList from "@/components/ConversationsList";

export const metadata: Metadata = { title: "Messages — A2ME" };

export default function MessagesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <AuthGuard>
          <ConversationsList />
        </AuthGuard>
      </main>
      <Footer />
    </>
  );
}
