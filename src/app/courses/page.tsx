import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getPlatformStats } from "@/lib/stats";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseSearch } from "@/components/courses/CourseSearch";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

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

function buildHref(p: number, q?: string, semester?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (semester) params.set("semester", semester);
  if (p > 1) params.set("page", String(p));
  const s = params.toString();
  return `/courses${s ? `?${s}` : ""}`;
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-white" style={{ border: "0.5px solid #e8e8f0" }}>
          <Skeleton className="h-36 w-full rounded-none" />
          <div className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-52" />
            <Skeleton className="mt-4 h-4 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

type EmbeddedResource = {
  is_removed: boolean;
  uploader: { display_name: string | null } | null;
};

async function CourseResults({
  q,
  semester,
  page,
}: {
  q?: string;
  semester?: string;
  page: number;
}) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const supabase = await createClient();

  // Single query: courses with their resources (+ uploader names) embedded,
  // instead of a second dependent round-trip after the course list resolves.
  let query = supabase
    .from("courses")
    .select(
      "id, course_name, course_code, university, semester, year, description, created_at, created_by, resources(is_removed, created_at, uploader:profiles!uploaded_by(display_name))",
      { count: "exact" }
    )
    .eq("resources.is_removed", false)
    .order("created_at", { ascending: false })
    .order("created_at", { referencedTable: "resources", ascending: false });

  if (q?.trim()) {
    const like = `%${q.trim()}%`;
    query = query.or(`course_name.ilike.${like},course_code.ilike.${like},university.ilike.${like}`);
  }
  if (semester?.trim()) {
    query = query.eq("semester", semester.trim());
  }

  const { data: courses, count: totalCount, error: coursesError } = await query.range(from, to);
  if (coursesError) console.error("Supabase error:", coursesError.message);

  const totalPages = Math.ceil((totalCount ?? 0) / PAGE_SIZE);

  const enriched = (courses ?? []).map((c) => {
    const resources = ((c as unknown as { resources?: EmbeddedResource[] }).resources ?? []);
    const contributors: { name: string }[] = [];
    for (const r of resources) {
      const name = r.uploader?.display_name;
      if (name && contributors.length < 4 && !contributors.some((x) => x.name === name)) {
        contributors.push({ name });
      }
    }
    return { ...c, resource_count: resources.length, contributors };
  });

  if (enriched.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-indigo-50/50 to-white py-16 text-center" style={{ border: "0.5px solid #e0e7ff" }}>
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
    );
  }

  return (
    <>
      <div className="cards-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {enriched.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
          {page > 1 ? (
            <Link
              href={buildHref(page - 1, q, semester)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-500 transition hover:bg-indigo-50 hover:text-indigo-600"
              style={{ border: "0.5px solid #e4e4e7" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </Link>
          ) : (
            <span className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full bg-zinc-50 text-zinc-300" style={{ border: "0.5px solid #f0f0f0" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </span>
          )}

          {getPageNumbers(page, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`el-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-zinc-400">…</span>
            ) : (
              <Link
                key={p}
                href={buildHref(p as number, q, semester)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition ${
                  p === page
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
                style={{ border: p === page ? "none" : "0.5px solid #e4e4e7" }}
              >
                {p}
              </Link>
            )
          )}

          {page < totalPages ? (
            <Link
              href={buildHref(page + 1, q, semester)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-500 transition hover:bg-indigo-50 hover:text-indigo-600"
              style={{ border: "0.5px solid #e4e4e7" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </Link>
          ) : (
            <span className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full bg-zinc-50 text-zinc-300" style={{ border: "0.5px solid #f0f0f0" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </span>
          )}
        </nav>
      )}
    </>
  );
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; semester?: string; page?: string }>;
}) {
  const { q, semester, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const isFiltered = !!(q || semester);

  const platformStats = await getPlatformStats();
  const schools = platformStats.universities;

  const subtitle = isFiltered
    ? [q ? `Results for "${q}"` : "Filtered results", semester].filter(Boolean).join(" · ")
    : `${platformStats.totalCourses}+ courses across ${schools.length} universities`;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-8 pr-8 sm:pr-10">
      {/* Page header */}
      <div className="animate-fade-up mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Browse Courses</h1>
          <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>
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
        <div className="animate-fade-up-delay-1 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white px-5 py-4" style={{ border: "0.5px solid #e8e8f0" }}>
            <p className="font-mono text-[52px] font-bold leading-none text-zinc-900">{platformStats.totalCourses}+</p>
            <p className="mt-2 text-xs text-zinc-500">Courses</p>
          </div>

          <div className="rounded-2xl bg-white px-5 py-4" style={{ border: "0.5px solid #e8e8f0" }}>
            <p className="font-mono text-[52px] font-bold leading-none text-zinc-900">{platformStats.totalResources}</p>
            <p className="mt-2 text-xs text-zinc-500">Resources</p>
          </div>

          <div className="rounded-2xl bg-white px-5 py-4" style={{ border: "0.5px solid #e8e8f0" }}>
            <p className="font-mono text-[52px] font-bold leading-none text-zinc-900">{schools.length}</p>
            <p className="mt-2 text-xs text-zinc-500">Universities</p>
          </div>
        </div>
      )}

      {/* Search bar */}
      <Suspense>
        <CourseSearch defaultQ={q} defaultSemester={semester} />
      </Suspense>

      {/* Results — streamed so the header, stats, and search render instantly */}
      <Suspense key={`${q ?? ""}-${semester ?? ""}-${page}`} fallback={<ResultsSkeleton />}>
        <CourseResults q={q} semester={semester} page={page} />
      </Suspense>
    </div>
  );
}
