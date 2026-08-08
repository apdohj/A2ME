import Header from "@/components/Header";
import DashboardContent from "@/components/DashboardContent";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <DashboardContent />
      </main>
    </>
  );
}
