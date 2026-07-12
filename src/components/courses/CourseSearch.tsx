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
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by course name, code, or university…"
          className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-10 pr-24 text-sm transition placeholder:text-zinc-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {q && (
            <button
              type="button"
              onClick={() => { setQ(""); router.push("/courses"); }}
              className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="flex h-7 items-center gap-1 rounded-full bg-indigo-600 px-3 text-xs font-medium text-white transition hover:bg-indigo-500"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
