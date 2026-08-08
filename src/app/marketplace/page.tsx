import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketplaceContent from "@/components/MarketplaceContent";

export default function MarketplacePage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <MarketplaceContent />
      </main>
      <Footer />
    </>
  );
}
