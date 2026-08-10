"use client";

import {
  Search,
  ChevronDown,
  Calendar,
  Download,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* =========================================================
   TYPES
========================================================= */

export type StatusFilter =
  | "All Status"
  | "Completed"
  | "Processing"
  | "Queued"
  | "Failed";

export type DateFilter =
  | "All Dates"
  | "Last 7 Days"
  | "Last 30 Days"
  | "Custom Range";

export type SortFilter =
  | "Newest First"
  | "Oldest First";

interface HistoryToolbarProps {
  search: string;

  status: StatusFilter;

  dateRange: DateFilter;

  sort: SortFilter;

  customFrom: string;

  customTo: string;

  onSearch: (
    value: string
  ) => void;

  onStatusChange: (
    value: StatusFilter
  ) => void;

  onDateChange: (
    value: DateFilter
  ) => void;

  onCustomRange: (
    from: string,
    to: string
  ) => void;

  onSortChange: (
    value: SortFilter
  ) => void;

  onExport: () => void;
}

type OpenMenu =
  | "status"
  | "date"
  | "sort"
  | null;

/* =========================================================
   COMPONENT
========================================================= */

export default function HistoryToolbar({
  search,
  status,
  dateRange,
  sort,
  customFrom,
  customTo,
  onSearch,
  onStatusChange,
  onDateChange,
  onCustomRange,
  onSortChange,
  onExport,
}: HistoryToolbarProps) {
  const [openMenu, setOpenMenu] =
    useState<OpenMenu>(null);

  const toolbarRef =
    useRef<HTMLDivElement>(null);

  /* =======================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =======================================================
     TOGGLE MENU
  ======================================================= */

  function toggleMenu(
    menu: Exclude<OpenMenu, null>
  ) {
    setOpenMenu((current) =>
      current === menu
        ? null
        : menu
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={toolbarRef}
      className="
        mt-3
        w-full
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-3
        shadow-[0_2px_8px_rgba(15,23,42,0.04)]
      "
    >
      <div
        className="
          flex
          w-full
          items-center
          gap-3
        "
      >
        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          className="
            flex
            h-10
            w-[310px]
            shrink-0
            items-center
            rounded-full
            border
            border-slate-200
            bg-white
            px-4
            transition
            focus-within:border-blue-400
            focus-within:ring-2
            focus-within:ring-blue-50
          "
        >
          <Search
            size={17}
            strokeWidth={1.8}
            className="
              shrink-0
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearch(
                event.target.value
              )
            }
            placeholder="Search uploads..."
            className="
              ml-3
              min-w-0
              flex-1
              bg-transparent
              text-sm
              text-slate-700
              outline-none
              placeholder:text-slate-400
            "
          />
        </div>

        {/* =================================================
            STATUS
        ================================================= */}

        <FilterButton
          label={status}
          icon={
            <SlidersHorizontal
              size={15}
              strokeWidth={1.8}
            />
          }
          active={
            status !== "All Status"
          }
          open={
            openMenu === "status"
          }
          onClick={() =>
            toggleMenu("status")
          }
        >
          <MenuItem
            label="All Status"
            selected={
              status === "All Status"
            }
            onClick={() => {
              onStatusChange(
                "All Status"
              );

              setOpenMenu(null);
            }}
          />

          <MenuItem
            label="Completed"
            selected={
              status === "Completed"
            }
            onClick={() => {
              onStatusChange(
                "Completed"
              );

              setOpenMenu(null);
            }}
          />

          <MenuItem
            label="Processing"
            selected={
              status === "Processing"
            }
            onClick={() => {
              onStatusChange(
                "Processing"
              );

              setOpenMenu(null);
            }}
          />

          <MenuItem
            label="Queued"
            selected={
              status === "Queued"
            }
            onClick={() => {
              onStatusChange(
                "Queued"
              );

              setOpenMenu(null);
            }}
          />

          <MenuItem
            label="Failed"
            selected={
              status === "Failed"
            }
            onClick={() => {
              onStatusChange(
                "Failed"
              );

              setOpenMenu(null);
            }}
          />
        </FilterButton>

        {/* =================================================
            DATE RANGE
        ================================================= */}

        <FilterButton
          /*
           * IMPORTANT:
           * Show the actual selected value.
           *
           * Default = "All Dates"
           */
          label={dateRange}
          icon={
            <Calendar
              size={15}
              strokeWidth={1.8}
            />
          }
          active={
            dateRange !== "All Dates"
          }
          open={
            openMenu === "date"
          }
          onClick={() =>
            toggleMenu("date")
          }
        >
          {/* ALL DATES */}

          <MenuItem
            label="All Dates"
            selected={
              dateRange === "All Dates"
            }
            onClick={() => {
              onDateChange(
                "All Dates"
              );

              setOpenMenu(null);
            }}
          />

          {/* LAST 7 DAYS */}

          <MenuItem
            label="Last 7 Days"
            selected={
              dateRange ===
              "Last 7 Days"
            }
            onClick={() => {
              onDateChange(
                "Last 7 Days"
              );

              setOpenMenu(null);
            }}
          />

          {/* LAST 30 DAYS */}

          <MenuItem
            label="Last 30 Days"
            selected={
              dateRange ===
              "Last 30 Days"
            }
            onClick={() => {
              onDateChange(
                "Last 30 Days"
              );

              setOpenMenu(null);
            }}
          />

          {/* CUSTOM RANGE */}

          <MenuItem
            label="Custom Range"
            selected={
              dateRange ===
              "Custom Range"
            }
            onClick={() => {
              onDateChange(
                "Custom Range"
              );
            }}
          />

          {/* =================================================
              CUSTOM RANGE PANEL
          ================================================= */}

          {dateRange ===
            "Custom Range" && (
            <div
              className="
                mt-1
                border-t
                border-slate-100
                p-2
              "
            >
              <p
                className="
                  mb-2
                  px-1
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Select dates
              </p>

              <div className="space-y-2">

                {/* FROM */}

                <div>
                  <label
                    className="
                      mb-1
                      block
                      px-1
                      text-[11px]
                      font-medium
                      text-slate-500
                    "
                  >
                    From
                  </label>

                  <input
                    type="date"
                    value={
                      customFrom
                    }
                    onChange={(
                      event
                    ) =>
                      onCustomRange(
                        event.target.value,
                        customTo
                      )
                    }
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-2
                      text-xs
                      text-slate-700
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />
                </div>

                {/* TO */}

                <div>
                  <label
                    className="
                      mb-1
                      block
                      px-1
                      text-[11px]
                      font-medium
                      text-slate-500
                    "
                  >
                    To
                  </label>

                  <input
                    type="date"
                    value={
                      customTo
                    }
                    min={
                      customFrom ||
                      undefined
                    }
                    onChange={(
                      event
                    ) =>
                      onCustomRange(
                        customFrom,
                        event.target.value
                      )
                    }
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-2
                      text-xs
                      text-slate-700
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />
                </div>

                {/* APPLY */}

                <button
                  type="button"
                  disabled={
                    !customFrom ||
                    !customTo
                  }
                  onClick={() =>
                    setOpenMenu(null)
                  }
                  className="
                    mt-1
                    flex
                    h-9
                    w-full
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-600
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Apply Range
                </button>
              </div>
            </div>
          )}
        </FilterButton>

        {/* =================================================
            SORT
        ================================================= */}

        <FilterButton
          label={sort}
          icon={
            <ArrowUpDown
              size={15}
              strokeWidth={1.8}
            />
          }
          open={
            openMenu === "sort"
          }
          onClick={() =>
            toggleMenu("sort")
          }
        >
          <MenuItem
            label="Newest First"
            selected={
              sort ===
              "Newest First"
            }
            onClick={() => {
              onSortChange(
                "Newest First"
              );

              setOpenMenu(null);
            }}
          />

          <MenuItem
            label="Oldest First"
            selected={
              sort ===
              "Oldest First"
            }
            onClick={() => {
              onSortChange(
                "Oldest First"
              );

              setOpenMenu(null);
            }}
          />
        </FilterButton>

        {/* =================================================
            EXPORT
        ================================================= */}

        <button
          type="button"
          onClick={onExport}
          className="
            ml-auto
            flex
            h-10
            shrink-0
            items-center
            gap-2
            rounded-full
            bg-blue-600
            px-5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
            active:scale-[0.98]
          "
        >
          <Download
            size={16}
            strokeWidth={1.9}
          />

          <span>
            Export CSV
          </span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   FILTER BUTTON
   SAME DESIGN AS InvoiceToolbar
========================================================= */

function FilterButton({
  label,
  icon,
  active = false,
  open,
  onClick,
  children,
}: {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  open: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const isHighlighted =
    open || active;

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onClick}
        className={`
          flex
          h-10
          items-center
          gap-2
          rounded-full
          border
          bg-white
          px-4
          text-sm
          font-medium
          transition
          ${
            isHighlighted
              ? "border-blue-500 text-blue-700 ring-1 ring-blue-100"
              : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          }
        `}
      >
        {icon && (
          <span
            className={
              isHighlighted
                ? "text-blue-600"
                : "text-slate-500"
            }
          >
            {icon}
          </span>
        )}

        <span className="whitespace-nowrap">
          {label}
        </span>

        <ChevronDown
          size={15}
          strokeWidth={1.8}
          className={`
            ml-0.5
            text-slate-400
            transition-transform
            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      {/* =================================================
          DROPDOWN
      ================================================= */}

      {open && (
        <div
          className="
            absolute
            left-0
            top-[46px]
            z-50
            w-[190px]
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-1.5
            shadow-[0_12px_30px_rgba(15,23,42,0.12)]
          "
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MENU ITEM
========================================================= */

function MenuItem({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        justify-between
        rounded-xl
        px-3
        py-2.5
        text-left
        text-sm
        transition
        ${
          selected
            ? "bg-blue-50 font-semibold text-blue-700"
            : "text-slate-700 hover:bg-slate-50"
        }
      `}
    >
      <span>
        {label}
      </span>

      {selected && (
        <Check
          size={15}
          strokeWidth={2}
          className="text-blue-600"
        />
      )}
    </button>
  );
}