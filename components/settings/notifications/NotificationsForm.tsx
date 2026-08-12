"use client";

import {
  Bell,
  Mail,
  TriangleAlert,
  CircleCheck,
} from "lucide-react";

export default function NotificationsForm() {
  return (
    <section className="flex h-full min-h-0 flex-col">

      {/* HEADER */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-7 py-4">

        <div>
          <h1 className="text-[21px] font-semibold tracking-[-0.03em] text-slate-900">
            Notifications
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Manage how you receive important updates.
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Bell size={18} strokeWidth={1.8} />
        </div>

      </div>


      {/* CONTENT */}
      <div className="min-h-0 flex-1 overflow-y-auto px-7 py-5 pb-12">

        {/* ITEMS */}
        <div className="space-y-3">

          <NotificationItem
            icon={<Mail size={18} strokeWidth={1.8} />}
            color="bg-blue-50 text-blue-600"
            title="Email Notifications"
            description="Receive important updates via email."
            enabled
          />

          <NotificationItem
            icon={<CircleCheck size={18} strokeWidth={1.8} />}
            color="bg-green-50 text-green-600"
            title="Upload Completed"
            description="Notify when invoice processing finishes."
            enabled
          />

          <NotificationItem
            icon={<TriangleAlert size={18} strokeWidth={1.8} />}
            color="bg-orange-50 text-orange-600"
            title="Processing Errors"
            description="Alert when uploaded files contain errors."
            enabled
          />

          <NotificationItem
            icon={<Bell size={18} strokeWidth={1.8} />}
            color="bg-violet-50 text-violet-600"
            title="Product Updates"
            description="Receive news about new features."
          />

        </div>


        {/* INFO */}
        <div className="mt-4 flex items-center gap-2.5 rounded-[12px] bg-slate-50 px-4 py-3">

          <CircleCheck
            size={15}
            strokeWidth={1.8}
            className="shrink-0 text-emerald-500"
          />

          <p className="text-[12px] text-slate-500">
            Notification preferences are applied to your account immediately.
          </p>

        </div>

      </div>


      {/* FOOTER */}
      <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-slate-100 bg-white px-7">

        <div className="flex items-center gap-2 text-[12px] text-slate-400">

          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          Notifications are enabled

        </div>


        <button
          type="button"
          className="flex h-9 items-center rounded-lg bg-blue-600 px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Save Changes
        </button>

      </div>

    </section>
  );
}


/* ============================================================
   NOTIFICATION ITEM
============================================================ */

function NotificationItem({
  icon,
  color,
  title,
  description,
  enabled = false,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div
      className="
        flex
        min-h-[76px]
        items-center
        justify-between
        rounded-[13px]
        border
        border-slate-200
        bg-white
        px-4
        py-3
      "
    >

      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3.5">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] ${color}`}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-slate-900">
            {title}
          </h3>

          <p className="mt-0.5 text-[12px] text-slate-500">
            {description}
          </p>

        </div>

      </div>


      {/* TOGGLE */}
      <label className="relative ml-5 inline-flex h-6 w-11 shrink-0 cursor-pointer">

        <input
          type="checkbox"
          defaultChecked={enabled}
          className="peer sr-only"
        />

        <span
          className="
            absolute
            inset-0
            rounded-full
            bg-slate-200
            transition-colors
            duration-200
            peer-checked:bg-blue-600
          "
        />

        <span
          className="
            absolute
            left-1
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            shadow-sm
            transition-transform
            duration-200
            peer-checked:translate-x-5
          "
        />

      </label>

    </div>
  );
}