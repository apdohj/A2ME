import Navbar from "@/components/home/Navbar";
import Footer from "@/components/Footer";
import BoosterPortal from "@/components/BoosterPortal";

export default function BoosterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <BoosterPortal />
      </main>
      <Footer />
    </>
  );
}
