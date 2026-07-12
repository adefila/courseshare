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
      <circle cx="160" cy="80" r="62" fill="#eef2ff" />
      <circle cx="118" cy="62" r="19" fill="#c7d2fe" />
      <path d="M86 128 Q88 103 118 103 Q148 103 150 128" fill="#c7d2fe" />
      <circle cx="202" cy="62" r="19" fill="#c7d2fe" />
      <path d="M170 128 Q172 103 202 103 Q232 103 234 128" fill="#c7d2fe" />
      <circle cx="160" cy="58" r="22" fill="#4f46e5" />
      <path d="M124 126 Q127 98 160 98 Q193 98 196 126" fill="#4f46e5" />
      <circle cx="198" cy="36" r="13" fill="white" stroke="#e0e7ff" strokeWidth="1.5" />
      <path d="M198 30 L198 42 M192 36 L204 36" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M65 42 L66.6 36 L68.2 42 L74 43.6 L68.2 45.2 L66.6 51 L65 45.2 L59 43.6 Z" fill="#a5b4fc" />
      <path d="M249 30 L250.4 25 L251.8 30 L257 31.4 L251.8 32.8 L250.4 38 L249 32.8 L244 31.4 Z" fill="#a5b4fc" />
      <circle cx="55" cy="80" r="5" fill="#c7d2fe" />
      <circle cx="265" cy="74" r="7" fill="#c7d2fe" />
      <circle cx="260" cy="118" r="4" fill="#e0e7ff" />
      <circle cx="60" cy="118" r="4" fill="#e0e7ff" />
    </svg>
  );
}


export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      else {
        router.push("/courses");
        router.refresh();
      }
    });
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
