"use client";

import {
  FileSpreadsheet,
  MoreHorizontal,
  Download,
  Eye,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import type {
  Upload,
  UploadStatus,
} from "@/app/(dashboard)/history/page";

/* =========================================================
   TYPES
========================================================= */

type Props = {
  uploads: Upload[];
  totalUploads: number;
  page: number;
  totalPages: number;

  onView: (upload: Upload) => void;
  onDownload: (upload: Upload) => void;
  onDelete: (upload: Upload) => void;
  onRetry: (upload: Upload) => void;
  onPageChange: (page: number) => void;
};

/* =========================================================
   CONSTANTS
========================================================= */

const ITEMS_PER_PAGE = 20;

const statusStyles: Record<UploadStatus, string> = {
  Completed:
    "bg-emerald-50 text-emerald-700",
  Processing:
    "bg-blue-50 text-blue-700",
  Queued:
    "bg-amber-50 text-amber-700",
  Failed:
    "bg-red-50 text-red-700",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function HistoryTable({
  uploads,
  totalUploads,
  page,
  totalPages,
  onView,
  onDownload,
  onDelete,
  onRetry,
  onPageChange,
}: Props) {
  const [menuId, setMenuId] =
    useState<string | number | null>(null);

  const [deletingUpload, setDeletingUpload] = useState<Upload | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  /* =======================================================
     PAGINATION
  ======================================================= */

  const startItem =
    totalUploads === 0
      ? 0
      : (page - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(
    page * ITEMS_PER_PAGE,
    totalUploads
  );

  /* =======================================================
     OPEN DETAILS PAGE
  ======================================================= */

  function openDetails(upload: Upload) {
    setMenuId(null);

    router.push(
      `/history/${upload.id}`
    );
  }

  async function handleConfirmDelete() {
    if (!deletingUpload) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/uploads/${deletingUpload.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete upload");
      }
      toast.success("Upload deleted successfully.");
      onDelete(deletingUpload);
      setDeletingUpload(null);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  /* =======================================================
     ROW KEYBOARD HANDLER
  ======================================================= */

  function handleRowKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    upload: Upload
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openDetails(upload);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        mt-3
        overflow-visible
        rounded-[20px]
        border
        border-slate-200
        bg-white
        shadow-[0_2px_8px_rgba(15,23,42,0.04)]
      "
    >
      {/* =================================================
          TABLE HEADER
      ================================================= */}

      <div
        className="
          grid
          grid-cols-12
          items-center
          rounded-t-[20px]
          border-b
          border-slate-200
          bg-slate-50/60
          px-6
          py-3
        "
      >
        <TableHeader className="col-span-4">
          File
        </TableHeader>

        <TableHeader className="col-span-2">
          Uploaded
        </TableHeader>

        <TableHeader
          className="col-span-1"
          align="center"
        >
          Rows
        </TableHeader>

        <TableHeader
          className="col-span-1"
          align="center"
        >
          Success
        </TableHeader>

        <TableHeader
          className="col-span-1"
          align="center"
        >
          Failed
        </TableHeader>

        <TableHeader
          className="col-span-2"
          align="center"
        >
          Status
        </TableHeader>

        <TableHeader
          className="col-span-1"
          align="right"
        >
          Actions
        </TableHeader>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {uploads.length === 0 && (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
              "
            >
              <FileSpreadsheet
                size={22}
                strokeWidth={1.8}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              No uploads found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          TABLE ROWS
      ================================================= */}

      {uploads.map((upload) => (
        <div
          key={upload.id}
          role="button"
          tabIndex={0}
          onClick={() =>
            openDetails(upload)
          }
          onKeyDown={(event) =>
            handleRowKeyDown(
              event,
              upload
            )
          }
          className="
            group
            grid
            min-h-[62px]
            grid-cols-12
            items-center
            border-b
            border-slate-100
            px-6
            py-2
            cursor-pointer
            transition-colors
            last:border-b-0
            hover:bg-slate-50/70
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-blue-500/30
          "
        >
          {/* =================================================
              FILE
          ================================================= */}

          <div
            className="
              col-span-4
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            {/* FILE ICON */}

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-[10px]
                bg-emerald-50
              "
            >
              <FileSpreadsheet
                size={17}
                strokeWidth={1.8}
                className="text-emerald-600"
              />
            </div>

            {/* FILE NAME */}

            <div className="min-w-0">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  openDetails(upload);
                }}
                className="
                  block
                  max-w-full
                  truncate
                  text-left
                  text-sm
                  font-semibold
                  text-slate-900
                  transition-colors
                  group-hover:text-slate-950
                  hover:text-blue-600
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-500/30
                  focus-visible:ring-offset-1
                "
                title="Open CSV details"
              >
                {upload.file}
              </button>

              <p className="mt-0.5 text-xs text-slate-500">
                {upload.size}
              </p>
            </div>
          </div>

          {/* =================================================
              UPLOADED
          ================================================= */}

          <div
            className="
              col-span-2
              truncate
              pr-3
              text-sm
              text-slate-600
            "
          >
            {upload.uploaded}
          </div>

          {/* =================================================
              ROWS
          ================================================= */}

          <div
            className="
              col-span-1
              text-center
              text-sm
              font-semibold
              text-slate-900
            "
          >
            {upload.rows}
          </div>

          {/* =================================================
              SUCCESS
          ================================================= */}

          <div
            className={`
              col-span-1
              text-center
              text-sm
              font-semibold
              ${
                upload.success === "--"
                  ? "text-slate-400"
                  : "text-emerald-600"
              }
            `}
          >
            {upload.success}
          </div>

          {/* =================================================
              FAILED
          ================================================= */}

          <div
            className={`
              col-span-1
              text-center
              text-sm
              font-semibold
              ${
                upload.failed === "--"
                  ? "text-slate-400"
                  : "text-red-500"
              }
            `}
          >
            {upload.failed}
          </div>

          {/* =================================================
              STATUS
          ================================================= */}

          <div
            className="
              col-span-2
              flex
              justify-center
            "
          >
            <span
              className={`
                rounded-full
                px-3
                py-1
                text-[11px]
                font-semibold
                ${statusStyles[upload.status]}
              `}
            >
              {upload.status}
            </span>
          </div>

          {/* =================================================
              ACTIONS
              ONLY "..." IS VISIBLE
          ================================================= */}

          <div
            className="
              relative
              col-span-1
              flex
              justify-end
            "
            onClick={(event) => {
              /*
               * IMPORTANT:
               * Clicking the action area must NOT
               * trigger the row navigation.
               */
              event.stopPropagation();
            }}
          >
            {/* MORE BUTTON */}

            <button
              type="button"
              aria-label={`More options for ${upload.file}`}
              aria-haspopup="menu"
              aria-expanded={
                menuId === upload.id
              }
              onClick={(event) => {
                event.stopPropagation();

                setMenuId(
                  menuId === upload.id
                    ? null
                    : upload.id
                );
              }}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-900
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500/30
              "
              title="More options"
            >
              <MoreHorizontal
                size={18}
                strokeWidth={1.8}
              />
            </button>

            {/* =================================================
                DROPDOWN
            ================================================= */}

            {menuId === upload.id && (
              <div
                role="menu"
                className="
                  absolute
                  right-0
                  top-[38px]
                  z-50
                  w-44
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-1.5
                  shadow-[0_12px_30px_rgba(15,23,42,0.12)]
                "
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                {/* VIEW */}

                <MenuButton
                  icon={
                    <Eye
                      size={15}
                      strokeWidth={1.8}
                    />
                  }
                  label="View details"
                  onClick={() => {
                    openDetails(upload);
                  }}
                />

                {/* DOWNLOAD */}

                <MenuButton
                  icon={
                    <Download
                      size={15}
                      strokeWidth={1.8}
                    />
                  }
                  label="Download"
                  onClick={() => {
                    onDownload(upload);
                    setMenuId(null);
                  }}
                />

                {/* RETRY */}

                {(upload.status ===
                  "Failed" ||
                  upload.status ===
                    "Queued") && (
                  <MenuButton
                    icon={
                      <RotateCcw
                        size={15}
                        strokeWidth={1.8}
                      />
                    }
                    label="Retry upload"
                    onClick={() => {
                      onRetry(upload);
                      setMenuId(null);
                    }}
                  />
                )}

                {/* DIVIDER */}

                <div className="my-1 border-t border-slate-100" />

                {/* DELETE */}

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setDeletingUpload(upload);
                    setMenuId(null);
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2
                    text-left
                    text-sm
                    text-red-600
                    transition
                    hover:bg-red-50
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500/20
                  "
                >
                  <Trash2
                    size={15}
                    strokeWidth={1.8}
                  />

                  Delete upload
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* =================================================
          FOOTER / PAGINATION
      ================================================= */}

      <div
        className="
          flex
          min-h-[60px]
          items-center
          justify-between
          gap-4
          rounded-b-[20px]
          border-t
          border-slate-200
          px-6
          py-3
        "
      >
        {/* RESULT COUNT */}

        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {startItem}–{endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {totalUploads}
          </span>{" "}
          uploads
        </p>

        {/* PAGINATION */}

        <div className="flex items-center gap-2">
          {/* PREVIOUS */}

          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              onPageChange(
                Math.max(
                  1,
                  page - 1
                )
              )
            }
            className="
              rounded-xl
              border
              border-slate-200
              px-3
              py-2
              text-sm
              text-slate-600
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Previous
          </button>

          {/* PAGE NUMBERS */}

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) =>
              index + 1
          )
            .filter(
              (pageNumber) => {
                if (
                  totalPages <= 5
                ) {
                  return true;
                }

                if (page <= 3) {
                  return (
                    pageNumber <= 5
                  );
                }

                if (
                  page >=
                  totalPages - 2
                ) {
                  return (
                    pageNumber >=
                    totalPages - 4
                  );
                }

                return (
                  pageNumber >=
                    page - 2 &&
                  pageNumber <=
                    page + 2
                );
              }
            )
            .map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() =>
                  onPageChange(
                    pageNumber
                  )
                }
                className={`
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  transition
                  ${
                    pageNumber === page
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                {pageNumber}
              </button>
            ))}

          {/* NEXT */}

          <button
            type="button"
            disabled={
              page === totalPages
            }
            onClick={() =>
              onPageChange(
                Math.min(
                  totalPages,
                  page + 1
                )
              )
            }
            className="
              rounded-xl
              border
              border-slate-200
              px-3
              py-2
              text-sm
              text-slate-600
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Next
          </button>
        </div>
      </div>

      <Dialog open={!!deletingUpload} onOpenChange={(open) => !open && !isDeleting && setDeletingUpload(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={24} strokeWidth={1.5} />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl">Delete upload?</DialogTitle>
              <DialogDescription className="mt-2 text-slate-500">
                You&apos;re about to permanently delete this upload and its associated invoices. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </div>

          {deletingUpload && (
            <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <FileSpreadsheet size={16} className="text-slate-400" />
                <span className="truncate">{deletingUpload.file}</span>
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {deletingUpload.rows} rows &middot; {deletingUpload.success} successful &middot; {deletingUpload.failed} failed
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 flex gap-2 sm:justify-between">
            <Button variant="outline" disabled={isDeleting} onClick={() => setDeletingUpload(null)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="destructive" disabled={isDeleting} onClick={handleConfirmDelete} className="w-full bg-red-600 text-white hover:bg-red-700 sm:w-auto">
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =========================================================
   MENU BUTTON
========================================================= */

function MenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        gap-2
        rounded-lg
        px-3
        py-2
        text-left
        text-sm
        text-slate-700
        transition
        hover:bg-slate-50
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-500/20
      "
    >
      {icon}

      {label}
    </button>
  );
}

/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({
  children,
  className = "",
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}) {
  return (
    <div
      className={`
        text-xs
        font-semibold
        uppercase
        tracking-wide
        text-slate-500
        ${
          align === "center"
            ? "text-center"
            : align === "right"
              ? "text-right"
              : "text-left"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}