import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseSearch } from "@/components/courses/CourseSearch";
import { Button } from "@/components/ui/Button";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; school?: string }>;
}) {
  const { q, school } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("courses")
    .select("id, course_name, course_code, university, semester, year, description, created_at, created_by")
    .order("created_at", { ascending: false })
    .limit(60);

  if (q?.trim()) query = query.textSearch("fts", q.trim(), { type: "websearch" });
  if (school?.trim()) query = query.eq("university", school.trim());

  const [{ data: courses, error: coursesError }, { data: universityRows }] = await Promise.all([
    query,
    supabase.from("courses").select("university").order("university"),
  ]);
  if (coursesError) console.error("Supabase error:", coursesError.message);

  const schools = [...new Set((universityRows ?? []).map((r) => r.university))];

  const ids = (courses ?? []).map((c) => c.id);
  const { data: countRows } = ids.length
    ? await supabase.from("resources").select("course_id").in("course_id", ids).eq("is_removed", false)
    : { data: [] };

  const countMap: Record<string, number> = {};
  for (const row of countRows ?? []) {
    countMap[row.course_id] = (countMap[row.course_id] ?? 0) + 1;
  }

  const enriched = (courses ?? []).map((c) => ({ ...c, resource_count: countMap[c.id] ?? 0 }));
  const isFiltered = !!(q || school);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-8 pr-8 sm:pr-10">

      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Browse Courses</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {isFiltered
              ? `${enriched.length} result${enriched.length !== 1 ? "s" : ""}${q ? ` for "${q}"` : ""}${school ? ` at ${school}` : ""}`
              : `${enriched.length}+ courses across ${schools.length} universities`}
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

      {/* Stats strip — only when not filtered */}
      {!isFiltered && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
            <p className="text-[64px] font-bold leading-none tracking-tight text-zinc-900">{enriched.length}+</p>
            <p className="text-xs text-zinc-500 mt-2">Courses uploaded</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
            <p className="text-[64px] font-bold leading-none tracking-tight text-zinc-900">{schools.length}</p>
            <p className="text-xs text-zinc-500 mt-2">Universities</p>
          </div>
          <div className="col-span-2 rounded-xl border border-zinc-200 bg-white px-5 py-4 sm:col-span-1">
            <p className="text-[64px] font-bold leading-none tracking-tight text-zinc-900">{(countRows ?? []).length}</p>
            <p className="text-xs text-zinc-500 mt-2">Resources shared</p>
          </div>
        </div>
      )}

      {/* Search bar */}
      <Suspense>
        <CourseSearch schools={schools} defaultQ={q} defaultSchool={school} />
      </Suspense>

      {/* Results */}
      {enriched.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p className="mb-1 font-semibold text-zinc-700">{q ? `No courses match "${q}"` : "No courses yet"}</p>
          <p className="mb-5 text-sm text-zinc-500">{q ? "Try a different search term." : "Be the first to add one!"}</p>
          <Link href="/courses/new"><Button>Create a course</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enriched.map((course) => (<CourseCard key={course.id} course={course} />))}
        </div>
      )}
    </div>
  );
}
