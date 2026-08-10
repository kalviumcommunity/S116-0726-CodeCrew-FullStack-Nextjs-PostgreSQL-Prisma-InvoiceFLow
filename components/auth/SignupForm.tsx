"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Mail, Lock, Eye } from "lucide-react";

export default function SignupForm() {
  return (
    <div className="mx-auto flex h-full w-full flex-col justify-center">
      {/* Heading */}

      <div className="mb-6 text-center">
        <h1 className="text-[36px] font-semibold tracking-tight text-slate-900">
          Create account
        </h1>

        <p className="mt-2 text-[15px] text-slate-500">
          Create your InvoiceFlow account.
        </p>
      </div>

      {/* Form */}

      <form className="space-y-3">
        {/* Full Name */}

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Full Name
          </label>

          <div className="flex h-10.5 items-center rounded-2xl border border-slate-200 px-4 transition focus-within:border-blue-600">
            <User size={17} className="text-slate-400" />

            <input
              type="text"
              placeholder="Enter your full name"
              className="ml-3 flex-1 bg-transparent text-[14px] placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Email */}

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Email
          </label>

          <div className="flex h-10.5 items-center rounded-2xl border border-slate-200 px-4 transition focus-within:border-blue-600">
            <Mail size={17} className="text-slate-400" />

            <input
              type="email"
              placeholder="Enter your email"
              className="ml-3 flex-1 bg-transparent text-[14px] placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Password */}

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Password
          </label>

          <div className="flex h-10.5 items-center rounded-2xl border border-slate-200 px-4 transition focus-within:border-blue-600">
            <Lock size={17} className="text-slate-400" />

            <input
              type="password"
              placeholder="Create a password"
              className="ml-3 flex-1 bg-transparent text-[14px] placeholder:text-slate-400 outline-none"
            />

            <button
              type="button"
              className="text-slate-400 transition hover:text-slate-700"
            >
              <Eye size={17} />
            </button>
          </div>
        </div>

        {/* Confirm Password */}

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Confirm Password
          </label>

          <div className="flex h-10.5 items-center rounded-2xl border border-slate-200 px-4 transition focus-within:border-blue-600">
            <Lock size={17} className="text-slate-400" />

            <input
              type="password"
              placeholder="Confirm your password"
              className="ml-3 flex-1 bg-transparent text-[14px] placeholder:text-slate-400 outline-none"
            />

            <button
              type="button"
              className="text-slate-400 transition hover:text-slate-700"
            >
              <Eye size={17} />
            </button>
          </div>
        </div>

        {/* Create Account */}

        <button className="mt-1 h-11 w-full rounded-2xl bg-[#0F172A] text-[14px] font-medium text-white transition hover:bg-[#1E293B]">
          Create Account
        </button>

        {/* Divider */}

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google */}

        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white text-[14px] font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Image
            src="/images/google.png"
            alt="Google"
            width={20}
            height={20}
            className="h-5 w-5"
          />

          Sign up with Google
        </button>

        {/* Login Prompt */}

        <div className="pt-1 text-center">
          <p className="text-[13px] text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-slate-900 transition hover:text-black"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}