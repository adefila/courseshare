import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCourseColor } from "@/lib/courseColors";

export default async function SavedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/saved");

  const { data } = await supabase
    .from("bookmarks")
    .select("course_id, created_at, courses(id, course_name, course_code, university, semester, year, resource_count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const saved = (data ?? []).map((row) => {
    const c = (row as unknown as { courses: { id: string; course_name: string; course_code: string; university: string; semester: string; year: number; resource_count: number | null } | null }).courses;
    return c;
  }).filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-400 transition hover:bg-white hover:text-zinc-700"
          style={{ border: "0.5px solid transparent" }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Browse
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Saved Courses</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          {saved.length === 0 ? "No saved courses yet." : `${saved.length} course${saved.length !== 1 ? "s" : ""} saved`}
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-indigo-50/50 to-white py-16 text-center" style={{ border: "0.5px solid #e0e7ff" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <p className="mb-1.5 font-semibold text-zinc-700">Nothing saved yet</p>
          <p className="mb-6 text-sm text-zinc-500">Bookmark courses to find them here quickly.</p>
          <Link
            href="/courses"
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((course) => {
            const { gradient, pill } = getCourseColor(course.course_code);
            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group overflow-hidden rounded-2xl bg-white transition hover:shadow-md"
                style={{ border: "0.5px solid #e8e8f0" }}
              >
                {/* Colour strip */}
                <div className="h-2 w-full" style={{ background: gradient }} />

                <div className="px-5 py-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${pill}`}>
                      {course.course_code}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {course.semester} {course.year}
                    </span>
                  </div>

                  <p className="truncate font-semibold text-zinc-900 group-hover:text-indigo-700 transition-colors">
                    {course.course_name}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
                    </svg>
                    <span className="truncate">{course.university}</span>
                  </div>

                  {course.resource_count != null && course.resource_count > 0 && (
                    <p className="mt-3 text-[11px] text-zinc-400">
                      {course.resource_count} resource{course.resource_count !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
