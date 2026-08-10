"use client";

import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm() {
  return (
    <div className="mx-auto w-full max-w-[475px]">
      {/* Heading */}

      <div className="mb-10 text-center">
        <h1 className="text-[36px] font-semibold tracking-tight text-slate-900">
          Forgot password?
        </h1>

        <p className="mt-2 text-[15px] text-slate-500">
  Enter your email and we&apos;ll send you a password reset link.
</p>
      </div>

      <form className="space-y-5">
        {/* Email */}

        <div>
          <label className="mb-2 block text-[13px] font-medium text-slate-700">
            Email
          </label>

          <div className="flex h-11 items-center rounded-2xl border border-slate-200 px-4 transition focus-within:border-blue-600">
            <Mail
              size={17}
              className="text-slate-400"
            />

            <input
              type="email"
              placeholder="Enter your email"
              className="ml-3 flex-1 bg-transparent text-[14px] placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Button */}

        <button className="h-11 w-full rounded-2xl bg-[#0F172A] text-[14px] font-medium text-white transition hover:bg-[#1E293B]">
          Send reset link
        </button>

        {/* Back */}

        <div className="pt-4 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}