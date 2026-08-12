"use client";

import { useEffect, useState } from "react";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CompanyForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCompanyData() {
      try {
        const res = await fetch("/api/company");
        if (res.ok) {
          const data = await res.json();
          if (data.company && isMounted) {
            setCompanyName(data.company.companyName || "");
            setGstin(data.company.gstin || "");
            setPan(data.company.pan || "");
            setContactEmail(data.company.contactEmail || "");
            setContactNumber(data.company.contactNumber || "");
            setWebsite(data.company.website || "");
            setAddress(data.company.address || "");
          }
        }
      } catch (err) {
        console.error("Failed to load company data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCompanyData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    if (!companyName.trim()) {
      toast.error("Company Name is required.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          gstin: gstin.trim() || null,
          pan: pan.trim() || null,
          contactEmail: contactEmail.trim() || null,
          contactNumber: contactNumber.trim() || null,
          website: website.trim() || null,
          address: address.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to save company details.");
        return;
      }

      setSaveSuccess(true);
      toast.success("Company details saved successfully!");
    } catch (err) {
      console.error("Save company details error:", err);
      toast.error("An error occurred while saving company details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-[20px] border border-slate-200/80 bg-white p-8">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        <p className="mt-3 text-[13px] font-medium text-slate-500">
          Loading company details...
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_5px_22px_rgba(15,23,42,0.04)]">
      {/* HEADER */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-7 py-4">
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
      </header>

      {/* CONTENT */}
      <div className="min-h-0 flex-1 overflow-y-auto px-7 py-5 pb-12">
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

        {/* FORM */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
          {/* Company Name */}
          <FormField
            label="Company Name"
            value={companyName}
            onChange={(val) => {
              setCompanyName(val);
              setSaveSuccess(false);
            }}
          />

          {/* GSTIN */}
          <FormField
            label="GSTIN"
            value={gstin}
            onChange={(val) => {
              setGstin(val);
              setSaveSuccess(false);
            }}
          />

          {/* PAN */}
          <FormField
            label="PAN"
            value={pan}
            onChange={(val) => {
              setPan(val);
              setSaveSuccess(false);
            }}
          />

          {/* Contact Email */}
          <FormField
            label="Contact Email"
            type="email"
            value={contactEmail}
            onChange={(val) => {
              setContactEmail(val);
              setSaveSuccess(false);
            }}
          />

          {/* Contact Number */}
          <FormField
            label="Contact Number"
            value={contactNumber}
            onChange={(val) => {
              setContactNumber(val);
              setSaveSuccess(false);
            }}
          />

          {/* Website */}
          <FormField
            label="Website"
            value={website}
            onChange={(val) => {
              setWebsite(val);
              setSaveSuccess(false);
            }}
          />
        </div>

        {/* ADDRESS */}
        <div className="mt-4">
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Company Address
          </label>

          <textarea
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setSaveSuccess(false);
            }}
            rows={3}
            placeholder="Enter company address..."
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

      {/* FOOTER */}
      <footer className="flex h-[58px] shrink-0 items-center justify-between border-t border-slate-100 bg-white px-7">
        {/* Saved Status */}
        <div className="flex items-center gap-2 text-[12px] text-slate-400">
          {saveSuccess ? (
            <>
              <CheckCircle2
                size={14}
                strokeWidth={1.8}
                className="text-emerald-500"
              />
              <span className="text-emerald-600 font-medium">
                Company details are saved securely
              </span>
            </>
          ) : (
            <span>Make changes and click Save Changes below</span>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="
            flex
            h-9
            items-center
            gap-2
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
            disabled:opacity-50
          "
        >
          {isSaving && <Loader2 size={14} className="animate-spin" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </footer>
    </form>
  );
}

function FormField({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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