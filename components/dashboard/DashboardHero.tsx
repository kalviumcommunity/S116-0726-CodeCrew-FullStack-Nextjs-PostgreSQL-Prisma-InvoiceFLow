"use client";

import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";

type DateFilter =
  | "All time"
  | "Today"
  | "Yesterday"
  | "This month"
  | "Custom range";

export default function DashboardHero() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] =
    useState<DateFilter>("All time");

  const [pendingFilter, setPendingFilter] =
    useState<DateFilter>("All time");

  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
        setPendingFilter(selectedFilter);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [selectedFilter]);

  const filters: DateFilter[] = [
    "All time",
    "Today",
    "Yesterday",
    "This month",
    "Custom range",
  ];

  const handleApply = () => {
    if (
      pendingFilter === "Custom range" &&
      (!customFrom || !customTo)
    ) {
      return;
    }

    setSelectedFilter(pendingFilter);
    setFilterOpen(false);
  };

  const handleFilterOpen = () => {
    setPendingFilter(selectedFilter);
    setFilterOpen((prev) => !prev);
  };

  return (
    <section className="mb-6 flex items-center justify-between">
      {/* =====================================================
          LEFT
      ===================================================== */}

      <div>
        <h1 className="text-[20px] font-semibold tracking-[-0.03em] text-slate-900">
          Good morning, Khushal 👋
        </h1>

        <p className="mt-1 text-[13px] text-slate-500">
          Monitor uploads, validation and invoice processing
          from one clean workspace.
        </p>
      </div>

      {/* =====================================================
          RIGHT
      ===================================================== */}

      <div className="flex items-center gap-2.5">
        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="flex h-10 w-[240px] items-center rounded-full border border-slate-200 bg-white px-4 transition-colors focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
          <Search
            size={16}
            strokeWidth={1.8}
            className="shrink-0 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search invoices..."
            className="
              ml-2.5
              flex-1
              bg-transparent
              text-[13px]
              text-slate-700
              outline-none
              placeholder:text-slate-400
            "
          />
        </div>

        {/* =================================================
            FILTER
        ================================================= */}

        <div
          ref={filterRef}
          className="relative"
        >
          <button
            type="button"
            onClick={handleFilterOpen}
            className={`
              flex
              h-10
              items-center
              gap-2
              rounded-full
              border
              px-4
              text-[13px]
              font-medium
              transition-all
              duration-200
              ${
                filterOpen || selectedFilter !== "All time"
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }
            `}
          >
            <SlidersHorizontal
              size={15}
              strokeWidth={1.8}
            />

            <span>
              {selectedFilter === "All time"
                ? "Filter"
                : selectedFilter}
            </span>
          </button>

          {/* =================================================
              FILTER DROPDOWN
          ================================================= */}

          {filterOpen && (
            <div
              className="
                absolute
                right-0
                top-[calc(100%+8px)]
                z-50
                w-[230px]
                overflow-hidden
                rounded-[16px]
                border
                border-slate-200
                bg-white
                p-2
                shadow-[0_14px_40px_rgba(15,23,42,0.12)]
              "
            >
              {/* Header */}

              <div className="px-3 pb-2 pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-400">
                  Filter by date
                </p>
              </div>

              {/* Options */}

              <div className="space-y-0.5">
                {filters.map((filter) => {
                  const selected =
                    pendingFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        setPendingFilter(filter)
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-[10px]
                        px-3
                        py-2.5
                        text-left
                        text-[13px]
                        transition-colors
                        ${
                          selected
                            ? "bg-blue-50 font-medium text-blue-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      <span>{filter}</span>

                      {selected && (
                        <Check
                          size={14}
                          strokeWidth={2.2}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* =================================================
                  CUSTOM RANGE
              ================================================= */}

              {pendingFilter === "Custom range" && (
                <div className="mt-2 border-t border-slate-100 pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-slate-500">
                        From
                      </label>

                      <input
                        type="date"
                        value={customFrom}
                        onChange={(event) =>
                          setCustomFrom(
                            event.target.value
                          )
                        }
                        className="
                          h-9
                          w-full
                          rounded-[9px]
                          border
                          border-slate-200
                          bg-white
                          px-2
                          text-[11px]
                          text-slate-600
                          outline-none
                          transition
                          focus:border-blue-300
                          focus:ring-2
                          focus:ring-blue-50
                        "
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-slate-500">
                        To
                      </label>

                      <input
                        type="date"
                        value={customTo}
                        onChange={(event) =>
                          setCustomTo(
                            event.target.value
                          )
                        }
                        className="
                          h-9
                          w-full
                          rounded-[9px]
                          border
                          border-slate-200
                          bg-white
                          px-2
                          text-[11px]
                          text-slate-600
                          outline-none
                          transition
                          focus:border-blue-300
                          focus:ring-2
                          focus:ring-blue-50
                        "
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  APPLY
              ================================================= */}

              <div className="mt-3 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={
                    pendingFilter === "Custom range" &&
                    (!customFrom || !customTo)
                  }
                  className="
                    flex
                    h-9
                    w-full
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-[#0f172a]
                    text-[12px]
                    font-semibold
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[#1e293b]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}