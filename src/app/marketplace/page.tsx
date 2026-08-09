import Navbar from "@/components/home/Navbar";
import Footer from "@/components/Footer";
import MarketplaceContent from "@/components/MarketplaceContent";

export default function MarketplacePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <MarketplaceContent />
      </main>
      <Footer />
    </>
  );
}
