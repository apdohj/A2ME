import Navbar from "@/components/home/Navbar";
import DashboardContent from "@/components/DashboardContent";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <DashboardContent />
      </main>
    </>
  );
}
