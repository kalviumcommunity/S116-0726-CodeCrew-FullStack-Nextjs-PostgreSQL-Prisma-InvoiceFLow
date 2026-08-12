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
        const [upRes, invRes] = await Promise.all([
          fetch("/api/uploads"),
          fetch("/api/invoices"),
        ]);

        let totalUploads = 0;
        let runningJobs = 0;
        if (upRes.ok) {
          const data = await upRes.json();
          totalUploads = data.total || 0;
          runningJobs = (data.uploads || []).filter(
            (u: any) => u.status === "Processing" || u.status === "Queued"
          ).length;
        }

        let totalInvoices = 0;
        let failedRows = 0;
        let successCount = 0;
        if (invRes.ok) {
          const invData = await invRes.json();
          const invList = invData.invoices || [];
          totalInvoices = invList.length;
          failedRows = invList.filter((i: any) => i.status === "Error").length;
          successCount = invList.filter((i: any) => i.status === "Matched").length;
        }

        const rate =
          totalInvoices > 0
            ? `${(((totalInvoices - failedRows) / totalInvoices) * 100).toFixed(1)}%`
            : "100%";

        setStatsData({
          totalUploads,
          totalInvoices,
          successRate: rate,
          failedRows,
          runningJobs,
        });
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