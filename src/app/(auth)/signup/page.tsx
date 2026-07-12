"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

function SignupIllustration() {
  return (
    <svg viewBox="0 0 320 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background */}
      <circle cx="160" cy="80" r="62" fill="#f4f4f5" />

      {/* Left person */}
      <circle cx="118" cy="62" r="19" fill="#d4d4d8" />
      <path d="M86 128 Q88 103 118 103 Q148 103 150 128" fill="#d4d4d8" />

      {/* Right person */}
      <circle cx="202" cy="62" r="19" fill="#d4d4d8" />
      <path d="M170 128 Q172 103 202 103 Q232 103 234 128" fill="#d4d4d8" />

      {/* Center person (featured) */}
      <circle cx="160" cy="58" r="22" fill="#27272a" />
      <path d="M124 126 Q127 98 160 98 Q193 98 196 126" fill="#27272a" />

      {/* Plus badge */}
      <circle cx="198" cy="36" r="13" fill="white" stroke="#e4e4e7" strokeWidth="1.5" />
      <path d="M198 30 L198 42 M192 36 L204 36" stroke="#52525b" strokeWidth="2.2" strokeLinecap="round" />

      {/* Sparkles */}
      <path d="M65 42 L66.6 36 L68.2 42 L74 43.6 L68.2 45.2 L66.6 51 L65 45.2 L59 43.6 Z" fill="#d4d4d8" />
      <path d="M249 30 L250.4 25 L251.8 30 L257 31.4 L251.8 32.8 L250.4 38 L249 32.8 L244 31.4 Z" fill="#d4d4d8" />

      {/* Floating dots */}
      <circle cx="55" cy="80" r="5" fill="#e4e4e7" />
      <circle cx="265" cy="74" r="7" fill="#e4e4e7" />
      <circle cx="260" cy="118" r="4" fill="#e4e4e7" />
      <circle cx="60" cy="118" r="4" fill="#e4e4e7" />
      <circle cx="110" cy="140" r="3" fill="#d4d4d8" />
      <circle cx="210" cy="140" r="3" fill="#d4d4d8" />
    </svg>
  );
}

function OtpIllustration() {
  return (
    <svg viewBox="0 0 320 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background */}
      <circle cx="160" cy="80" r="62" fill="#f4f4f5" />

      {/* Envelope body */}
      <rect x="90" y="52" width="140" height="90" rx="8" fill="#3f3f46" />
      {/* Envelope flap */}
      <path d="M90 60 L160 105 L230 60" stroke="#52525b" strokeWidth="2" fill="none" />
      {/* Envelope fold lines */}
      <path d="M90 142 L130 108" stroke="#52525b" strokeWidth="1.5" />
      <path d="M230 142 L190 108" stroke="#52525b" strokeWidth="1.5" />

      {/* Code badge */}
      <rect x="128" y="32" width="64" height="28" rx="8" fill="white" stroke="#e4e4e7" strokeWidth="1.5" />
      <rect x="136" y="43" width="10" height="6" rx="2" fill="#d4d4d8" />
      <rect x="150" y="43" width="10" height="6" rx="2" fill="#27272a" />
      <rect x="164" y="43" width="10" height="6" rx="2" fill="#d4d4d8" />

      {/* Sparkles */}
      <path d="M60 50 L61.6 44 L63.2 50 L69 51.6 L63.2 53.2 L61.6 59 L60 53.2 L54 51.6 Z" fill="#d4d4d8" />
      <path d="M252 44 L253.4 38 L254.8 44 L260 45.4 L254.8 46.8 L253.4 52 L252 46.8 L247 45.4 Z" fill="#d4d4d8" />

      {/* Floating dots */}
      <circle cx="55" cy="95" r="5" fill="#e4e4e7" />
      <circle cx="265" cy="88" r="7" fill="#e4e4e7" />
      <circle cx="100" cy="140" r="3" fill="#d4d4d8" />
      <circle cx="220" cy="140" r="3" fill="#d4d4d8" />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      if (error) setError(error.message);
      else setStep("otp");
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
      if (error) setError(error.message);
      else {
        router.push("/courses");
        router.refresh();
      }
    });
  }

  if (step === "otp") {
    return (
      <div className="w-full max-w-sm">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="flex h-40 items-center justify-center border-b border-zinc-100 bg-zinc-50 px-6">
            <OtpIllustration />
          </div>
          <div className="px-8 py-8 sm:px-10">
            <h1 className="mb-1 text-2xl font-medium tracking-tight text-zinc-900">
              Check your email
            </h1>
            <p className="mb-7 text-sm text-zinc-500">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-zinc-700">{email}</span>.
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
                <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" disabled={isPending || otp.length < 6} className="w-full">
                {isPending ? "Verifying…" : "Verify email"}
              </Button>
            </form>
          </div>
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
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="flex h-40 items-center justify-center border-b border-zinc-100 bg-zinc-50 px-6">
          <SignupIllustration />
        </div>
        <div className="px-8 py-8 sm:px-10">
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-zinc-900">
            Create an account
          </h1>
          <p className="mb-7 text-sm text-zinc-500">
            Free forever. Help students who come after you.
          </p>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <Input id="name" label="Display name" type="text" placeholder="Ada Lovelace"
              value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="email" label="Email" type="email" placeholder="you@university.edu"
              value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <PasswordInput id="password" label="Password" placeholder="min. 8 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />

            {error && (
              <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" disabled={isPending} className="mt-1 w-full">
              {isPending ? "Creating account…" : "Sign up"}
            </Button>
          </form>
        </div>
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
