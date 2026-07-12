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
      {/* Ambient blobs */}
      <circle cx="160" cy="85" r="65" fill="#f4f4f5" />
      <circle cx="105" cy="75" r="28" fill="#ececec" opacity="0.7" />
      <circle cx="218" cy="95" r="22" fill="#ececec" opacity="0.5" />

      {/* Padlock shackle */}
      <path d="M133 88 L133 58 Q133 34 155 34 L165 34 Q187 34 187 58 L187 88"
        stroke="#c4c4c8" strokeWidth="9" strokeLinecap="round" fill="none" />

      {/* Padlock body */}
      <rect x="118" y="83" width="84" height="60" rx="10" fill="#27272a" />

      {/* Keyhole */}
      <circle cx="160" cy="105" r="9" fill="#52525b" />
      <rect x="156.5" y="109" width="7" height="16" rx="3.5" fill="#52525b" />

      {/* Glint on lock body */}
      <rect x="126" y="91" width="20" height="3" rx="1.5" fill="#3f3f46" />

      {/* Floating circles */}
      <circle cx="62" cy="52" r="8" fill="#e4e4e7" />
      <circle cx="258" cy="62" r="6" fill="#e4e4e7" />
      <circle cx="253" cy="125" r="11" fill="#f4f4f5" />
      <circle cx="67" cy="122" r="9" fill="#f4f4f5" />

      {/* Sparkle top-right */}
      <path d="M241 32 L242.8 25 L244.6 32 L251.5 33.8 L244.6 35.6 L242.8 42.5 L241 35.6 L234 33.8 Z" fill="#d4d4d8" />
      {/* Sparkle top-left */}
      <path d="M52 36 L53.4 30 L54.8 36 L60.8 37.4 L54.8 38.8 L53.4 44.8 L52 38.8 L46 37.4 Z" fill="#e4e4e7" />

      {/* Bottom dots */}
      <circle cx="92" cy="140" r="3" fill="#d4d4d8" />
      <circle cx="228" cy="140" r="3" fill="#d4d4d8" />
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
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    });
  }

  return (
    <div className="w-full max-w-sm">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {/* Illustration header */}
        <div className="flex h-40 items-center justify-center border-b border-zinc-100 bg-zinc-50 px-6">
          <LoginIllustration />
        </div>

        {/* Form */}
        <div className="px-5 py-7 sm:px-7">
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-zinc-900">
            Welcome back
          </h1>
          <p className="mb-7 text-sm text-zinc-500">
            Sign in to upload and manage course resources.
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
            <PasswordInput
              id="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </p>
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
