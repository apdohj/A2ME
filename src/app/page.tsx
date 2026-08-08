import Header from "@/components/Header";
import HeroCalculator from "@/components/HeroCalculator";
import SocialProofBar from "@/components/SocialProofBar";
import HowItWorks from "@/components/HowItWorks";
import ExtraOptions from "@/components/ExtraOptions";
import LiveOrderFeed from "@/components/LiveOrderFeed";
import TopBoosters from "@/components/TopBoosters";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroCalculator />
        <SocialProofBar />
        <HowItWorks />
        <ExtraOptions />
        <LiveOrderFeed />
        <TopBoosters />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
