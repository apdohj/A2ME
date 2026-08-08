import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoachingContent from "@/components/CoachingContent";

export default function CoachingPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <CoachingContent />
      </main>
      <Footer />
    </>
  );
}
