import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import Chat from "@/components/Chat";

export const metadata: Metadata = { title: "Chat — A2ME" };

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <AuthGuard>
          <Chat convId={id} />
        </AuthGuard>
      </main>
      <Footer />
    </>
  );
}
