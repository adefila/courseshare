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
  const [originalName, setOriginalName] = useState("");
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
      const name = data.user.user_metadata?.display_name ?? "";
      setDisplayName(name);
      setOriginalName(name);
    });
  }, [router]);

  function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    setNameMsg(""); setNameError("");
    if (!displayName.trim()) { setNameError("Display name is required"); return; }
    startNameTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ data: { display_name: displayName } });
      if (error) setNameError(error.message);
      else { setNameMsg("Name updated."); setOriginalName(displayName); router.refresh(); }
    });
  }

  function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(""); setPwError("");
    if (!newPassword) { setPwError("Password is required"); return; }
    if (newPassword.length < 8) { setPwError("Password must be at least 8 characters"); return; }
    startPwTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) setPwError(error.message);
      else { setPwMsg("Password updated."); setNewPassword(""); }
    });
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white">
        {/* Illustration header — same pattern as new course page */}
        <div className="flex h-40 items-center justify-center rounded-t-2xl border-b border-zinc-100 bg-zinc-50 px-6">
          <AccountIllustration />
        </div>

        <div className="px-8 py-8 sm:px-10">
          <h1 className="mb-1 text-2xl font-semibold text-zinc-900">Account settings</h1>
          <p className="mb-8 text-sm text-zinc-500">Manage your display name and password.</p>

          <div className="flex flex-col gap-8">
            {/* Profile */}
            <div>
              <h2 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500">Profile</h2>
              <form onSubmit={handleNameSave} noValidate className="flex flex-col gap-4">
                <Input id="email" label="Email" type="email" value={email} disabled className="bg-zinc-50 text-zinc-400" />
                <Input
                  id="display_name"
                  label="Display name"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => { setDisplayName(e.target.value); setNameError(""); }}
                  error={nameError}
                />
                {nameMsg && <p className="text-sm text-green-700">{nameMsg}</p>}
                <div>
                  <Button type="submit" disabled={nameLoading || displayName.trim() === originalName.trim()} size="sm">
                    {nameLoading ? "Saving…" : "Save name"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="border-t border-zinc-100" />

            {/* Password */}
            <div>
              <h2 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500">Change password</h2>
              <form onSubmit={handlePasswordSave} noValidate className="flex flex-col gap-4">
                <PasswordInput
                  id="new_password"
                  label="New password"
                  placeholder="min. 8 characters"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPwError(""); }}
                  autoComplete="new-password"
                  error={pwError}
                />
                {pwMsg && <p className="text-sm text-green-700">{pwMsg}</p>}
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
    </div>
  );
}
