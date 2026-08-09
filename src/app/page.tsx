import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import TrustFeatures from "@/components/home/TrustFeatures";
import GameCategories from "@/components/home/GameCategories";
import Marketplace from "@/components/home/Marketplace";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustFeatures />
        <GameCategories />
        <Marketplace />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
