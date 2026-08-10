"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Boxes } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  type: "login" | "signup" | "forgot-password";
}

export default function AuthLayout({
  children,
  type,
}: AuthLayoutProps) {
  const cardHeight =
    type === "signup"
      ? "min-h-[640px]"
      : type === "forgot-password"
      ? "min-h-[520px]"
      : "min-h-[610px]";

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}

      <Image
        src="/images/auth-bg1.jpg"
        alt="Authentication Background"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}

      <div className="absolute inset-0 bg-[#020817]/45" />

      {/* Logo */}

      <div className="absolute left-13 top-10 z-20 flex items-center gap-2.5">
        <Boxes
          size={24}
          strokeWidth={2}
          className="text-white"
        />

        <h1 className="text-[22px] font-semibold tracking-tight text-white">
          InvoiceFlow
        </h1>
      </div>

      {/* Left Content */}

      <div className="absolute bottom-18 left-15 z-20 max-w-[480px]">
        <h2 className="text-[48px] font-semibold leading-[1.08] tracking-tight text-white">
          Every Invoice.
          <br />
          One Workflow.
        </h2>

        <p className="mt-6 max-w-[440px] text-[16px] leading-7 text-slate-300">
          Upload CSV files, validate invoice data, detect errors, and
          process thousands of invoices with speed, accuracy, and
          confidence—all from one clean workspace.
        </p>
      </div>

      {/* Floating Card */}

      <div className="relative z-20 flex min-h-screen items-center justify-end px-16">
        <div
          className={`flex w-full max-w-[600px] ${cardHeight} rounded-xl bg-white px-14 py-10 shadow-2xl`}
        >
          <div className="m-auto w-full max-w-[470px]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}