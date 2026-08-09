import Navbar from "@/components/home/Navbar";
import Footer from "@/components/Footer";
import CoachingContent from "@/components/CoachingContent";

export default function CoachingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <CoachingContent />
      </main>
      <Footer />
    </>
  );
}
