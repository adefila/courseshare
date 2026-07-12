"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

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
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-zinc-900">Account</h1>
      <p className="mb-8 text-sm text-zinc-500">Manage your profile and password.</p>

      <div className="flex flex-col gap-6 max-w-xl">
        {/* Profile */}
        <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-6">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">Profile</h2>
          <form onSubmit={handleNameSave} className="flex flex-col gap-4">
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              disabled
              className="bg-zinc-50 text-zinc-400"
            />
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
  );
}
