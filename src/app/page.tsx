import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPlatformStats } from "@/lib/stats";
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
    platformStats,
    { data: recentCourses },
  ] = await Promise.all([
    supabase.auth.getUser(),
    getPlatformStats(),
    supabase
      .from("courses")
      .select("id, course_name, course_code, university, semester, year, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const displayName = user?.user_metadata?.display_name as string | undefined;

  const stats = [
    { label: "Courses", value: platformStats.totalCourses },
    { label: "Resources", value: platformStats.totalResources },
    { label: "Universities", value: platformStats.universities.length },
  ];

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-8 sm:pr-10">

      {/* ── Welcome header ───────────────────────────────────────── */}
      <div className="animate-fade-up mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 sm:text-3xl">
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
      <div className="animate-fade-up-delay-1 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-white px-5 py-4" style={{ border: "0.5px solid #e8e8f0" }}>
            <p className="font-mono text-[52px] font-bold leading-none text-zinc-900">{value}</p>
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
