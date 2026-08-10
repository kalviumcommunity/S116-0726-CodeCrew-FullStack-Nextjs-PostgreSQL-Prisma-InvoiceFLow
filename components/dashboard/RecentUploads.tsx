import {
  ArrowRight,
  FileSpreadsheet,
  MoreHorizontal,
} from "lucide-react";

const uploads = [
  {
    file: "invoices_jun_2025.csv",
    rows: "24,580",
    success: "23,870",
    failed: "530",
    status: "Processing",
    date: "12 Jun 2025",
  },
  {
    file: "invoices_may_2025.csv",
    rows: "18,240",
    success: "17,628",
    failed: "612",
    status: "Completed",
    date: "11 Jun 2025",
  },
  {
    file: "invoices_apr_2025.csv",
    rows: "22,310",
    success: "21,502",
    failed: "808",
    status: "Completed",
    date: "10 Jun 2025",
  },
  {
    file: "invoices_mar_2025.csv",
    rows: "12,980",
    success: "12,645",
    failed: "335",
    status: "Completed",
    date: "09 Jun 2025",
  },
];

export default function RecentUploads() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recent Uploads
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Latest processed CSV files
          </p>
        </div>

        <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
          View All

          <ArrowRight size={15} />
        </button>
      </div>

      {/* Table */}

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3 font-semibold">
              File
            </th>

            <th>Rows</th>

            <th>Success</th>

            <th>Failed</th>

            <th>Status</th>

            <th>Uploaded</th>

            <th></th>
          </tr>
        </thead>

        <tbody>
          {uploads.map((upload) => (
            <tr
              key={upload.file}
              className="border-b border-slate-100 transition hover:bg-slate-50"
            >
              {/* File */}

              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                    <FileSpreadsheet
                      size={18}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {upload.file}
                    </p>

                    <p className="text-xs text-slate-500">
                      Invoice CSV
                    </p>
                  </div>
                </div>
              </td>

              {/* Rows */}

              <td className="text-sm font-medium text-slate-700">
                {upload.rows}
              </td>

              {/* Success */}

              <td className="text-sm font-semibold text-green-600">
                {upload.success}
              </td>

              {/* Failed */}

              <td className="text-sm font-semibold text-red-500">
                {upload.failed}
              </td>

              {/* Status */}

              <td>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    upload.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />

                  {upload.status}
                </span>
              </td>

              {/* Date */}

              <td className="text-sm text-slate-500">
                {upload.date}
              </td>

              {/* Menu */}

              <td>
                <button className="rounded-lg p-2 transition hover:bg-slate-100">
                  <MoreHorizontal
                    size={16}
                    className="text-slate-500"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}