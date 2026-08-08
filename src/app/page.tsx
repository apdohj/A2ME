import Header from "@/components/Header";
import HeroCalculator from "@/components/HeroCalculator";
import HowItWorks from "@/components/HowItWorks";
import SellCTA from "@/components/SellCTA";
import ExtraOptions from "@/components/ExtraOptions";
import TopBoosters from "@/components/TopBoosters";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroCalculator />
        <HowItWorks />
        <SellCTA />
        <ExtraOptions />
        <TopBoosters />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
