import type { Metadata } from "next";
import Header from "@/components/Header";
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
      <Header />
      <main className="pt-20 min-h-screen">
        <AuthGuard>
          <Chat convId={id} />
        </AuthGuard>
      </main>
      <Footer />
    </>
  );
}
