"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

function AccountIllustration() {
  return (
    <svg viewBox="0 0 320 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="160" cy="78" r="62" fill="#eef2ff" />
      <rect x="96" y="28" width="128" height="100" rx="12" fill="white" stroke="#e0e7ff" strokeWidth="1.5" />
      <circle cx="160" cy="68" r="22" fill="#4f46e5" />
      <circle cx="160" cy="60" r="10" fill="#6366f1" />
      <path d="M138 94 Q141 78 160 78 Q179 78 182 94" fill="#6366f1" />
      <rect x="122" y="100" width="76" height="5" rx="2.5" fill="#c7d2fe" />
      <rect x="132" y="110" width="56" height="4" rx="2" fill="#e0e7ff" />
      <circle cx="200" cy="40" r="14" fill="#4f46e5" />
      <path d="M196 44 L203 37 M195 45 L202 38 L206 42 L199 49 Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M63 42 L64.4 36 L65.8 42 L72 43.4 L65.8 44.8 L64.4 51 L63 44.8 L57 43.4 Z" fill="#c7d2fe" />
      <path d="M248 56 L249.2 51 L250.4 56 L255 57.2 L250.4 58.4 L249.2 63.4 L248 58.4 L243 57.2 Z" fill="#a5b4fc" />
      <circle cx="78" cy="105" r="5" fill="#e0e7ff" />
      <circle cx="244" cy="105" r="4" fill="#e0e7ff" />
      <circle cx="62" cy="118" r="3.5" fill="#eef2ff" />
      <circle cx="258" cy="118" r="3.5" fill="#eef2ff" />
    </svg>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [nameMsg, setNameMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [nameError, setNameError] = useState("");
  const [pwError, setPwError] = useState("");
  const [nameLoading, startNameTransition] = useTransition();
  const [pwLoading, startPwTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setEmail(data.user.email ?? "");
      setDisplayName(data.user.user_metadata?.display_name ?? "");
    });
  }, [router]);

  function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    setNameMsg(""); setNameError("");
    startNameTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ data: { display_name: displayName } });
      if (error) setNameError(error.message);
      else { setNameMsg("Name updated."); router.refresh(); }
    });
  }

  function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(""); setPwError("");
    startPwTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) setPwError(error.message);
      else { setPwMsg("Password updated."); setNewPassword(""); }
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-8 pr-8 sm:pr-10">
      <div className="mx-auto max-w-xl">
        {/* Illustration */}
        <div className="mb-8 flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 px-6">
          <AccountIllustration />
        </div>

        <h1 className="mb-1 text-2xl font-semibold text-zinc-900">Account settings</h1>
        <p className="mb-8 text-sm text-zinc-500">Manage your display name and password.</p>

        <div className="flex flex-col gap-6">
          {/* Profile */}
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-6">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900">Profile</h2>
            <form onSubmit={handleNameSave} className="flex flex-col gap-4">
              <Input id="email" label="Email" type="email" value={email} disabled className="bg-zinc-50 text-zinc-400" />
              <Input
                id="display_name"
                label="Display name"
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              {nameError && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{nameError}</p>}
              {nameMsg && <p className="rounded-xl bg-green-50 px-3.5 py-2.5 text-sm text-green-700">{nameMsg}</p>}
              <div>
                <Button type="submit" disabled={nameLoading} size="sm">
                  {nameLoading ? "Saving…" : "Save name"}
                </Button>
              </div>
            </form>
          </div>

          {/* Password */}
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-6">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900">Change password</h2>
            <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
              <PasswordInput
                id="new_password"
                label="New password"
                placeholder="min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
              {pwError && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{pwError}</p>}
              {pwMsg && <p className="rounded-xl bg-green-50 px-3.5 py-2.5 text-sm text-green-700">{pwMsg}</p>}
              <div>
                <Button type="submit" disabled={pwLoading} size="sm">
                  {pwLoading ? "Saving…" : "Update password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
