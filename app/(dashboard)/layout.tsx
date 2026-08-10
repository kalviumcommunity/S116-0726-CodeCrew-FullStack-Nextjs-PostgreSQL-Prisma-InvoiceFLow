import Navbar from "@/components/navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Floating Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="px-7 pb-8 pt-6">
        <div className="mx-auto w-full max-w-[1500px]">
          {children}
        </div>
      </main>
    </div>
  );
}