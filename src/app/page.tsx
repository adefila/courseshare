import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

function MiniFolder() {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-lg"
      style={{
        width: 40,
        height: 36,
        background: "linear-gradient(155deg, #312e81 0%, #3730a3 100%)",
      }}
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
    { label: "Courses", value: totalCourses ?? 0 },
    { label: "Resources", value: totalResources ?? 0 },
    { label: "Universities", value: totalUniversities },
  ];

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-8 sm:pr-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div
        className="animate-fade-up relative mb-8 overflow-hidden rounded-2xl px-8 py-10 sm:px-12"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #3730a3 55%, #4f46e5 100%)" }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.2)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 60, bottom: -60, width: 150, height: 150, borderRadius: "50%", background: "rgba(139,92,246,0.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: -20, bottom: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(79,70,229,0.2)", pointerEvents: "none" }} />

        <p className="relative mb-1 flex items-center gap-1.5 text-sm font-medium text-indigo-300">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
          {displayName ? `Welcome back, ${displayName}` : "Welcome to CourseShare"}
        </p>
        <h1 className="relative mb-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
          Your student resource hub
        </h1>
        <p className="relative mb-7 max-w-md text-sm leading-relaxed text-indigo-200">
          Discover course materials, past papers, and notes shared by students across Nigerian universities.
        </p>
        <div className="relative flex flex-wrap gap-3">
          <Link href="/courses">
            <button className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50">
              Browse courses
            </button>
          </Link>
          <Link href="/courses/new">
            <button className="cursor-pointer rounded-full border border-indigo-400/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
              Share a course
            </button>
          </Link>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <div className="animate-fade-up-delay-1 mb-8 grid grid-cols-3 gap-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-gradient-to-br from-white to-indigo-50/40 px-5 py-5" style={{ border: "0.5px solid #e8e8f0" }}>
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
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
          >
            View all
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {(recentCourses ?? []).length === 0 ? (
          <div className="rounded-2xl bg-gradient-to-b from-indigo-50/50 to-white py-10 text-center" style={{ border: "0.5px solid #e0e7ff" }}>
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
                className="group flex items-center gap-4 rounded-xl bg-white px-5 py-3.5 transition-all hover:bg-indigo-50/30"
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
        <div className="animate-fade-up-delay-3 mt-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-50/80 to-violet-50/40 px-6 py-5" style={{ border: "0.5px solid #e0e7ff" }}>
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
