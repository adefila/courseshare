"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-3.5">
        <Link href="/" className="text-[17px] font-semibold text-zinc-900 tracking-tight">
          CourseShare
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 sm:flex">
          <Link
            href="/courses"
            className="rounded-full px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            Browse
          </Link>
          {user ? (
            <>
              <Link href="/courses/new">
                <Button size="sm">
                  <svg className="mr-1.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  New Course
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button size="sm" variant="ghost">Log in</Button></Link>
              <Link href="/signup"><Button size="sm">Sign up</Button></Link>
            </>
          )}
        </div>

        {/* Mobile: compact actions + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          {!user && (
            <Link href="/signup"><Button size="sm">Sign up</Button></Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 py-2 sm:hidden">
          <div className="flex flex-col">
            <Link href="/courses" className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
              Browse Courses
            </Link>
            {user ? (
              <>
                <Link href="/courses/new" className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                  New Course
                </Link>
                <button
                  onClick={handleSignOut}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-400 hover:bg-zinc-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
