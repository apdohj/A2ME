import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BoostCalculator from "@/components/BoostCalculator";

export default function BoostPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <BoostCalculator />
      </main>
      <Footer />
    </>
  );
}
