import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import ConversationsList from "@/components/ConversationsList";

export const metadata: Metadata = { title: "Messages — A2ME" };

export default function MessagesPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <AuthGuard>
          <ConversationsList />
        </AuthGuard>
      </main>
      <Footer />
    </>
  );
}
