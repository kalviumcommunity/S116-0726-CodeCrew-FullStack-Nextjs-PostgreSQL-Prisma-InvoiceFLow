"use client";

import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

interface NavbarProps {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  hideSearch?: boolean;
}

export default function Navbar({ title, subtitle, rightSlot, hideSearch }: NavbarProps) {
  const [query, setQuery] = useState('');
  const [openNotifications, setOpenNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const notifications = [
    { id: 1, title: 'July_Invoices.csv completed successfully', time: '2h' },
    { id: 2, title: 'GST_April.csv uploaded', time: '6h' },
    { id: 3, title: 'Vendor_Bills.csv failed validation', time: '1d' },
    { id: 4, title: 'Processing job completed', time: '2d' },
  ];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!notifRef.current) return;
      if (!notifRef.current.contains(e.target as Node)) {
        setOpenNotifications(false);
      }
    }

    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenNotifications(false);
    }

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-slate-500">InvoiceFlow</p>
          <h1 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h1>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>

        <div className="flex items-center gap-3">
          {!hideSearch ? (
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                aria-label="Search invoices"
                placeholder="Search invoices"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    // frontend-only: just focus behavior or console log
                    console.log('Search:', query);
                  }
                }}
                className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          ) : null}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setOpenNotifications((s) => !s)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"
              aria-label="Notifications"
              aria-expanded={openNotifications}
            >
              <Bell className="h-4 w-4" />
            </button>

            {openNotifications ? (
              <div className="absolute right-0 z-30 mt-2 w-80 max-w-xs rounded-lg border border-slate-200 bg-white shadow-lg">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-slate-50">
                      <p className="text-sm text-slate-900">{n.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{n.time} ago</p>
                    </div>
                  ))}
                </div>
                <div className="px-3 py-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setOpenNotifications(false)}
                    className="text-sm text-slate-600 hover:text-slate-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : null}
          </div>
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