"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const SEMESTERS = ["1st Semester", "2nd Semester", "Harmattan", "Rain"] as const;
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most resources" },
  { value: "oldest", label: "Oldest" },
] as const;
type SortValue = typeof SORTS[number]["value"];

export function CourseSearch({
  defaultQ = "",
  defaultSemester = "",
  defaultSort = "newest",
  defaultUniversity = "",
  universities = [],
}: {
  defaultQ?: string;
  defaultSemester?: string;
  defaultSort?: SortValue;
  defaultUniversity?: string;
  universities?: string[];
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultQ);
  const [semester, setSemester] = useState(defaultSemester);
  const [sort, setSort] = useState<SortValue>(defaultSort);
  const [university, setUniversity] = useState(defaultUniversity);
  const [semOpen, setSemOpen] = useState(false);
  const [uniOpen, setUniOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const semRef = useRef<HTMLDivElement>(null);
  const uniRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (semRef.current && !semRef.current.contains(e.target as Node)) setSemOpen(false);
      if (uniRef.current && !uniRef.current.contains(e.target as Node)) setUniOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function navigate(value: string, sem: string, s: SortValue, uni: string) {
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    if (sem) params.set("semester", sem);
    if (uni) params.set("university", uni);
    if (s !== "newest") params.set("sort", s);
    const qs = params.toString();
    router.push(`/courses${qs ? `?${qs}` : ""}`);
  }

  // Debounced live search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate(q, semester, sort, university);
    }, 320);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    navigate(q, semester, sort, university);
  }

  function pickSemester(s: string) {
    const next = semester === s ? "" : s;
    setSemester(next);
    setSemOpen(false);
    navigate(q, next, sort, university);
  }

  function pickSort(s: SortValue) {
    setSort(s);
    setSortOpen(false);
    navigate(q, semester, s, university);
  }

  function pickUniversity(u: string) {
    const next = university === u ? "" : u;
    setUniversity(next);
    setUniOpen(false);
    navigate(q, semester, sort, next);
  }

  const hasFilter = !!semester || !!university;
  const sortLabel = SORTS.find((s) => s.value === sort)?.label ?? "Newest";

  return (
    <div className="mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center">
      {/* Search */}
      <form onSubmit={handleSubmit} className="relative flex-1">
        <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search courses…"
          className="w-full rounded-full border border-indigo-200 bg-indigo-50/40 py-2.5 pl-10 pr-9 text-sm text-zinc-800 transition placeholder:text-zinc-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        {q && (
          <button type="button" onClick={() => { setQ(""); navigate("", semester, sort, university); }}
            className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-zinc-400 hover:bg-indigo-100 hover:text-indigo-600">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        )}
        <button type="submit" className="sr-only">Search</button>
      </form>

      {/* University filter */}
      {universities.length > 0 && (
        <div ref={uniRef} className="relative shrink-0">
          <button type="button" onClick={() => setUniOpen((o) => !o)}
            className={`cursor-pointer flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all sm:w-auto ${
              university ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200"
              : uniOpen ? "border-indigo-300 bg-indigo-50 text-indigo-700"
              : "border-zinc-200 bg-white text-zinc-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            }`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M5 21V7l7-4 7 4v14" />
            </svg>
            <span className="max-w-[120px] truncate">{university || "University"}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`transition-transform ${uniOpen ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
          </button>
          {uniOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/60">
              <div className="max-h-60 overflow-y-auto px-2 py-2">
                <p className="mb-1 px-3 font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-400">University</p>
                {universities.map((u) => (
                  <button key={u} type="button" onClick={() => pickUniversity(u)}
                    className={`cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors text-left ${university === u ? "bg-indigo-50 font-semibold text-indigo-700" : "text-zinc-600 hover:bg-zinc-50"}`}>
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${university === u ? "border-indigo-600 bg-indigo-600" : "border-zinc-300"}`}>
                      {university === u && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
                    </span>
                    <span className="line-clamp-1">{u}</span>
                  </button>
                ))}
              </div>
              {university && (
                <div className="border-t border-zinc-100 px-2 py-2">
                  <button type="button" onClick={() => { setUniversity(""); setUniOpen(false); navigate(q, semester, sort, ""); }}
                    className="cursor-pointer flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Semester filter */}
      <div ref={semRef} className="relative shrink-0">
        <button type="button" onClick={() => setSemOpen((o) => !o)}
          className={`cursor-pointer flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all sm:w-auto ${
            semester ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200"
            : semOpen ? "border-indigo-300 bg-indigo-50 text-indigo-700"
            : "border-zinc-200 bg-white text-zinc-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          }`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          {semester || "Semester"}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`transition-transform ${semOpen ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {semOpen && (
          <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/60">
            <div className="px-2 py-2">
              <p className="mb-1 px-3 font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-400">Semester</p>
              {SEMESTERS.map((s) => (
                <button key={s} type="button" onClick={() => pickSemester(s)}
                  className={`cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${semester === s ? "bg-indigo-50 font-semibold text-indigo-700" : "text-zinc-600 hover:bg-zinc-50"}`}>
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${semester === s ? "border-indigo-600 bg-indigo-600" : "border-zinc-300"}`}>
                    {semester === s && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
                  </span>
                  {s}
                </button>
              ))}
            </div>
            {semester && (
              <div className="border-t border-zinc-100 px-2 py-2">
                <button type="button" onClick={() => { setSemester(""); setSemOpen(false); navigate(q, "", sort, university); }}
                  className="cursor-pointer flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  Clear
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sort */}
      <div ref={sortRef} className="relative shrink-0">
        <button type="button" onClick={() => setSortOpen((o) => !o)}
          className={`cursor-pointer flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all sm:w-auto ${
            sortOpen ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-zinc-200 bg-white text-zinc-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          }`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M6 12h12M9 18h6" />
          </svg>
          {sortLabel}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {sortOpen && (
          <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/60">
            <div className="px-2 py-2">
              <p className="mb-1 px-3 font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-400">Sort by</p>
              {SORTS.map((s) => (
                <button key={s.value} type="button" onClick={() => pickSort(s.value)}
                  className={`cursor-pointer flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${sort === s.value ? "bg-indigo-50 font-semibold text-indigo-700" : "text-zinc-600 hover:bg-zinc-50"}`}>
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${sort === s.value ? "border-indigo-600 bg-indigo-600" : "border-zinc-300"}`}>
                    {sort === s.value && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>}
                  </span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear all filters pill */}
      {hasFilter && (
        <button type="button"
          onClick={() => { setSemester(""); setUniversity(""); navigate(q, "", sort, ""); }}
          className="cursor-pointer shrink-0 rounded-full border border-zinc-200 px-3 py-2 text-xs text-zinc-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
          Clear filters
        </button>
      )}
    </div>
  );
}
