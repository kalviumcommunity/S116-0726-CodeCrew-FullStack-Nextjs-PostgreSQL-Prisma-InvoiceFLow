'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === 'login';
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in your email and password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          InvoiceFlow
        </p>
        <h1 className="text-3xl font-semibold text-white">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-sm leading-6 text-slate-400">
          {isLogin
            ? 'Sign in to manage bulk invoice uploads, background processing, and validation results.'
            : 'Create an account to upload invoices, monitor processing progress, and review upload history.'}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin ? (
          <label className="block space-y-2 text-sm text-slate-300">
            <span>Full name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              placeholder="Jordan Lee"
            />
          </label>
        ) : null}

        <label className="block space-y-2 text-sm text-slate-300">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
            placeholder="you@example.com"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-300">
          <span>Password</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 pr-20 text-sm outline-none transition focus:border-cyan-400"
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-cyan-400"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <Eye className="h-5 w-5 text-cyan-300" /> : <EyeOff className="h-5 w-5 text-cyan-400" />}
            </button>
          </div>
        </label>

        {error ? <p className="rounded-xl border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
        <Link href={isLogin ? '/signup' : '/login'} className="font-medium text-cyan-400 hover:text-cyan-300">
          {isLogin ? 'Create one' : 'Log in'}
        </Link>
      </p>
    </div>
  );
}
