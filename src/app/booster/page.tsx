import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BoosterPortal from "@/components/BoosterPortal";

export default function BoosterPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <BoosterPortal />
      </main>
      <Footer />
    </>
  );
}
