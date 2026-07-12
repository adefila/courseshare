"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CourseSearch({ defaultQ = "" }: { defaultQ?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQ);

  function navigate(value: string) {
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    const qs = params.toString();
    router.push(`/courses${qs ? `?${qs}` : ""}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(q);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        {/* Search icon */}
        <svg
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search courses or universities…"
          className="w-full rounded-full border border-indigo-200 bg-indigo-50/40 py-3 pl-11 pr-20 text-sm text-zinc-800 transition placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {q && (
            <button
              type="button"
              onClick={() => { setQ(""); router.push("/courses"); }}
              className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-indigo-100 hover:text-indigo-600"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          {/* Filter / submit button */}
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-500"
            aria-label="Search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="12" y1="18" x2="12" y2="18" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
