"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      setIsSaving(false);
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      setIsSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to change password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaveSuccess(true);
      toast.success("Password changed successfully!");
    } catch (err) {
      console.error("Password change error:", err);
      toast.error("An unexpected error occurred while changing password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_5px_22px_rgba(15,23,42,0.04)]">
      {/* HEADER */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-7 py-4">
        <div>
          <h1 className="text-[21px] font-semibold tracking-[-0.03em] text-slate-900">
            Security
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Protect your account and control login security.
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <ShieldCheck size={18} strokeWidth={1.8} />
        </div>
      </header>

      {/* CONTENT */}
      <div className="min-h-0 flex-1 overflow-y-auto px-7 py-5 pb-12">
        {/* PASSWORD SECTION */}
        <div>
          <div className="mb-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-blue-50 text-blue-600">
              <KeyRound size={20} strokeWidth={1.8} />
            </div>

            <div>
              <h2 className="text-[16px] font-semibold tracking-[-0.015em] text-slate-900">
                Change Password
              </h2>
              <p className="mt-0.5 text-[13px] text-slate-500">
                Update your account password.
              </p>
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            {/* Current Password */}
            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={(val) => {
                setCurrentPassword(val);
                setSaveSuccess(false);
              }}
              show={showCurrent}
              onToggle={() => setShowCurrent(!showCurrent)}
            />

            {/* New Password */}
            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={(val) => {
                setNewPassword(val);
                setSaveSuccess(false);
              }}
              show={showNew}
              onToggle={() => setShowNew(!showNew)}
            />

            {/* Confirm Password */}
            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                setSaveSuccess(false);
              }}
              show={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
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
                size={14}
                strokeWidth={1.8}
                className="text-emerald-500"
              />
              <span className="text-emerald-600 font-medium">
                Password updated successfully
              </span>
            </>
          ) : (
            <span>Your account security is protected</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
        >
          {isSaving && <Loader2 size={14} className="animate-spin" />}
          {isSaving ? "Updating..." : "Save Changes"}
        </button>
      </footer>
    </form>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
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
            pr-11
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

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute
            right-3
            top-1/2
            flex
            -translate-y-1/2
            items-center
            justify-center
            text-slate-400
            transition
            hover:text-slate-600
          "
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOff size={16} strokeWidth={1.8} />
          ) : (
            <Eye size={16} strokeWidth={1.8} />
          )}
        </button>
      </div>
    </div>
  );
}