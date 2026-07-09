import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/courses/CourseCard";
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

  if (q?.trim()) {
    query = query.textSearch("fts", q.trim(), { type: "websearch" });
  }
  if (school?.trim()) {
    query = query.eq("university", school.trim());
  }

  // Distinct universities for the school filter (in parallel with courses)
  const [{ data: courses, error: coursesError }, { data: universityRows }] =
    await Promise.all([
      query,
      supabase.from("courses").select("university").order("university"),
    ]);
  if (coursesError) console.error("Supabase error:", coursesError.message);

  const schools = [...new Set((universityRows ?? []).map((r) => r.university))];

  // Fetch resource counts in bulk
  const ids = (courses ?? []).map((c) => c.id);
  const { data: countRows } = ids.length
    ? await supabase
        .from("resources")
        .select("course_id")
        .in("course_id", ids)
        .eq("is_removed", false)
    : { data: [] };

  const countMap: Record<string, number> = {};
  for (const row of countRows ?? []) {
    countMap[row.course_id] = (countMap[row.course_id] ?? 0) + 1;
  }

  const enriched = (courses ?? []).map((c) => ({
    ...c,
    resource_count: countMap[c.id] ?? 0,
  }));

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Browse Courses
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {enriched.length} course{enriched.length !== 1 ? "s" : ""}
            {q ? ` matching "${q}"` : " available"}
            {school ? ` at ${school}` : ""}
          </p>
        </div>
        <Link href="/courses/new">
          <Button>
            <svg className="mr-1.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Course
          </Button>
        </Link>
      </div>

      {/* Search */}
      <form method="GET" className="mb-10">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by course name, code, or university…"
              className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-10 pr-5 text-sm transition placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <select
            name="school"
            defaultValue={school ?? ""}
            className="max-w-[220px] rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-700 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All schools</option>
            {schools.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Button type="submit">Search</Button>
          {(q || school) && (
            <Link href="/courses">
              <Button variant="secondary">Clear</Button>
            </Link>
          )}
        </div>
      </form>

      {enriched.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white/60 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p className="mb-1 font-semibold text-zinc-700">
            {q ? `No courses match "${q}"` : "No courses yet"}
          </p>
          <p className="mb-5 text-sm text-zinc-500">
            {q ? "Try a different search term." : "Be the first to add one!"}
          </p>
          <Link href="/courses/new">
            <Button>Create a course</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enriched.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
