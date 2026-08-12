"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Signed in successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const errorMsg = "An error occurred. Please try again.";
      setError(errorMsg);
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
          Welcome back
        </h1>

        <p className="mt-2 text-[15px] text-slate-500">
          Sign in to continue to your account.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {/* Form */}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email */}

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Email
          </label>

          <div className="flex h-10.5 items-center rounded-2xl border border-slate-200 px-4 transition focus-within:border-blue-600">
            <Mail
              size={17}
              className="text-slate-400"
            />

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
        </div>

        {/* Password */}

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">
            Password
          </label>

          <div className="flex h-10.5 items-center rounded-2xl border border-slate-200 px-4 transition focus-within:border-blue-600">
            <Lock
              size={17}
              className="text-slate-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
        </div>

        {/* Remember */}

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-[13px] text-slate-600">
            <input
              type="checkbox"
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-300 disabled:opacity-50"
            />
            Remember me
          </label>

          <Link
            href="/forgot-password"
            className="text-[13px] font-medium text-blue-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In */}

        <button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-2xl bg-[#0F172A] text-[14px] font-medium text-white transition hover:bg-[#1E293B] disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        {/* Bottom Signup */}

        <div className="pt-1 text-center">
          <p className="text-[13px] text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-slate-900 transition hover:text-black"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}