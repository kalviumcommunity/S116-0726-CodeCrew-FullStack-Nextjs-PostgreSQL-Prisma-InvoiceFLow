"use client";

import { useState } from "react";
import {
  X,
  Clock3,
  CircleCheck,
  AlertCircle,
  Activity as ActivityIcon,
} from "lucide-react";

const activities = [
  {
    title: "Processing Started",
    description: "CSV upload initiated",
    time: "2 min ago",
    color: "bg-blue-500",
    type: "info",
  },
  {
    title: "520 Invoices Processed",
    description: "Batch processing completed",
    time: "1 min ago",
    color: "bg-orange-500",
    type: "info",
  },
  {
    title: "8 Failed Rows",
    description: "GST mismatch detected",
    time: "45 sec ago",
    color: "bg-red-500",
    type: "error",
  },
  {
    title: "Validation Complete",
    description: "Ready for matching",
    time: "Now",
    color: "bg-green-500",
    type: "success",
  },
  {
    title: "Invoice Matching Started",
    description: "Preparing invoice matching",
    time: "Now",
    color: "bg-blue-500",
    type: "info",
  },
];

export default function Activity() {
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      {/* =====================================================
          RECENT ACTIVITY
      ===================================================== */}

      <section
        className="
          flex
          min-h-[405px]
          flex-col
          rounded-[20px]
          border
          border-slate-200
          bg-white
          p-6
          shadow-[0_4px_18px_rgba(15,23,42,0.035)]
        "
      >
        {/* HEADER */}

        <div className="flex items-start justify-between">
          <div>
            <h2
              className="
                text-[18px]
                font-semibold
                tracking-[-0.03em]
                text-slate-900
              "
            >
              Recent Activity
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              Live processing events
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="
              text-[12px]
              font-medium
              text-blue-600
              transition
              hover:text-blue-700
              active:scale-[0.98]
            "
          >
            View All
          </button>
        </div>

        {/* TIMELINE */}

        <div className="mt-6 space-y-5">
          {activities.map((item, index) => (
            <div
              key={index}
              className="relative flex gap-3.5"
            >
              {/* Timeline */}

              <div
                className="
                  relative
                  flex
                  w-3
                  shrink-0
                  flex-col
                  items-center
                "
              >
                <span
                  className={`
                    mt-1
                    h-2.5
                    w-2.5
                    shrink-0
                    rounded-full
                    ${item.color}
                  `}
                />

                {index !== activities.length - 1 && (
                  <span
                    className="
                      absolute
                      top-4
                      h-[46px]
                      w-px
                      bg-slate-200
                    "
                  />
                )}
              </div>

              {/* CONTENT */}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p
                    className="
                      truncate
                      text-[13px]
                      font-medium
                      text-slate-900
                    "
                  >
                    {item.title}
                  </p>

                  <span
                    className="
                      shrink-0
                      text-[11px]
                      font-normal
                      text-slate-400
                    "
                  >
                    {item.time}
                  </span>
                </div>

                <p
                  className="
                    mt-1
                    text-[12px]
                    font-normal
                    leading-4
                    text-slate-500
                  "
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          ALL ACTIVITY MODAL
      ===================================================== */}

      {showAll && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/20
            px-5
            backdrop-blur-[2px]
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAll(false);
            }
          }}
        >
          <div
            className="
              w-full
              max-w-[560px]
              overflow-hidden
              rounded-[20px]
              border
              border-slate-200
              bg-white
              shadow-[0_25px_80px_rgba(15,23,42,0.18)]
            "
          >
            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-100
                px-6
                py-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-[12px]
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <ActivityIcon
                    size={19}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h3
                    className="
                      text-[17px]
                      font-semibold
                      tracking-[-0.025em]
                      text-slate-900
                    "
                  >
                    Recent Activity
                  </h3>

                  <p className="mt-1 text-[12px] text-slate-500">
                    All recent processing events
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                <X size={17} />
              </button>
            </div>

            {/* ACTIVITY LIST */}

            <div className="max-h-[440px] overflow-y-auto px-6 py-5">
              <div className="space-y-6">
                {activities.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex gap-4"
                  >
                    {/* ICON */}

                    <div className="relative shrink-0">
                      {item.type === "error" ? (
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-red-50
                          "
                        >
                          <AlertCircle
                            size={17}
                            className="text-red-500"
                          />
                        </div>
                      ) : item.type === "success" ? (
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-emerald-50
                          "
                        >
                          <CircleCheck
                            size={17}
                            className="text-emerald-600"
                          />
                        </div>
                      ) : (
                        <div
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-50
                          "
                        >
                          <Clock3
                            size={17}
                            className="text-blue-600"
                          />
                        </div>
                      )}

                      {index !== activities.length - 1 && (
                        <span
                          className="
                            absolute
                            left-1/2
                            top-10
                            h-[42px]
                            w-px
                            -translate-x-1/2
                            bg-slate-200
                          "
                        />
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <p
                          className="
                            text-[13px]
                            font-medium
                            text-slate-900
                          "
                        >
                          {item.title}
                        </p>

                        <span
                          className="
                            shrink-0
                            text-[11px]
                            text-slate-400
                          "
                        >
                          {item.time}
                        </span>
                      </div>

                      <p
                        className="
                          mt-1
                          text-[12px]
                          leading-5
                          text-slate-500
                        "
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}

            <div className="border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="
                  h-9
                  w-full
                  rounded-lg
                  bg-slate-900
                  text-[12px]
                  font-medium
                  text-white
                  transition
                  hover:bg-slate-800
                  active:scale-[0.99]
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}