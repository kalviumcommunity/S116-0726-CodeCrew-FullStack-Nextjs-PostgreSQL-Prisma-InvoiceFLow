import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 border-r p-4 flex-col gap-4">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/uploads">Uploads</Link>
      <Link href="/history">History</Link>
    </aside>
  );
}