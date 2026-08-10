"use client";

import {
  KeyRound,
  ShieldCheck,
  MonitorSmartphone,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

export default function SecurityForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className="flex h-full min-h-0 flex-col">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-7 py-4">

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

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="min-h-0 flex-1 px-7 py-5">

        {/* ===================================================
            PASSWORD SECTION
        =================================================== */}
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
              show={showCurrent}
              onToggle={() => setShowCurrent(!showCurrent)}
            />

            {/* New Password */}
            <PasswordField
              label="New Password"
              show={showNew}
              onToggle={() => setShowNew(!showNew)}
            />

            {/* Confirm Password */}
            <PasswordField
              label="Confirm Password"
              show={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
            />

          </div>

        </div>


        {/* ===================================================
            DIVIDER
        =================================================== */}
        <div className="my-5 border-t border-slate-100" />


        {/* ===================================================
            SECURITY OPTIONS
        =================================================== */}
        <div className="space-y-3">

          {/* Two Factor */}
          <SecurityOption
            icon={
              <ShieldCheck
                size={19}
                strokeWidth={1.8}
              />
            }
            iconClass="bg-emerald-50 text-emerald-600"
            title="Two-Factor Authentication"
            description="Extra protection for your account."
            action={
              <button
                type="button"
                className="
                  h-9
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-[13px]
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                Enable
              </button>
            }
          />

          {/* Active Sessions */}
          <SecurityOption
            icon={
              <MonitorSmartphone
                size={19}
                strokeWidth={1.8}
              />
            }
            iconClass="bg-orange-50 text-orange-600"
            title="Active Sessions"
            description="Sign out from every logged-in device."
            action={
              <button
                type="button"
                className="
                  h-9
                  rounded-lg
                  border
                  border-red-200
                  bg-white
                  px-4
                  text-[13px]
                  font-medium
                  text-red-600
                  transition
                  hover:bg-red-50
                "
              >
                Logout All
              </button>
            }
          />

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-slate-100 bg-white px-7">

        <div className="flex items-center gap-2 text-[12px] text-slate-400">

          <CheckCircle2
            size={14}
            strokeWidth={1.8}
            className="text-emerald-500"
          />

          <span>
            Your account security is protected
          </span>

        </div>


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
   PASSWORD FIELD
============================================================ */

function PasswordField({
  label,
  show,
  onToggle,
}: {
  label: string;
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


/* ============================================================
   SECURITY OPTION
============================================================ */

function SecurityOption({
  icon,
  iconClass,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        min-h-[68px]
        items-center
        justify-between
        rounded-[12px]
        border
        border-slate-200
        bg-white
        px-4
        py-3
      "
    >

      <div className="flex min-w-0 items-center gap-3.5">

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-[11px]
            ${iconClass}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-slate-900">
            {title}
          </h3>

          <p className="mt-0.5 text-[13px] text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <div className="ml-5 shrink-0">
        {action}
      </div>

    </div>
  );
}