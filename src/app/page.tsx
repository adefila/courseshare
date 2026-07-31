import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPlatformStats } from "@/lib/stats";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

const DEPT_COLORS: Record<string, { bg: string; text: string }> = {
  CSC: { bg: "#eff5ff", text: "#006cfb" },
  CVE: { bg: "#fff7ed", text: "#c2410c" },
  EEE: { bg: "#fdf4ff", text: "#9333ea" },
  MEE: { bg: "#f0fdf4", text: "#15803d" },
  BIO: { bg: "#ecfdf5", text: "#059669" },
  CHE: { bg: "#fef9c3", text: "#a16207" },
  PHY: { bg: "#eff6ff", text: "#1d4ed8" },
  MAT: { bg: "#fff1f2", text: "#be123c" },
  BCH: { bg: "#f0fdfa", text: "#0f766e" },
  MED: { bg: "#fdf2f8", text: "#be185d" },
  LAW: { bg: "#f8f7ff", text: "#6d28d9" },
  BUS: { bg: "#fffbeb", text: "#d97706" },
  ECO: { bg: "#f0fdf4", text: "#166534" },
};
function deptColor(code: string) {
  const prefix = code?.replace(/\d/g, "").toUpperCase().slice(0, 3);
  return DEPT_COLORS[prefix] ?? { bg: "#f4f4f5", text: "#52525b" };
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
      .select("id, course_name, course_code, university, created_at, resource_count")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const displayName = user?.user_metadata?.display_name as string | undefined;

  const stats = [
    { label: "Courses", value: platformStats.totalCourses },
    { label: "Resources", value: platformStats.totalResources },
    { label: "Universities", value: platformStats.universities.length },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-8 sm:pr-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      {user ? (
        /* Logged-in: full-width greeting row */
        <div className="animate-fade-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <p className="mb-1 font-mono text-xs text-zinc-400">{dateStr}</p>
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
              {displayName
                ? <>Welcome back, <span className="text-indigo-600">{displayName}</span></>
                : "Welcome back"}
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">Here&apos;s what students have been sharing lately.</p>
          </div>
          <Link href="/courses/new" className="shrink-0 sm:mt-1">
            <Button size="md" className="w-full sm:w-auto">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="mr-1.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New course
            </Button>
          </Link>
        </div>
      ) : (
        /* Guest: full hero */
        <div className="animate-fade-up mb-8 relative overflow-hidden rounded-3xl px-7 py-8 sm:px-10 sm:py-10" style={{ background: "linear-gradient(135deg, #006cfb 0%, #0045ab 100%)" }}>

          {/* Tiled logo mark pattern */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 95.34 109.03'%3E%3Cpolygon fill='white' points='68.16 81.67 54.49 109.03 40.87 82.02 27.26 108.98 0 54.47 27.25 .04 40.85 27.03 54.44 0 68.17 27.24 54.46 54.73 40.87 27.52 27.33 54.47 40.83 81.45 54.46 54.45 68.16 81.67'/%3E%3Cpolygon fill='%23ff6315' points='81.63 81.7 67.95 54.48 81.64 27.28 95.34 54.48 81.63 81.7'/%3E%3C/svg%3E")`,
              backgroundSize: "72px 83px",
              backgroundRepeat: "repeat",
              opacity: 0.08,
              filter: "blur(1.5px)",
            }}
          />

          {/* Content sits above the pattern */}
          <div className="relative">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-mono text-xs text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {platformStats.totalCourses} courses · {platformStats.totalResources} resources
            </p>
            <h1 className="mb-3 max-w-lg text-3xl font-bold text-white sm:text-4xl">
              Every note, slide, and past paper — in one place
            </h1>
            <p className="mb-8 max-w-md text-sm text-white/70">
              CourseDeck is a student-built archive of course materials. Browse free, upload with an account.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/courses">
                <Button variant="secondary" size="md">Browse courses</Button>
              </Link>
              <Link href="/signup">
                <button className="cursor-pointer rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                  Sign up free
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats ────────────────────────────────────────────────── */}
      <div className="animate-fade-up-delay-1 mb-8 grid grid-cols-3 gap-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-white px-5 py-4" style={{ border: "0.5px solid #e8e8f0" }}>
            <p className="font-mono text-3xl font-bold leading-none text-zinc-900">{value}</p>
            <p className="mt-2 text-[11px] text-zinc-400">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Recently added ───────────────────────────────────────── */}
      <div className="animate-fade-up-delay-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900 [font-family:var(--font-bricolage)]">Recently added</h2>
          <Link href="/courses" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {(recentCourses ?? []).length === 0 ? (
          <div className="rounded-2xl bg-white py-10 text-center" style={{ border: "0.5px solid #e8e8f0" }}>
            <p className="text-sm text-zinc-500">No courses yet — be the first to add one.</p>
            {user && (
              <Link href="/courses/new" className="mt-3 inline-block">
                <Button size="sm">Create a course</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="list-stagger flex flex-col gap-2">
            {(recentCourses ?? []).map((course) => {
              const color = deptColor(course.course_code);
              const rc = (course as unknown as { resource_count?: number }).resource_count;
              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group flex items-center gap-4 rounded-xl bg-white px-4 py-3 transition-all hover:bg-zinc-50"
                  style={{ border: "0.5px solid #e8e8f0" }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-bold"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {course.course_code?.replace(/\d/g, "").slice(0, 3).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900 transition-colors group-hover:text-indigo-700 [font-family:var(--font-bricolage)]">
                      {course.course_name}
                    </p>
                    <p className="truncate text-[11px] text-zinc-400">{course.university}</p>
                  </div>

                  <div className="hidden shrink-0 items-center gap-2 sm:flex">
                    <span className="rounded-full px-2 py-0.5 font-mono text-[10px] font-medium" style={{ background: color.bg, color: color.text }}>
                      {course.course_code}
                    </span>
                    {rc != null && rc > 0 && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500">
                        {rc} {rc === 1 ? "file" : "files"}
                      </span>
                    )}
                  </div>

                  <span className="hidden shrink-0 text-[11px] text-zinc-400 sm:block">{formatDate(course.created_at)}</span>

                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-zinc-300 transition-colors group-hover:text-indigo-400">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Guest CTA ────────────────────────────────────────────── */}
      {!user && (
        <div className="animate-fade-up-delay-3 mt-6 flex flex-col gap-4 rounded-2xl bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between" style={{ border: "0.5px solid #e8e8f0" }}>
          <div>
            <p className="font-semibold text-zinc-900">Ready to contribute?</p>
            <p className="text-sm text-zinc-500">Sign up free to upload and manage course resources.</p>
          </div>
          <Link href="/signup" className="shrink-0">
            <Button size="sm" className="w-full sm:w-auto">Sign up free</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
