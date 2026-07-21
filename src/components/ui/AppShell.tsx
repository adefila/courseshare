"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isAuth) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
          <span className="font-mono text-[13px] font-bold uppercase tracking-widest text-zinc-900">CourseShare</span>
        </Link>
        {children}
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      {/* Desktop offset + mobile top-bar spacing */}
      <div className="flex min-h-full flex-col pt-12 sm:pl-[220px] sm:pt-0">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </>
  );
}
