import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import type { ReactNode } from 'react';

interface NavbarProps {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

export default function Navbar({ title, subtitle, rightSlot }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-slate-500">InvoiceFlow</p>
          <h1 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h1>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm sm:flex">
            <Search className="h-4 w-4" />
            <span>Search invoices</span>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          {rightSlot ? <div>{rightSlot}</div> : null}
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-semibold text-white">
              PS
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-900">Priya Sharma</p>
              <p className="text-xs text-slate-500">Operations Lead</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}