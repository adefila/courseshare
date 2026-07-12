"use client";

import { useState, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

function SignupIllustration() {
  return (
    <svg viewBox="0 0 320 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="160" cy="80" r="62" fill="#f4f4f5" />
      <circle cx="118" cy="62" r="19" fill="#d4d4d8" />
      <path d="M86 128 Q88 103 118 103 Q148 103 150 128" fill="#d4d4d8" />
      <circle cx="202" cy="62" r="19" fill="#d4d4d8" />
      <path d="M170 128 Q172 103 202 103 Q232 103 234 128" fill="#d4d4d8" />
      <circle cx="160" cy="58" r="22" fill="#27272a" />
      <path d="M124 126 Q127 98 160 98 Q193 98 196 126" fill="#27272a" />
      <circle cx="198" cy="36" r="13" fill="white" stroke="#e4e4e7" strokeWidth="1.5" />
      <path d="M198 30 L198 42 M192 36 L204 36" stroke="#52525b" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M65 42 L66.6 36 L68.2 42 L74 43.6 L68.2 45.2 L66.6 51 L65 45.2 L59 43.6 Z" fill="#d4d4d8" />
      <path d="M249 30 L250.4 25 L251.8 30 L257 31.4 L251.8 32.8 L250.4 38 L249 32.8 L244 31.4 Z" fill="#d4d4d8" />
      <circle cx="55" cy="80" r="5" fill="#e4e4e7" />
      <circle cx="265" cy="74" r="7" fill="#e4e4e7" />
      <circle cx="260" cy="118" r="4" fill="#e4e4e7" />
      <circle cx="60" cy="118" r="4" fill="#e4e4e7" />
    </svg>
  );
}

function CheckEmailIllustration() {
  return (
    <svg viewBox="0 0 320 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="160" cy="80" r="62" fill="#f4f4f5" />
      <rect x="90" y="48" width="140" height="92" rx="8" fill="#27272a" />
      <path d="M90 56 L160 102 L230 56" stroke="#3f3f46" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M90 140 L128 110" stroke="#3f3f46" strokeWidth="1.5" />
      <path d="M230 140 L192 110" stroke="#3f3f46" strokeWidth="1.5" />
      {/* Checkmark badge */}
      <circle cx="205" cy="44" r="16" fill="white" stroke="#e4e4e7" strokeWidth="1.5" />
      <path d="M197 44 L203 50 L214 38" stroke="#27272a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 50 L61.6 44 L63.2 50 L69 51.6 L63.2 53.2 L61.6 59 L60 53.2 L54 51.6 Z" fill="#d4d4d8" />
      <path d="M252 44 L253.4 38 L254.8 44 L260 45.4 L254.8 46.8 L253.4 52 L252 46.8 L247 45.4 Z" fill="#d4d4d8" />
      <circle cx="55" cy="95" r="5" fill="#e4e4e7" />
      <circle cx="265" cy="88" r="7" fill="#e4e4e7" />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      else setStep("verify");
    });
  }

  function handleCodeChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every((d) => d !== "")) {
      verifyCode(next.join(""));
    }
  }

  function handleCodeKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleCodePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
      verifyCode(pasted);
    }
  }

  function verifyCode(token: string) {
    setError("");
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({ email, token, type: "signup" });
      if (error) {
        setError(error.message);
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        router.push("/courses");
        router.refresh();
      }
    });
  }

  function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    verifyCode(code.join(""));
  }

  if (step === "verify") {
    return (
      <div className="w-full max-w-sm">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="flex h-40 items-center justify-center border-b border-zinc-100 bg-zinc-50 px-6">
            <CheckEmailIllustration />
          </div>
          <div className="px-5 py-7 sm:px-7 text-center">
            <h1 className="mb-1 text-2xl font-medium tracking-tight text-zinc-900">
              Check your email
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-zinc-700">{email}</span>.
            </p>

            <form onSubmit={handleVerifySubmit} className="flex flex-col items-center gap-5">
              <div className="flex gap-2" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="h-12 w-10 rounded-xl border border-zinc-200 bg-white text-center text-lg font-semibold text-zinc-900 transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && (
                <p className="w-full rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" disabled={isPending || code.some((d) => !d)} className="w-full">
                {isPending ? "Verifying…" : "Verify email"}
              </Button>
            </form>

            <p className="mt-5 text-xs text-zinc-400">
              Didn&apos;t get it? Check your spam folder.
            </p>
          </div>
        </div>
        <p className="mt-5 text-center text-sm text-zinc-500">
          Wrong email?{" "}
          <button onClick={() => { setStep("form"); setCode(["", "", "", "", "", ""]); setError(""); }}
            className="font-medium text-zinc-900 hover:underline">
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
        <div className="px-5 py-7 sm:px-7">
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-zinc-900">
            Create an account
          </h1>
          <p className="mb-6 text-sm text-zinc-500">
            Free forever. Help students who come after you.
          </p>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <Input id="name" label="Display name" type="text" placeholder="Ada Lovelace"
              value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="email" label="Email" type="email" placeholder="you@university.edu"
              value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <PasswordInput id="password" label="Password" placeholder="min. 8 characters"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required minLength={8} autoComplete="new-password" />

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
