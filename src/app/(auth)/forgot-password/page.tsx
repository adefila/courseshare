"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function ForgotPasswordIllustration() {
  return (
    <svg viewBox="0 0 320 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="160" cy="80" r="62" fill="#eef2ff" />
      {/* Envelope body */}
      <rect x="88" y="52" width="144" height="96" rx="10" fill="white" stroke="#e0e7ff" strokeWidth="1.5" />
      {/* Envelope flap (open) */}
      <path d="M88 62 L160 108 L232 62" stroke="#c7d2fe" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M88 52 L160 96 L232 52" fill="#eef2ff" stroke="#e0e7ff" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Letter lines inside envelope */}
      <rect x="118" y="80" width="64" height="4" rx="2" fill="#e0e7ff" />
      <rect x="126" y="90" width="48" height="4" rx="2" fill="#e0e7ff" />
      {/* Indigo circle with arrow (send) */}
      <circle cx="218" cy="42" r="16" fill="#4f46e5" />
      <path d="M211 42 L218 35 L225 42 M218 35 L218 49" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sparkles */}
      <path d="M62 44 L63.4 38 L64.8 44 L70.8 45.4 L64.8 46.8 L63.4 52.8 L62 46.8 L56 45.4 Z" fill="#c7d2fe" />
      <path d="M252 56 L253.2 51 L254.4 56 L259.4 57.2 L254.4 58.4 L253.2 63.4 L252 58.4 L247 57.2 Z" fill="#a5b4fc" />
      <circle cx="76" cy="108" r="5" fill="#e0e7ff" />
      <circle cx="248" cy="112" r="4" fill="#e0e7ff" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });
      if (error) setError(error.message);
      else setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-zinc-200 bg-white">
          <div className="flex h-40 items-center justify-center rounded-t-2xl border-b border-zinc-100 bg-zinc-50 px-6">
            <ForgotPasswordIllustration />
          </div>
          <div className="px-5 py-8 text-center sm:px-7">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h1 className="mb-2 text-xl font-semibold text-zinc-900">Check your inbox</h1>
            <p className="mb-1 text-sm text-zinc-500">
              We sent a reset link to
            </p>
            <p className="mb-6 font-medium text-zinc-800">{email}</p>
            <p className="text-xs text-zinc-400">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button onClick={() => setSent(false)} className="text-indigo-600 hover:underline">
                try again
              </button>.
            </p>
          </div>
        </div>
        <p className="mt-5 text-center text-sm text-zinc-500">
          <Link href="/login" className="font-medium text-zinc-900 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-zinc-200 bg-white">
        <div className="flex h-40 items-center justify-center rounded-t-2xl border-b border-zinc-100 bg-zinc-50 px-6">
          <ForgotPasswordIllustration />
        </div>
        <div className="px-5 py-7 sm:px-7">
          <h1 className="mb-1 text-2xl font-semibold text-zinc-900">Forgot password?</h1>
          <p className="mb-7 text-sm text-zinc-500">
            Enter your email and we&apos;ll send a reset link.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            {error && (
              <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" disabled={isPending || !email.trim()} className="mt-1 w-full">
              {isPending ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </div>
      </div>
      <p className="mt-5 text-center text-sm text-zinc-500">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-zinc-900 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
