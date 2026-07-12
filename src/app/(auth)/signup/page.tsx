"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP state
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name } },
      });
      if (error) {
        setError(error.message);
      } else {
        setStep("otp");
      }
    });
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp.trim(),
        type: "signup",
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/courses");
        router.refresh();
      }
    });
  }

  if (step === "otp") {
    return (
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-8 sm:px-10">
          <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.5 2 2 0 0 1 3.62 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-zinc-900">
            Check your email
          </h1>
          <p className="mb-7 text-sm text-zinc-500">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-zinc-700">{email}</span>. Enter it below to verify your account.
          </p>

          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp" className="text-[13px] font-medium text-zinc-700">
                Verification code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center text-2xl font-medium tracking-[0.5em] text-zinc-900 transition placeholder:text-zinc-300 placeholder:tracking-[0.5em] focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" disabled={isPending || otp.length < 6} className="w-full">
              {isPending ? "Verifying…" : "Verify email"}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-zinc-500">
          Wrong email?{" "}
          <button
            onClick={() => { setStep("form"); setOtp(""); setError(""); }}
            className="font-medium text-zinc-900 hover:underline"
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-8 sm:px-10">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 8v6M22 11h-6" />
          </svg>
        </div>
        <h1 className="mb-1 text-2xl font-medium tracking-tight text-zinc-900">
          Create an account
        </h1>
        <p className="mb-7 text-sm text-zinc-500">
          Free forever. Help students who come after you.
        </p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <Input
            id="name"
            label="Display name"
            type="text"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <PasswordInput
            id="password"
            label="Password"
            placeholder="min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />

          {error && (
            <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="mt-1 w-full">
            {isPending ? "Creating account…" : "Sign up"}
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-900 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
