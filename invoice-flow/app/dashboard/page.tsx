import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import LatestUploadsClient from '@/components/invoices/LatestUploadsClient';

import { uploads } from '@/data/uploads';

type IconProps = {
  className?: string;
};

function UploadCloudIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 11a4 4 0 0 0-7.7-1.5A3.5 3.5 0 1 0 8 17h9a3 3 0 0 0 0-6Z" />
      <path d="M12 9v6" />
      <path d="m9.5 11.5 2.5-2.5 2.5 2.5" />
    </svg>
  );
}

function FileIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

const stats = [
  {
    title: "Total Uploads",
    value: "128",
    trend: "+12% from last week",
    icon: UploadCloudIcon,
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Total Invoices",
    value: "18,240",
    trend: "+8.4% from last week",
    icon: FileIcon,
    accent: "from-sky-500 to-cyan-500",
  },
  {
    title: "Processing",
    value: "24",
    trend: "3 jobs active now",
    icon: ClockIcon,
    accent: "from-amber-500 to-orange-500",
  },
  {
    title: "Completed",
    value: "104",
    trend: "91% success rate this month",
    icon: CheckIcon,
    accent: "from-emerald-500 to-teal-500",
  },
];

const recentUploads = uploads.slice(0, 3).map((upload) => ({
  id: upload.id,
  fileName: upload.fileName,
  uploadedOn: upload.uploadDate,
  totalInvoices: upload.totalRows,
  status: upload.status === 'COMPLETED' ? 'Completed' : upload.status === 'FAILED' ? 'Failed' : 'Processing',
  progress: upload.status === 'COMPLETED' ? 100 : upload.status === 'FAILED' ? 34 : 72,
  badgeClass: upload.status === 'COMPLETED'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    : upload.status === 'FAILED'
      ? 'bg-rose-50 text-rose-700 ring-rose-200'
      : 'bg-amber-50 text-amber-700 ring-amber-200',
}));


export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="Overview of uploads, processing health, and recent activity">
      <div className="flex w-full flex-col gap-6">
        <section className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">Welcome back</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]">
            Hello, Priya👋
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-[0.98rem]">
            Here&apos;s what&apos;s happening with your invoice uploads, background jobs, and recent processing activity today.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article key={stat.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                  </div>
                  <div className={`rounded-2xl bg-linear-to-br ${stat.accent} p-3 text-white shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500">{stat.trend}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <UploadCloudIcon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                Upload your CSV file
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start a new invoice import and keep your processing queue moving.
              </p>
            </div>

            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              <UploadCloudIcon className="h-4 w-4" />
              Upload New CSV
            </Link>
          </div>
        </section>

        <LatestUploadsClient initialRecords={recentUploads} />
      </div>
    </AppShell>
  );
}