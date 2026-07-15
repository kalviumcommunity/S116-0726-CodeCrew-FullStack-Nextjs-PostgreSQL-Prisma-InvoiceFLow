type IconProps = {
  className?: string;
};

function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 17H9a3 3 0 0 1-3-3v-2a6 6 0 1 1 12 0v2a3 3 0 0 1-3 3Z" />
      <path d="M10 17a2 2 0 0 0 4 0" />
    </svg>
  );
}

function LogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9.5 12 4l6 5.5" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function DashboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

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

function AvatarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.7-3.5 4.8-5 8-5s6.3 1.5 8 5" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
      <path d="M19.4 15a7.9 7.9 0 0 0 .1-6l1.6-1.1-2-3.4-1.8.7a8 8 0 0 0-5.3-3l-.3-1.9H10l-.3 1.9a8 8 0 0 0-5.3 3l-1.8-.7-2 3.4L2.2 9a7.9 7.9 0 0 0 .1 6l-1.6 1.1 2 3.4 1.8-.7a8 8 0 0 0 5.3 3l.3 1.9h4l.3-1.9a8 8 0 0 0 5.3-3l1.8.7 2-3.4-1.6-1.1Z" />
    </svg>
  );
}

function LogoutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 17v2a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v2" />
      <path d="M3 12h12" />
      <path d="m8 8-5 4 5 4" />
    </svg>
  );
}

function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function AvatarBadge() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-fuchsia-500 text-sm font-semibold text-white shadow-md shadow-violet-200">
      PK
    </div>
  );
}

const sidebarItems = [
  { label: "Dashboard", icon: DashboardIcon, active: true },
  { label: "Upload CSV", icon: UploadCloudIcon },
  { label: "Upload History", icon: ClockIcon },
  { label: "Invoice Results", icon: FileIcon },
  { label: "Processing Jobs", icon: ClockIcon },
  { label: "Profile", icon: AvatarIcon },
  { label: "Settings", icon: SettingsIcon },
  { label: "Logout", icon: LogoutIcon },
];

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

const recentUploads = [
  {
    fileName: "gst_april_2026.csv",
    uploadedOn: "14 Jul 2026, 09:42 AM",
    totalInvoices: 248,
    status: "Completed",
    progress: 100,
    badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  {
    fileName: "vendor_invoices_q2.csv",
    uploadedOn: "14 Jul 2026, 09:18 AM",
    totalInvoices: 184,
    status: "Processing",
    progress: 72,
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  {
    fileName: "purchase_bills_june.csv",
    uploadedOn: "13 Jul 2026, 06:08 PM",
    totalInvoices: 96,
    status: "Failed",
    progress: 34,
    badgeClass: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  {
    fileName: "export_sales_register.csv",
    uploadedOn: "13 Jul 2026, 03:27 PM",
    totalInvoices: 312,
    status: "Completed",
    progress: 100,
    badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
];

function StatusBadge({
  status,
  badgeClass,
}: {
  status: string;
  badgeClass: string;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeClass}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-380">
        <aside className="hidden w-63 shrink-0 border-r border-slate-200 bg-white/95 px-5 py-6 shadow-sm lg:flex lg:flex-col">
          <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
              <LogoMark className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">InvoiceFlow</p>
              <p className="text-sm text-slate-500">Bulk invoice processing</p>
            </div>
          </div>

          <nav className="mt-8 flex flex-1 flex-col gap-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href="#"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    item.active
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-950">Processing health</p>
            <p className="mt-1 text-sm text-slate-500">8 jobs completed today</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[82%] rounded-full bg-linear-to-r from-violet-600 to-fuchsia-500" />
            </div>
            <p className="mt-2 text-xs text-slate-500">82% capacity used</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-6 py-4 lg:px-8">
              <div className="flex items-center gap-3">
                <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden">
                  <MenuIcon className="h-5 w-5" />
                </button>
                <div className="hidden flex-col sm:flex">
                  <span className="text-sm font-medium text-slate-500">Bulk invoice upload</span>
                  <span className="text-lg font-semibold tracking-tight text-slate-950">Dashboard</span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm">
                  <BellIcon className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <AvatarBadge />
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-sm font-semibold text-slate-950">Priya Sharma</p>
                    <p className="truncate text-xs text-slate-500">Apex Finance Pvt. Ltd.</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
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
                      Drag and drop your invoice export into the upload area below. This section is UI-only and designed to reflect a professional SaaS finance workflow.
                    </p>
                  </div>

                  <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-700">
                    <p className="font-semibold">Background processing ready</p>
                    <p className="mt-1 text-violet-600">Uploads will be queued for validation and parsing.</p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border-2 border-dashed border-violet-200 bg-slate-50/80 p-5 sm:p-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                      <UploadCloudIcon className="h-8 w-8 text-violet-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-950">Drag and drop your CSV here</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      Upload a CSV export to review invoice counts, processing progress, and results from your finance workflow.
                    </p>

                    <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700">
                      <UploadCloudIcon className="h-4 w-4" />
                      Choose File
                    </button>

                    <div className="mt-5 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:gap-6">
                      <span>Supports CSV format only</span>
                      <span>Maximum file size: 25 MB</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">Recent Uploads</h2>
                    <p className="mt-1 text-sm text-slate-500">Professional table view of recent invoice CSV uploads.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:self-auto">
                    <ClockIcon className="h-3.5 w-3.5" />
                    Live processing queue
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50/80">
                      <tr>
                        {[
                          "File Name",
                          "Uploaded On",
                          "Total Invoices",
                          "Status",
                          "Progress",
                          "Action",
                        ].map((heading) => (
                          <th key={heading} scope="col" className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 sm:px-6">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {recentUploads.map((upload) => (
                        <tr key={upload.fileName} className="transition-colors hover:bg-slate-50/70">
                          <td className="px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                                <FileIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-950">{upload.fileName}</p>
                                <p className="text-sm text-slate-500">CSV upload</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600 sm:px-6">{upload.uploadedOn}</td>
                          <td className="px-5 py-4 text-sm font-medium text-slate-900 sm:px-6">{upload.totalInvoices.toLocaleString()}</td>
                          <td className="px-5 py-4 sm:px-6">
                            <StatusBadge status={upload.status} badgeClass={upload.badgeClass} />
                          </td>
                          <td className="min-w-55 px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full rounded-full ${
                                    upload.status === "Completed"
                                      ? "bg-linear-to-r from-emerald-500 to-teal-500"
                                      : upload.status === "Failed"
                                        ? "bg-linear-to-r from-rose-500 to-red-500"
                                        : "bg-linear-to-r from-violet-500 to-fuchsia-500"
                                  }`}
                                  style={{ width: `${upload.progress}%` }}
                                />
                              </div>
                              <span className="w-10 text-right text-sm font-medium text-slate-600">{upload.progress}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 sm:px-6">
                            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700">
                              <EyeIcon className="h-4 w-4" />
                              View
                              <ArrowUpRightIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}