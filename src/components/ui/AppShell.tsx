"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

const AUTH_PATHS = ["/login", "/signup"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isAuth) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-16">
        {children}
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      {/* Desktop offset + mobile top-bar spacing */}
      <div className="flex min-h-full flex-col pt-12 sm:pl-[220px] sm:pt-0">
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
