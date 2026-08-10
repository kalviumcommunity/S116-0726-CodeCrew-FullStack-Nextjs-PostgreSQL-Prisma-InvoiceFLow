import DashboardHero from "@/components/dashboard/DashboardHero";
import StatsGrid from "@/components/dashboard/StatsGrid";
import CurrentJob from "@/components/dashboard/CurrentJob";
import Activity from "@/components/dashboard/Activity";

export default function DashboardPage() {
  return (
    <main className="space-y-6">
      <DashboardHero />

      <StatsGrid />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Current Processing Job — larger */}
        <div className="xl:col-span-8">
          <CurrentJob />
        </div>

        {/* Recent Activity — narrower */}
        <div className="xl:col-span-4">
          <Activity />
        </div>
      </section>
    </main>
  );
}