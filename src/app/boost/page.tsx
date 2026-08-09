import Navbar from "@/components/home/Navbar";
import Footer from "@/components/Footer";
import BoostCalculator from "@/components/BoostCalculator";

export default function BoostPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <BoostCalculator />
      </main>
      <Footer />
    </>
  );
}
