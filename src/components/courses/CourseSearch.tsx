"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ChevronDown = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

interface CourseSearchProps {
  schools: string[];
  defaultQ?: string;
  defaultSchool?: string;
}

export function CourseSearch({ schools, defaultQ = "", defaultSchool = "" }: CourseSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(defaultQ);
  const [school, setSchool] = useState(defaultSchool);
  const [sheetOpen, setSheetOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function navigate(newQ: string, newSchool: string) {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set("q", newQ.trim());
    if (newSchool) params.set("school", newSchool);
    const qs = params.toString();
    router.push(`/courses${qs ? `?${qs}` : ""}`);
  }

  function handleSchoolChange(value: string) {
    setSchool(value);
    navigate(q, value);
    setSheetOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(q, school);
  }

  function handleClear() {
    setQ("");
    setSchool("");
    router.push("/courses");
  }

  const isFiltered = !!(defaultQ || defaultSchool);

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Search input */}
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by course name, code, or university…"
              className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-10 pr-5 text-sm transition placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            />
          </div>

          {/* Desktop: select dropdown */}
          <div className="relative hidden sm:block sm:max-w-[210px]">
            <select
              value={school}
              onChange={(e) => handleSchoolChange(e.target.value)}
              className="w-full appearance-none rounded-full border border-zinc-200 bg-white py-2.5 pl-4 pr-9 text-sm text-zinc-700 transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            >
              <option value="">All universities</option>
              {schools.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <ChevronDown />
            </span>
          </div>

          {/* Mobile: button that opens bottom sheet */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center justify-between gap-2 rounded-full border border-zinc-200 bg-white py-2.5 pl-4 pr-3.5 text-sm text-zinc-700 transition hover:border-zinc-300 sm:hidden"
          >
            <span className={school ? "text-zinc-900 font-medium" : "text-zinc-500"}>
              {school || "All universities"}
            </span>
            <span className="text-zinc-400"><ChevronDown /></span>
          </button>

          {isFiltered && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full px-4 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 sm:hidden"
            onClick={() => setSheetOpen(false)}
          />
          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-zinc-200 bg-white pb-safe sm:hidden">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <span className="text-[15px] font-semibold text-zinc-900">Filter by university</span>
              <button
                onClick={() => setSheetOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto py-2">
              <li>
                <button
                  onClick={() => handleSchoolChange("")}
                  className={`flex w-full items-center justify-between px-5 py-3.5 text-sm transition hover:bg-zinc-50 ${
                    !school ? "font-semibold text-zinc-900" : "text-zinc-600"
                  }`}
                >
                  All universities
                  {!school && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              </li>
              {schools.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => handleSchoolChange(s)}
                    className={`flex w-full items-center justify-between px-5 py-3.5 text-sm transition hover:bg-zinc-50 ${
                      school === s ? "font-semibold text-zinc-900" : "text-zinc-600"
                    }`}
                  >
                    {s}
                    {school === s && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
