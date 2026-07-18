"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

function LoginIllustration() {
  return (
    <svg viewBox="0 0 320 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="160" cy="85" r="65" fill="#eef2ff" />
      <circle cx="105" cy="75" r="28" fill="#e0e7ff" opacity="0.7" />
      <circle cx="218" cy="95" r="22" fill="#e0e7ff" opacity="0.5" />
      <path d="M133 88 L133 58 Q133 34 155 34 L165 34 Q187 34 187 58 L187 88"
        stroke="#a5b4fc" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="118" y="83" width="84" height="60" rx="10" fill="#4f46e5" />
      <circle cx="160" cy="105" r="9" fill="#6366f1" />
      <rect x="156.5" y="109" width="7" height="16" rx="3.5" fill="#6366f1" />
      <rect x="126" y="91" width="20" height="3" rx="1.5" fill="#6366f1" />
      <circle cx="62" cy="52" r="8" fill="#c7d2fe" />
      <circle cx="258" cy="62" r="6" fill="#c7d2fe" />
      <circle cx="253" cy="125" r="11" fill="#eef2ff" />
      <circle cx="67" cy="122" r="9" fill="#eef2ff" />
      <path d="M241 32 L242.8 25 L244.6 32 L251.5 33.8 L244.6 35.6 L242.8 42.5 L241 35.6 L234 33.8 Z" fill="#a5b4fc" />
      <path d="M52 36 L53.4 30 L54.8 36 L60.8 37.4 L54.8 38.8 L53.4 44.8 L52 38.8 L46 37.4 Z" fill="#c7d2fe" />
      <circle cx="92" cy="140" r="3" fill="#a5b4fc" />
      <circle cx="228" cy="140" r="3" fill="#a5b4fc" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/courses";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setFormError("");

    let valid = true;
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    if (!valid) return;

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setFormError(error.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    });
  }

  return (
    <div className="w-full max-w-sm">
      <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "0.5px solid #e4e4e7" }}>
        <div className="flex h-40 items-center justify-center bg-gradient-to-b from-indigo-50/60 to-white px-6" style={{ borderBottom: "0.5px solid #ebebf0" }}>
          <LoginIllustration />
        </div>

        <div className="px-5 py-7 sm:px-7">
          <h1 className="mb-1 text-2xl font-semibold text-zinc-900">Welcome back</h1>
          <p className="mb-7 text-sm text-zinc-500">Sign in to upload and manage course resources.</p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              autoComplete="email"
              error={emailError}
            />
            <div className="flex flex-col gap-1.5">
              <PasswordInput
                id="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                autoComplete="current-password"
                error={passwordError}
              />
              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-zinc-400 hover:text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            {formError && (
              <p className="text-sm text-red-500">{formError}</p>
            )}

            <Button type="submit" disabled={isPending} className="mt-1 w-full">
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-zinc-500">
        No account?{" "}
        <Link href="/signup" className="font-medium text-zinc-900 hover:underline">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
