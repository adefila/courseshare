"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV = [
  {
    href: "/courses",
    label: "Browse",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

function NavContent({
  user,
  pathname,
  onSignOut,
}: {
  user: User | null;
  pathname: string;
  onSignOut: () => void;
}) {
  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Account";

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-zinc-100 px-5">
        <Link
          href="/courses"
          className="flex items-center gap-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
          <span className="font-mono text-[13px] font-bold uppercase tracking-widest text-zinc-900">CourseShare</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <p className="mb-1 px-3 font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400">
          Library
        </p>
        <div className="space-y-0.5">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/") && pathname !== "/courses/new");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-indigo-50 font-medium text-indigo-700"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          {user && (
            <Link
              href="/courses/new"
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === "/courses/new"
                  ? "bg-zinc-100 font-medium text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Course
            </Link>
          )}
        </div>

        {user && (
          <>
            <p className="mb-1 mt-4 px-3 text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              Account
            </p>
            <div className="space-y-0.5">
              <Link
                href="/account"
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === "/account"
                    ? "bg-zinc-100 font-medium text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Edit profile
              </Link>
            </div>
          </>
        )}
      </nav>

      {/* User section */}
      <div className="shrink-0 border-t border-zinc-100 px-3 py-3">
        {user ? (
          <div className="space-y-0.5">
            <div className="px-3 py-1.5">
              <p className="truncate text-[13px] font-medium text-zinc-900">{displayName}</p>
              <p className="truncate text-[11px] text-zinc-400">{user.email}</p>
            </div>
            <button
              onClick={onSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Sign up free
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
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
    router.push("/courses");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:hidden">
        <Link href="/courses" className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
          <span className="font-mono text-[12px] font-bold uppercase tracking-widest text-zinc-900">CourseShare</span>
        </Link>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="8" x2="21" y2="8" />
              <line x1="3" y1="16" x2="21" y2="16" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col border-r border-zinc-200 bg-white sm:flex">
        <NavContent user={user} pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-zinc-200 bg-white sm:hidden">
            <NavContent user={user} pathname={pathname} onSignOut={handleSignOut} />
          </aside>
        </>
      )}
    </>
  );
}
