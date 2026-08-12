"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Camera, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProfileForm() {
  const { data: session, update } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          if (data.user && isMounted) {
            const fullName = data.user.name || "";
            const parts = fullName.trim().split(/\s+/);
            setFirstName(parts[0] || "");
            setLastName(parts.slice(1).join(" ") || "");
            setEmail(data.user.email || "");
            setImage(data.user.image || null);
          }
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getInitials = () => {
    const fullName = `${firstName} ${lastName}`.trim() || session?.user?.name || "User";
    const parts = fullName.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("File must be a JPG or PNG image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must not exceed 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setSaveSuccess(false);
        toast.info("New photo selected. Click 'Save Changes' to apply.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      if (!fullName) {
        toast.error("Name cannot be empty.");
        setIsSaving(false);
        return;
      }

      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          image,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile.");
        return;
      }

      // Update NextAuth session in memory
      await update({
        name: fullName,
        email,
        image,
      });

      setSaveSuccess(true);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error("An error occurred while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-[20px] border border-slate-200/80 bg-white p-8">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        <p className="mt-3 text-[13px] font-medium text-slate-500">
          Loading profile...
        </p>
      </section>
    );
  }

  const fullName = `${firstName} ${lastName}`.trim() || "User";

  return (
    <form onSubmit={handleSave} className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_5px_22px_rgba(15,23,42,0.04)]">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* HEADER */}
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

      {/* CONTENT */}
      <div className="min-h-0 flex-1 overflow-y-auto px-7 py-4 pb-12">
        {/* PROFILE SUMMARY */}
        <div className="flex items-center border-b border-slate-100 pb-4">
          {/* Avatar */}
          <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-[22px] font-semibold text-white shadow-sm">
            {image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={image}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials()
            )}
          </div>

          {/* User Details */}
          <div className="ml-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-slate-900">
                {fullName}
              </h2>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                User
              </span>
            </div>

            <p className="mt-0.5 text-[13px] text-slate-500">{email}</p>

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
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

        {/* PERSONAL INFORMATION */}
        <div className="pt-4">
          <div className="mb-3">
            <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-slate-900">
              Personal Information
            </h3>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Update the information associated with your account.
            </p>
          </div>

          {/* FORM FIELDS */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">
            <FormField
              label="First Name"
              value={firstName}
              onChange={(val) => {
                setFirstName(val);
                setSaveSuccess(false);
              }}
            />

            <FormField
              label="Last Name"
              value={lastName}
              onChange={(val) => {
                setLastName(val);
                setSaveSuccess(false);
              }}
            />

            <FormField
              label="Email"
              value={email}
              type="email"
              onChange={(val) => {
                setEmail(val);
                setSaveSuccess(false);
              }}
            />

            <FormField label="Role" value="User" disabled />

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

      {/* FOOTER */}
      <footer className="flex h-[58px] shrink-0 items-center justify-between border-t border-slate-100 bg-white px-7">
        <div className="flex items-center gap-2 text-[12px] text-slate-400">
          {saveSuccess ? (
            <>
              <CheckCircle2
                size={15}
                strokeWidth={1.8}
                className="text-emerald-500"
              />
              <span className="text-emerald-600 font-medium">
                Changes saved successfully
              </span>
            </>
          ) : (
            <span>Make changes and click Save Changes below</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
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
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
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
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}