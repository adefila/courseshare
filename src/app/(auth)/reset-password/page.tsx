"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";

function ResetIllustration() {
  return (
    <svg viewBox="0 0 320 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="160" cy="80" r="62" fill="#eef2ff" />
      {/* Lock body */}
      <rect x="118" y="76" width="84" height="60" rx="10" fill="#4f46e5" />
      {/* Lock shackle */}
      <path d="M138 76 L138 56 Q138 36 160 36 Q182 36 182 56 L182 76"
        stroke="#a5b4fc" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Keyhole */}
      <circle cx="160" cy="100" r="9" fill="#6366f1" />
      <rect x="156.5" y="104" width="7" height="16" rx="3.5" fill="#6366f1" />
      {/* Check mark (unlocked/success feel) */}
      <circle cx="208" cy="44" r="14" fill="white" stroke="#e0e7ff" strokeWidth="1.5" />
      <path d="M202 44 L206 48 L214 40" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sparkles */}
      <path d="M63 42 L64.4 36 L65.8 42 L71.8 43.4 L65.8 44.8 L64.4 50.8 L63 44.8 L57 43.4 Z" fill="#c7d2fe" />
      <path d="M252 58 L253.2 53 L254.4 58 L259.4 59.2 L254.4 60.4 L253.2 65.4 L252 60.4 L247 59.2 Z" fill="#a5b4fc" />
      <circle cx="76" cy="110" r="5" fill="#e0e7ff" />
      <circle cx="248" cy="114" r="4" fill="#e0e7ff" />
    </svg>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setReady(true);
      else setError("This reset link is invalid or has expired.");
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setDone(true);
        setTimeout(() => router.push("/courses"), 2500);
      }
    });
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-zinc-200 bg-white">
        <div className="flex h-40 items-center justify-center rounded-t-2xl border-b border-zinc-100 bg-zinc-50 px-6">
          <ResetIllustration />
        </div>
        <div className="px-5 py-7 sm:px-7">
          {done ? (
            <div className="py-2 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h1 className="mb-2 text-xl font-semibold text-zinc-900">Password updated</h1>
              <p className="text-sm text-zinc-500">Redirecting you to the app…</p>
            </div>
          ) : (
            <>
              <h1 className="mb-1 text-2xl font-semibold text-zinc-900">Set new password</h1>
              <p className="mb-7 text-sm text-zinc-500">
                Choose a strong password for your account.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <PasswordInput
                  id="new_password"
                  label="New password"
                  placeholder="min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  disabled={!ready}
                />
                {error && (
                  <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={isPending || !ready || password.length < 8}
                  className="mt-1 w-full"
                >
                  {isPending ? "Updating…" : "Update password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
