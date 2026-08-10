import StatCard from "./StatCard";

const stats = [
  {
    title: "Total Uploads",
    value: "128",
    change: "+12.5%",
  },
  {
    title: "Invoices Processed",
    value: "24,580",
    change: "+18.7%",
  },
  {
    title: "Success Rate",
    value: "96.5%",
    change: "+2.5%",
  },
  {
    title: "Failed Rows",
    value: "892",
    change: "-6.2%",
    positive: false,
  },
  {
    title: "Running Jobs",
    value: "3",
    change: "Active",
  },
];

export default function StatsGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          positive={stat.positive}
        />
      ))}
    </section>
  );
}