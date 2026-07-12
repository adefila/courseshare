import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseSearch } from "@/components/courses/CourseSearch";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 12;

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

function buildHref(p: number, q?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (p > 1) params.set("page", String(p));
  const s = params.toString();
  return `/courses${s ? `?${s}` : ""}`;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("courses")
    .select(
      "id, course_name, course_code, university, semester, year, description, created_at, created_by",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (q?.trim()) {
    const like = `%${q.trim()}%`;
    query = query.or(`course_name.ilike.${like},course_code.ilike.${like},university.ilike.${like}`);
  }

  const [
    { data: courses, count: totalCount, error: coursesError },
    { data: universityRows },
    { count: totalResourceCount },
  ] = await Promise.all([
    query.range(from, to),
    supabase.from("courses").select("university").order("university"),
    supabase
      .from("resources")
      .select("*", { count: "exact", head: true })
      .eq("is_removed", false),
  ]);
  if (coursesError) console.error("Supabase error:", coursesError.message);

  const schools = [...new Set((universityRows ?? []).map((r) => r.university))];
  const totalPages = Math.ceil((totalCount ?? 0) / PAGE_SIZE);
  const isFiltered = !!q;

  const ids = (courses ?? []).map((c) => c.id);

  type ResourceRow = {
    course_id: string;
    uploader: { display_name: string | null } | null;
  };

  const { data: resourceRows } = ids.length
    ? await supabase
        .from("resources")
        .select("course_id, uploader:profiles!uploaded_by(display_name)")
        .in("course_id", ids)
        .eq("is_removed", false)
        .order("created_at", { ascending: false })
    : { data: [] as ResourceRow[] };

  const countMap: Record<string, number> = {};
  const contributorsMap: Record<string, { name: string }[]> = {};

  for (const row of (resourceRows ?? []) as ResourceRow[]) {
    countMap[row.course_id] = (countMap[row.course_id] ?? 0) + 1;
    const name = row.uploader?.display_name;
    if (name) {
      if (!contributorsMap[row.course_id]) contributorsMap[row.course_id] = [];
      const existing = contributorsMap[row.course_id];
      if (existing.length < 4 && !existing.some((c) => c.name === name)) {
        existing.push({ name });
      }
    }
  }

  const enriched = (courses ?? []).map((c) => ({
    ...c,
    resource_count: countMap[c.id] ?? 0,
    contributors: contributorsMap[c.id] ?? [],
  }));

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-8 pr-8 sm:pr-10">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Browse Courses</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {isFiltered
              ? `${totalCount ?? 0} result${(totalCount ?? 0) !== 1 ? "s" : ""} for "${q}"`
              : `${totalCount ?? 0}+ courses across ${schools.length} universities`}
          </p>
        </div>
        <Link href="/courses/new">
          <Button className="w-full sm:w-auto">
            <svg className="mr-1.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Course
          </Button>
        </Link>
      </div>

      {/* Stats strip — only on page 1 when not filtered */}
      {!isFiltered && page === 1 && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
            <p className="font-mono text-[64px] font-bold leading-none text-zinc-900">{totalCount ?? 0}+</p>
            <p className="mt-2 text-xs text-zinc-500">Courses uploaded</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
            <p className="font-mono text-[64px] font-bold leading-none text-zinc-900">{schools.length}</p>
            <p className="mt-2 text-xs text-zinc-500">Universities</p>
          </div>
          <div className="col-span-2 rounded-xl border border-zinc-200 bg-white px-5 py-4 sm:col-span-1">
            <p className="font-mono text-[64px] font-bold leading-none text-zinc-900">{totalResourceCount ?? 0}</p>
            <p className="mt-2 text-xs text-zinc-500">Resources shared</p>
          </div>
        </div>
      )}

      {/* Search bar */}
      <Suspense>
        <CourseSearch defaultQ={q} />
      </Suspense>

      {/* Results */}
      {enriched.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 py-16 text-center">
          <div className="mb-5 w-48">
            <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              {/* Background glow */}
              <circle cx="100" cy="80" r="55" fill="#eef2ff" />
              {/* Back doc */}
              <g transform="rotate(-10 100 90)">
                <rect x="65" y="35" width="56" height="72" rx="6" fill="#c7d2fe" />
                <rect x="74" y="50" width="30" height="3.5" rx="1.5" fill="#a5b4fc" />
                <rect x="74" y="59" width="22" height="3.5" rx="1.5" fill="#a5b4fc" />
              </g>
              {/* Mid doc */}
              <g transform="rotate(-4 100 90)">
                <rect x="62" y="30" width="56" height="72" rx="6" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="1" />
                <rect x="71" y="45" width="30" height="3.5" rx="1.5" fill="#c7d2fe" />
                <rect x="71" y="54" width="22" height="3.5" rx="1.5" fill="#c7d2fe" />
              </g>
              {/* Front doc */}
              <rect x="59" y="25" width="56" height="72" rx="6" fill="white" stroke="#e0e7ff" strokeWidth="1.5" />
              <rect x="68" y="40" width="30" height="3.5" rx="1.5" fill="#f0f0ff" />
              <rect x="68" y="50" width="22" height="3.5" rx="1.5" fill="#f0f0ff" />
              <rect x="68" y="60" width="26" height="3.5" rx="1.5" fill="#f0f0ff" />
              {/* Search circle */}
              <circle cx="128" cy="58" r="20" fill="white" stroke="#e0e7ff" strokeWidth="2" />
              <circle cx="126" cy="56" r="9" stroke="#a5b4fc" strokeWidth="2.5" fill="none" />
              <path d="M132.5 62.5 L138 68" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" />
              {/* Question marks / search lines suggesting no result */}
              <line x1="122" y1="53" x2="130" y2="53" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
              <line x1="122" y1="57" x2="128" y2="57" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
              {/* Sparkles */}
              <path d="M42 44 L43 39 L44 44 L49 45 L44 46 L43 51 L42 46 L37 45 Z" fill="#c7d2fe" />
              <path d="M158 32 L159 28 L160 32 L164 33 L160 34 L159 38 L158 34 L154 33 Z" fill="#a5b4fc" />
              <circle cx="50" cy="110" r="4" fill="#e0e7ff" />
              <circle cx="155" cy="108" r="3" fill="#e0e7ff" />
            </svg>
          </div>
          <p className="mb-1.5 font-semibold text-zinc-700">{q ? `No courses match "${q}"` : "No courses yet"}</p>
          <p className="mb-6 text-sm text-zinc-500">{q ? "Try a different search term." : "Be the first to add one!"}</p>
          <Link href="/courses/new"><Button>Create a course</Button></Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enriched.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
              {/* Prev */}
              {page > 1 ? (
                <Link
                  href={buildHref(page - 1, q)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </Link>
              ) : (
                <span className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-300">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </span>
              )}

              {/* Page numbers */}
              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "…" ? (
                  <span key={`el-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-zinc-400">
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={buildHref(p as number, q)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition ${
                      p === page
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}

              {/* Next */}
              {page < totalPages ? (
                <Link
                  href={buildHref(page + 1, q)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </Link>
              ) : (
                <span className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-300">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
