"use client";

import Link from "next/link";
import { User, Mail, Lock, Eye } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          const msg = data.error || "This email is already registered. Please sign in instead.";
          setErrors({ email: msg, general: msg });
          toast.error(msg);
          return;
        }

        if (data.details) {
          setErrors(data.details);
        } else {
          setErrors({ general: data.error || "An error occurred during signup" });
          toast.error(data.error || "An error occurred during signup");
        }
        return;
      }

      // Sign in after successful signup
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!signInResult?.ok) {
        toast.error("Account created but sign in failed. Please log in manually.");
        router.push("/login");
        return;
      }

      toast.success("Account created successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const errorMsg = "An error occurred. Please try again.";
      setErrors({ general: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Errors */}
      {errors.general && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] text-red-700">
          <p>{errors.general}</p>
          {errors.general.includes("registered") && (
            <div className="mt-2">
              <Link
                href="/login"
                className="font-semibold text-blue-600 underline hover:text-blue-800"
              >
                Sign in to your account →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
              className="ml-3 flex-1 bg-transparent text-[14px] placeholder:text-slate-400 outline-none disabled:opacity-50"
            />
          </div>
          {errors.name && <p className="mt-1 text-[12px] text-red-600">{errors.name}</p>}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="ml-3 flex-1 bg-transparent text-[14px] placeholder:text-slate-400 outline-none disabled:opacity-50"
            />
          </div>
          {errors.email && <p className="mt-1 text-[12px] text-red-600">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Password
          </label>
          <div className="flex h-10.5 items-center rounded-2xl border border-slate-200 px-4 transition focus-within:border-blue-600">
            <Lock size={17} className="text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="ml-3 flex-1 bg-transparent text-[14px] placeholder:text-slate-400 outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
            >
              <Eye size={17} />
            </button>
          </div>
          {errors.password && <p className="mt-1 text-[12px] text-red-600">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Confirm Password
          </label>
          <div className="flex h-10.5 items-center rounded-2xl border border-slate-200 px-4 transition focus-within:border-blue-600">
            <Lock size={17} className="text-slate-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              className="ml-3 flex-1 bg-transparent text-[14px] placeholder:text-slate-400 outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
            >
              <Eye size={17} />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-[12px] text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Create Account */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 h-11 w-full rounded-2xl bg-[#0F172A] text-[14px] font-medium text-white transition hover:bg-[#1E293B] disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>

        {/* Login Prompt */}
        <div className="pt-1 text-center">
          <p className="text-[13px] text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-slate-900 transition hover:text-black"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}