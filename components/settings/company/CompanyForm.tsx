"use client";

import {
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function CompanyForm() {
  return (
    <section className="flex h-full min-h-0 flex-col">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-7 py-4">

        <div>
          <h1 className="text-[21px] font-semibold tracking-[-0.03em] text-slate-900">
            Company Information
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Update your company details used across invoices and reports.
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Building2 size={18} strokeWidth={1.8} />
        </div>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="min-h-0 flex-1 px-7 py-5">

        {/* COMPANY INTRO */}
        <div className="mb-5 flex items-center gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-blue-50 text-blue-600">
            <Building2 size={21} strokeWidth={1.8} />
          </div>

          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.015em] text-slate-900">
              Company Details
            </h2>

            <p className="mt-0.5 text-[13px] text-slate-500">
              These details appear on invoices and reports.
            </p>
          </div>

        </div>


        {/* ===================================================
            FORM
        =================================================== */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-4">

          {/* Company Name */}
          <FormField
            label="Company Name"
            value="Rajput Technologies"
          />

          {/* GSTIN */}
          <FormField
            label="GSTIN"
            value="27ABCDE1234F1Z5"
          />

          {/* PAN */}
          <FormField
            label="PAN"
            value="ABCDE1234F"
          />

          {/* Contact Email */}
          <FormField
            label="Contact Email"
            value="company@email.com"
          />

          {/* Contact Number */}
          <FormField
            label="Contact Number"
            value="+91 98765 43210"
          />

          {/* Website */}
          <FormField
            label="Website"
            value="https://company.com"
          />

        </div>


        {/* ===================================================
            ADDRESS
        =================================================== */}
        <div className="mt-4">

          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Company Address
          </label>

          <textarea
            defaultValue="Sector 62, Noida, Uttar Pradesh"
            rows={2}
            className="
              w-full
              resize-none
              rounded-[10px]
              border
              border-slate-200
              bg-white
              px-3.5
              py-2.5
              text-[13px]
              font-medium
              leading-5
              text-slate-800
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-slate-100 bg-white px-7">

        {/* Saved Status */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400">

          <CheckCircle2
            size={14}
            strokeWidth={1.8}
            className="text-emerald-500"
          />

          <span>
            Company details are saved securely
          </span>

        </div>


        {/* Save Button */}
        <button
          type="button"
          className="
            flex
            h-9
            items-center
            rounded-lg
            bg-blue-600
            px-5
            text-[12px]
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
            active:scale-[0.98]
          "
        >
          Save Changes
        </button>

      </div>

    </section>
  );
}


/* ============================================================
   FORM FIELD
============================================================ */

function FormField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
        {label}
      </label>

      <input
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
      />
    </div>
  );
}