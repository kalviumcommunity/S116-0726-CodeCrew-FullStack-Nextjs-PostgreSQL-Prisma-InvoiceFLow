"use client";

import {
  Camera,
  CheckCircle2,
} from "lucide-react";

export default function ProfileForm() {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_5px_22px_rgba(15,23,42,0.04)]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-7 py-4">

        <div>
          <h1 className="text-[21px] font-semibold tracking-[-0.03em] text-slate-900">
            Profile & Account
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5">

          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-[12px] font-medium text-emerald-700">
            Account active
          </span>

        </div>

      </header>


      {/* =====================================================
          SCROLL-FREE CONTENT
      ===================================================== */}

      <div className="min-h-0 flex-1 px-7 py-4">

        {/* ===================================================
            PROFILE SUMMARY
        =================================================== */}

        <div className="flex items-center border-b border-slate-100 pb-4">

          {/* Avatar */}
          <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-full bg-blue-600 text-[22px] font-semibold text-white shadow-sm">
            KR
          </div>


          {/* User */}
          <div className="ml-4">

            <div className="flex items-center gap-2.5">

              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-slate-900">
                Khushal Rajput
              </h2>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                Administrator
              </span>

            </div>

            <p className="mt-0.5 text-[13px] text-slate-500">
              khushal@email.com
            </p>

            <div className="mt-2 flex items-center gap-3">

              <button
                type="button"
                className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Camera size={15} strokeWidth={1.8} />
                Change Photo
              </button>

              <span className="text-[12px] text-slate-400">
                JPG, PNG · Max 2MB
              </span>

            </div>

          </div>

        </div>


        {/* ===================================================
            PERSONAL INFORMATION
        =================================================== */}

        <div className="pt-4">

          <div className="mb-3">

            <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-slate-900">
              Personal Information
            </h3>

            <p className="mt-0.5 text-[12px] text-slate-500">
              Update the information associated with your account.
            </p>

          </div>


          {/* FORM */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">

            <FormField
              label="First Name"
              value="Khushal"
            />

            <FormField
              label="Last Name"
              value="Rajput"
            />

            <FormField
              label="Email"
              value="khushal@email.com"
            />

            <FormField
              label="Phone"
              value="+91 98765 43210"
            />

            <FormField
              label="Username"
              value="khushal"
            />

            <FormField
              label="Role"
              value="Administrator"
              disabled
            />

            <SelectField
              label="Language"
              value="English"
              options={["English"]}
            />

            <SelectField
              label="Timezone"
              value="Asia/Kolkata"
              options={[
                "Asia/Kolkata",
                "Asia/Dubai",
                "Europe/London",
                "America/New_York",
              ]}
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="flex h-[58px] shrink-0 items-center justify-between border-t border-slate-100 bg-white px-7">

        <div className="flex items-center gap-2 text-[12px] text-slate-400">

          <CheckCircle2
            size={15}
            strokeWidth={1.8}
            className="text-emerald-500"
          />

          <span>
            Changes are saved securely
          </span>

        </div>


        <button
          type="button"
          className="flex h-9 items-center rounded-lg bg-blue-600 px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Save Changes
        </button>

      </footer>

    </section>
  );
}


/* =============================================================
   INPUT FIELD
============================================================= */

function FormField({
  label,
  value,
  disabled = false,
}: {
  label: string;
  value: string;
  disabled?: boolean;
}) {
  return (
    <div className="min-w-0">

      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
        {label}
      </label>

      <input
        defaultValue={value}
        disabled={disabled}
        className={[
          "h-10.5 w-full rounded-[10px] border px-3.5",
          "text-[13px] font-medium outline-none transition",
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500"
            : "border-slate-200 bg-white text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
        ].join(" ")}
      />

    </div>
  );
}


/* =============================================================
   SELECT FIELD
============================================================= */

function SelectField({
  label,
  value,
  options,
}: {
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <div className="min-w-0">

      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
        {label}
      </label>

      <select
        defaultValue={value}
        className="
          h-10.5
          w-full
          rounded-[10px]
          border
          border-slate-200
          bg-white
          px-3.5
          text-[13px]
          font-medium
          text-slate-800
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}