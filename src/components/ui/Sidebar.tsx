"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
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
  onNavClick,
}: {
  user: User | null;
  pathname: string;
  onSignOut: () => void;
  onNavClick?: () => void;
}) {
  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Account";

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center px-5" style={{ borderBottom: "0.5px solid #ebebf0" }}>
        <Link href="/" onClick={onNavClick} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
          <span className="font-mono text-[13px] font-bold uppercase tracking-widest text-zinc-900">CourseShare</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <p className="mb-1 px-3 font-mono text-[10px] font-medium uppercase tracking-wide text-zinc-400">
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
                onClick={onNavClick}
                className={`cursor-pointer flex items-center gap-2.5 rounded-full px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-indigo-50 font-semibold text-indigo-700"
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
              onClick={onNavClick}
              className={`cursor-pointer flex items-center gap-2.5 rounded-full px-3 py-2 text-sm transition-colors ${
                pathname === "/courses/new"
                  ? "bg-zinc-100 font-semibold text-zinc-900"
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
            <p className="mb-1 mt-4 px-3 font-mono text-[10px] font-medium uppercase tracking-wide text-zinc-400">
              Account
            </p>
            <div className="space-y-0.5">
              <Link
                href="/account"
                onClick={onNavClick}
                className={`cursor-pointer flex items-center gap-2.5 rounded-full px-3 py-2 text-sm transition-colors ${
                  pathname === "/account"
                    ? "bg-zinc-100 font-semibold text-zinc-900"
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
      <div className="shrink-0 px-3 py-3" style={{ borderTop: "0.5px solid #ebebf0" }}>
        {user ? (
          <div className="space-y-0.5">
            <div className="px-4 py-1.5">
              <p className="truncate text-[13px] font-medium text-zinc-900">{displayName}</p>
              <p className="truncate text-[11px] text-zinc-400">{user.email}</p>
            </div>
            <button
              onClick={onSignOut}
              className="cursor-pointer flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
              onClick={onNavClick}
              className="cursor-pointer block rounded-full px-4 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={onNavClick}
              className="cursor-pointer block rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
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

  /* Prevent body scroll when drawer is open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between bg-white/90 px-4 backdrop-blur-sm sm:hidden" style={{ borderBottom: "0.5px solid #e8e8f0" }}>
        <Link href="/" className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
          <span className="font-mono text-[13px] font-bold uppercase tracking-widest text-zinc-900">CourseShare</span>
        </Link>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="cursor-pointer relative flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100"
          aria-label="Toggle menu"
        >
          {/* Hamburger */}
          <span
            className={`absolute transition-all duration-200 ${
              mobileOpen ? "opacity-0 scale-75 rotate-90" : "opacity-100 scale-100 rotate-0"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="8" x2="21" y2="8" />
              <line x1="3" y1="16" x2="21" y2="16" />
            </svg>
          </span>
          {/* Close */}
          <span
            className={`absolute transition-all duration-200 ${
              mobileOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-90"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </span>
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col bg-gradient-to-b from-white to-indigo-50/10 sm:flex" style={{ borderRight: "0.5px solid #e8e8f0" }}>
        <NavContent user={user} pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] sm:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer — always mounted, slides in/out */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-white sm:hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${
          mobileOpen ? "translate-x-0 shadow-[4px_0_24px_rgba(0,0,0,0.06)]" : "-translate-x-full"
        }`}
        style={{ borderRight: "0.5px solid #e8e8f0" }}
      >
        <NavContent
          user={user}
          pathname={pathname}
          onSignOut={handleSignOut}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
}
