"use client";

import { useState, useEffect, useRef } from "react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [dropdownOpen]);

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
    setDropdownOpen(false);
    navigate(q, next);
  }

  const hasFilter = !!semester;

  return (
    <div className="mb-8 flex items-center gap-2.5">
      {/* Search — constrained width */}
      <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search courses…"
          className="w-full rounded-full border border-indigo-200 bg-indigo-50/40 py-2.5 pl-10 pr-9 text-sm text-zinc-800 transition placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />

        {q && (
          <button
            type="button"
            onClick={() => { setQ(""); navigate("", semester); }}
            className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 hover:bg-indigo-100 hover:text-indigo-600"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Filter dropdown */}
      <div ref={dropdownRef} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setDropdownOpen((o) => !o)}
          className={`cursor-pointer flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
            hasFilter
              ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200"
              : dropdownOpen
              ? "border-indigo-300 bg-indigo-50 text-indigo-700"
              : "border-zinc-200 bg-white text-zinc-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          {hasFilter ? semester : "Semester"}
          <svg
            width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute left-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/60">
            <div className="px-2 py-2">
              <p className="mb-1 px-3 font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-400">
                Semester
              </p>
              {SEMESTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSemesterClick(s)}
                  className={`cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                    semester === s
                      ? "bg-indigo-50 font-semibold text-indigo-700"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      semester === s ? "border-indigo-600 bg-indigo-600" : "border-zinc-300"
                    }`}
                  >
                    {semester === s && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  {s}
                </button>
              ))}
            </div>

            {hasFilter && (
              <div className="border-t border-zinc-100 px-2 py-2">
                <button
                  type="button"
                  onClick={() => { setSemester(""); setDropdownOpen(false); navigate(q, ""); }}
                  className="cursor-pointer flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Clear filter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
