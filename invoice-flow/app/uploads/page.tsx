export default function UploadsPage() {
  const uploads = [
    {
      file: "invoices_july_2026.csv",
      uploadedAt: "13 Jul 2026, 10:24 AM",
      status: "Processing",
      rows: 5000,
    },
    {
      file: "gst_report.csv",
      uploadedAt: "12 Jul 2026, 04:15 PM",
      status: "Completed",
      rows: 3200,
    },
    {
      file: "invoice_batch_q2.csv",
      uploadedAt: "11 Jul 2026, 09:30 AM",
      status: "Failed",
      rows: 1800,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Upload Invoices
          </h1>
          <p className="mt-2 text-gray-600">
            Upload CSV files and monitor invoice processing progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Uploads</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-green-600">8</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Processing</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">4</p>
          </div>
        </div>

        {/* Upload Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Upload CSV File
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Supported format: CSV • Maximum rows: 5000
          </p>

          <div className="mt-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <div className="mb-4 text-4xl">📄</div>

            <p className="text-lg font-medium text-gray-700">
              Drag & Drop CSV File Here
            </p>

            <p className="mt-2 text-sm text-gray-500">
              or select a file from your computer
            </p>

            <input
              type="file"
              accept=".csv"
              className="mx-auto mt-6 block"
            />

            <button className="mt-4 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700">
              Upload File
            </button>
          </div>
        </div>

        {/* Upload History */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Invoice Upload History
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    File Name
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Uploaded At
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Rows
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {uploads.map((upload) => (
                  <tr
                    key={upload.file}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-gray-900">
                      {upload.file}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {upload.uploadedAt}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {upload.rows}
                    </td>

                    <td className="px-4 py-4">
                      {upload.status === "Processing" && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          Processing
                        </span>
                      )}

                      {upload.status === "Completed" && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Completed
                        </span>
                      )}

                      {upload.status === "Failed" && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}