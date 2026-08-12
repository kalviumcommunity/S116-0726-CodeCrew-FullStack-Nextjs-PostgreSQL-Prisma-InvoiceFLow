"use client";

import { useEffect, useState } from "react";
import StatCard from "./StatCard";

export default function StatsGrid() {
  const [statsData, setStatsData] = useState({
    totalUploads: 0,
    totalInvoices: 0,
    successRate: "100%",
    failedRows: 0,
    runningJobs: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          
          const rate =
            data.totalInvoices > 0
              ? `${(((data.totalInvoices - data.failedRows) / data.totalInvoices) * 100).toFixed(1)}%`
              : "100%";

          setStatsData({
            totalUploads: data.totalUploads,
            totalInvoices: data.totalInvoices,
            successRate: rate,
            failedRows: data.failedRows,
            runningJobs: data.runningJobs,
          });
        }
      } catch (err) {
        console.error("StatsGrid fetch error:", err);
      }
    }

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Uploads",
      value: statsData.totalUploads.toLocaleString("en-IN"),
      change: "Live",
    },
    {
      title: "Invoices Processed",
      value: statsData.totalInvoices.toLocaleString("en-IN"),
      change: "Live",
    },
    {
      title: "Success Rate",
      value: statsData.successRate,
      change: "Live",
    },
    {
      title: "Failed Rows",
      value: statsData.failedRows.toLocaleString("en-IN"),
      change: "Errors",
      positive: false,
    },
    {
      title: "Running Jobs",
      value: statsData.runningJobs.toString(),
      change: statsData.runningJobs > 0 ? "Active" : "Idle",
    },
  ];

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