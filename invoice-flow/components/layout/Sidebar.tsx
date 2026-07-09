import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r p-4">
      <nav className="flex flex-col gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/uploads">Uploads</Link>
        <Link href="/history">History</Link>
      </nav>
    </aside>
  );
}