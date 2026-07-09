"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-3">
        <Link href="/" className="text-[17px] font-semibold text-zinc-900">
          Course<span className="text-indigo-600">Share</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/courses"
            className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            Browse
          </Link>
          {user ? (
            <>
              <Link href="/courses/new">
                <Button size="sm" className="whitespace-nowrap">
                  <svg className="sm:mr-1.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="hidden sm:inline">New Course</span>
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleSignOut} className="whitespace-nowrap">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
