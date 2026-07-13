import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_55%),linear-gradient(135deg,_#020617,_#0f172a)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-16">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/50 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden flex-col justify-between bg-slate-950/70 p-10 lg:flex">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
                InvoiceFlow
              </p>
              <h2 className="mt-6 text-4xl font-semibold leading-tight text-white">
                Process bulk invoices with confidence.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-400">
                Upload CSV invoices, monitor background processing, and review row-level validation results in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-sm text-slate-300">
              <p className="font-medium text-white">Built for finance operations</p>
              <ul className="mt-3 space-y-2 text-slate-400">
                <li>• Track processing progress in real time</li>
                <li>• Review match and mismatch invoice statuses</li>
                <li>• Keep upload history and validation errors organised</li>
              </ul>
            </div>
          </section>

          <section className="flex items-center justify-center p-8 sm:p-10">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
