export default function StatusBadge({
  status,
}: {
  status: string;
}) {
  const colors = {
    Match: "bg-green-100 text-green-700",
    Mismatch: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
    Processing: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        colors[status as keyof typeof colors]
      }`}
    >
      {status}
    </span>
  );
}