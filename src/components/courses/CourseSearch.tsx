"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SEMESTERS = ["1st Semester", "2nd Semester", "Harmattan", "Rain"] as const;

export function CourseSearch({
  defaultQ = "",
  defaultSemester = "",
}: {
  defaultQ?: string;
  defaultSemester?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQ);
  const [semester, setSemester] = useState(defaultSemester);
  const [filterOpen, setFilterOpen] = useState(!!defaultSemester);

  function navigate(value: string, sem: string) {
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    if (sem) params.set("semester", sem);
    const qs = params.toString();
    router.push(`/courses${qs ? `?${qs}` : ""}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(q, semester);
  }

  function handleSemesterClick(s: string) {
    const next = semester === s ? "" : s;
    setSemester(next);
    navigate(q, next);
  }

  const hasFilter = !!semester;

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit}>
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
            className="w-full rounded-full border border-indigo-200 bg-indigo-50/40 py-3 pl-11 pr-20 text-base text-zinc-800 transition placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 sm:text-sm"
          />

          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {q && (
              <button
                type="button"
                onClick={() => { setQ(""); navigate("", semester); }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-indigo-100 hover:text-indigo-600"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            {/* Filter toggle */}
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                hasFilter || filterOpen
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
              aria-label="Toggle filters"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Filter panel — CSS grid height animation */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          filterOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-2xl border border-indigo-100 bg-white px-4 py-3">
            <span className="shrink-0 font-mono text-[10px] font-medium uppercase tracking-wide text-zinc-400">
              Semester
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SEMESTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSemesterClick(s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
                    semester === s
                      ? "bg-indigo-600 text-white scale-105"
                      : "border border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {hasFilter && (
              <button
                type="button"
                onClick={() => { setSemester(""); navigate(q, ""); }}
                className="ml-auto text-[11px] text-zinc-400 transition-colors hover:text-zinc-600"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
