import Link from 'next/link';
import { ArrowUpRight, CircleUserRound, FileText, History, LayoutGrid, Settings, UploadCloud, Workflow } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/upload', label: 'Upload CSV', icon: UploadCloud },
  { href: '/history', label: 'History', icon: History },
  { href: '/processing-jobs', label: 'Processing Jobs', icon: Workflow },
  { href: '/profile', label: 'Profile', icon: CircleUserRound },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  pathname: string;
}

export default function Sidebar({ pathname }: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/95 px-5 py-6 shadow-sm lg:flex lg:flex-col">
      <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">InvoiceFlow</p>
          <p className="text-sm text-slate-500">Bulk invoice processing</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-950">Processing health</p>
          <ArrowUpRight className="h-4 w-4 text-slate-500" />
        </div>
        <p className="mt-1 text-sm text-slate-500">8 jobs completed today</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" />
        </div>
        <p className="mt-2 text-xs text-slate-500">82% capacity used</p>
      </div>
    </aside>
  );
}