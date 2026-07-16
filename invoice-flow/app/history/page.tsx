"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  BadgeCheck,
  Clock3,
  FileSpreadsheet,
  FolderOpen,
  Search,
  Upload,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { uploads } from "@/data/uploads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const uploadRecords = uploads;

const summaryCards = [
  {
    label: "Total Uploads",
    value: uploadRecords.length,
    icon: FileSpreadsheet,
    tone: "text-slate-700",
  },
  {
    label: "Processing",
    value: uploadRecords.filter((item) => item.status === "PROCESSING").length,
    icon: Clock3,
    tone: "text-amber-600",
  },
  {
    label: "Completed",
    value: uploadRecords.filter((item) => item.status === "COMPLETED").length,
    icon: BadgeCheck,
    tone: "text-emerald-600",
  },
  {
    label: "Failed",
    value: uploadRecords.filter((item) => item.status === "FAILED").length,
    icon: AlertCircle,
    tone: "text-rose-600",
  },
];

function getStatusBadge(status: (typeof uploadRecords)[number]["status"]) {
  switch (status) {
    case "PROCESSING":
      return <Badge variant="warning">PROCESSING</Badge>;
    case "COMPLETED":
      return <Badge variant="success">COMPLETED</Badge>;
    default:
      return <Badge variant="destructive">FAILED</Badge>;
  }
}

function UploadHistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <Skeleton className="mb-3 h-4 w-20" />
              <Skeleton className="mb-2 h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading] = useState(false);

  const filteredRecords = useMemo(() => {
    return uploadRecords.filter((record) => {
      const matchesSearch = record.fileName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || record.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  if (loading) {
    return (
      <AppShell title="Upload History" subtitle="View and monitor all previously uploaded invoice files.">
        <UploadHistorySkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell title="Upload History" subtitle="View and monitor all previously uploaded invoice files.">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Upload History
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View and monitor all previously uploaded invoice files.
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/uploads">
              <Upload className="mr-2 h-4 w-4" />
              Upload New CSV
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{card.label}</p>
                      <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
                    </div>
                    <div className={`rounded-full bg-slate-50 p-3 ${card.tone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl">Recent Uploads</CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                Track processing progress and inspect historical file outcomes.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search filename"
                  className="w-full pl-9 sm:w-56"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full sm:w-44"
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-600">
                  <FolderOpen className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No uploads found</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Try another search term or upload your first CSV to get started.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/uploads">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload your first CSV
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Total Rows</TableHead>
                        <TableHead>Success</TableHead>
                        <TableHead>Failed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium text-slate-900">{record.fileName}</TableCell>
                          <TableCell>{record.uploadDate}</TableCell>
                          <TableCell>{record.totalRows}</TableCell>
                          <TableCell>{record.success}</TableCell>
                          <TableCell>{record.failed}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/uploads/${record.id}`}>
                                View
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-4 p-4 lg:hidden">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{record.fileName}</p>
                          <p className="mt-1 text-sm text-slate-500">{record.uploadDate}</p>
                        </div>
                        {getStatusBadge(record.status)}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                        <div>
                          <p className="text-slate-400">Total Rows</p>
                          <p className="font-medium text-slate-900">{record.totalRows}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Success</p>
                          <p className="font-medium text-slate-900">{record.success}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Failed</p>
                          <p className="font-medium text-slate-900">{record.failed}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Status</p>
                          <p className="font-medium text-slate-900">{record.status}</p>
                        </div>
                      </div>
                      <Button asChild variant="outline" className="mt-4 w-full" size="sm">
                        <Link href={`/uploads/${record.id}`}>
                          View
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
