import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Clock } from "@/components/ui/Clock";
import { formatDate } from "@/lib/utils";

function MiniFolder() {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-lg bg-indigo-600"
      style={{ width: 40, height: 36 }}
    >
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: "52%",
          background: "rgba(79,70,229,0.55)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div style={{ position: "absolute", inset: "0 0 auto 0", height: 1, background: "rgba(165,180,252,0.5)" }} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { data: { user } },
    { count: totalCourses },
    { count: totalResources },
    { data: universityRows },
    { data: recentCourses },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*", { count: "exact", head: true }).eq("is_removed", false),
    supabase.from("courses").select("university").order("university"),
    supabase
      .from("courses")
      .select("id, course_name, course_code, university, semester, year, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const displayName = user?.user_metadata?.display_name as string | undefined;
  const totalUniversities = new Set((universityRows ?? []).map((r) => r.university)).size;

  const stats = [
    {
      label: "Courses",
      value: totalCourses ?? 0,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="9" y1="7" x2="15" y2="7" />
          <line x1="9" y1="11" x2="13" y2="11" />
        </svg>
      ),
    },
    {
      label: "Resources",
      value: totalResources ?? 0,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="12" y2="17" />
        </svg>
      ),
    },
    {
      label: "Universities",
      value: totalUniversities,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="10" width="20" height="12" rx="1" />
          <path d="M12 2L2 7h20L12 2z" />
          <line x1="7" y1="15" x2="7" y2="18" />
          <line x1="12" y1="15" x2="12" y2="18" />
          <line x1="17" y1="15" x2="17" y2="18" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-8 sm:pr-10">

      {/* ── Welcome header ───────────────────────────────────────── */}
      <div className="animate-fade-up mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-zinc-900 sm:text-3xl">
            {displayName ? (
              <>Welcome back, <span className="font-bold text-indigo-600">{displayName}</span></>
            ) : "Welcome to CourseShare"}
          </h1>
          <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
            Everything you need to ace this semester — notes, past papers, and slides shared by students who&apos;ve been there.
          </p>
        </div>
        <Clock />
      </div>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <div className="animate-fade-up-delay-1 mb-8 grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl bg-white px-5 py-5" style={{ border: "0.5px solid #e8e8f0" }}>
            {/* Subtle background illustration */}
            <div className="absolute right-3 top-3 text-indigo-100" aria-hidden="true">
              {icon}
            </div>
            <p className="font-mono text-4xl font-bold leading-none text-zinc-900 sm:text-5xl">
              {value}
            </p>
            <p className="mt-2 text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Recently added ───────────────────────────────────────── */}
      <div className="animate-fade-up-delay-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900">Recently added</h2>
          <Link
            href="/courses"
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 no-underline hover:text-indigo-500"
          >
            View all
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {(recentCourses ?? []).length === 0 ? (
          <div className="rounded-2xl bg-white py-10 text-center" style={{ border: "0.5px solid #e8e8f0" }}>
            <p className="text-sm text-zinc-500">No courses yet — be the first to add one.</p>
            <Link href="/courses/new" className="mt-3 inline-block">
              <Button size="sm">Create a course</Button>
            </Link>
          </div>
        ) : (
          <div className="list-stagger flex flex-col gap-2">
            {(recentCourses ?? []).map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group flex items-center gap-4 rounded-xl bg-white px-5 py-3.5 transition-all hover:bg-zinc-50"
                style={{ border: "0.5px solid #e8e8f0" }}
              >
                <MiniFolder />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-900 transition-colors group-hover:text-indigo-700">
                    {course.course_name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">{course.university}</p>
                </div>

                <span className="hidden shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-indigo-700 sm:inline-block">
                  {course.course_code}
                </span>

                <span className="shrink-0 text-xs text-zinc-400">
                  {formatDate(course.created_at)}
                </span>

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-zinc-300 transition-colors group-hover:text-indigo-400"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Sign-up nudge (guests only) ──────────────────────────── */}
      {!user && (
        <div className="animate-fade-up-delay-3 mt-8 flex items-center justify-between rounded-2xl bg-white px-6 py-5" style={{ border: "0.5px solid #e8e8f0" }}>
          <div>
            <p className="font-semibold text-zinc-900">Join the community</p>
            <p className="text-sm text-zinc-500">Sign up free to upload and manage course resources.</p>
          </div>
          <Link href="/signup">
            <Button size="sm">Sign up free</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
