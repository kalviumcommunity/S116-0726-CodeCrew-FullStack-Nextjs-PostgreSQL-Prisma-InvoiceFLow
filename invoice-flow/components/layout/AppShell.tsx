'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type AppShellProps = {
    children: ReactNode;
    title: string;
    subtitle?: string;
    rightSlot?: ReactNode;
};

export default function AppShell({ children, title, subtitle, rightSlot }: AppShellProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="flex min-h-screen flex-col lg:flex-row">
                <Sidebar pathname={pathname} />
                <div className="flex min-w-0 flex-1 flex-col">
                    <Navbar title={title} subtitle={subtitle} rightSlot={rightSlot} />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}
