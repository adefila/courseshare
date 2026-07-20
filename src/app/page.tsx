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
      illus: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <g transform="rotate(-12 60 60)">
            <rect x="20" y="18" width="56" height="72" rx="7" fill="#4f46e5"/>
            <rect x="28" y="34" width="32" height="4" rx="2" fill="#6366f1"/>
            <rect x="28" y="44" width="24" height="4" rx="2" fill="#6366f1"/>
            <rect x="28" y="54" width="28" height="4" rx="2" fill="#6366f1"/>
          </g>
          <g transform="rotate(-4 60 60)">
            <rect x="28" y="12" width="56" height="72" rx="7" fill="#4f46e5"/>
            <rect x="36" y="28" width="32" height="4" rx="2" fill="#818cf8"/>
            <rect x="36" y="38" width="24" height="4" rx="2" fill="#818cf8"/>
            <rect x="36" y="48" width="28" height="4" rx="2" fill="#818cf8"/>
          </g>
          <rect x="36" y="6" width="56" height="72" rx="7" fill="#4f46e5"/>
          <path d="M36 6 L76 6 L92 22 L36 22 Z" fill="#6366f1"/>
          <rect x="44" y="30" width="32" height="4" rx="2" fill="#a5b4fc"/>
          <rect x="44" y="40" width="24" height="4" rx="2" fill="#a5b4fc"/>
          <rect x="44" y="50" width="28" height="4" rx="2" fill="#a5b4fc"/>
        </svg>
      ),
    },
    {
      label: "Resources",
      value: totalResources ?? 0,
      illus: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="16" y="30" width="50" height="64" rx="6" fill="#c7d2fe"/>
          <rect x="24" y="44" width="28" height="3.5" rx="1.5" fill="#a5b4fc"/>
          <rect x="24" y="54" width="20" height="3.5" rx="1.5" fill="#a5b4fc"/>
          <rect x="28" y="20" width="50" height="64" rx="6" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="1"/>
          <rect x="36" y="34" width="28" height="3.5" rx="1.5" fill="#c7d2fe"/>
          <rect x="36" y="44" width="20" height="3.5" rx="1.5" fill="#c7d2fe"/>
          <rect x="40" y="10" width="50" height="64" rx="6" fill="#4f46e5"/>
          <path d="M40 10 L74 10 L90 26 L40 26 Z" fill="#6366f1"/>
          <rect x="48" y="32" width="28" height="3.5" rx="1.5" fill="#a5b4fc"/>
          <rect x="48" y="42" width="20" height="3.5" rx="1.5" fill="#a5b4fc"/>
          <rect x="48" y="52" width="24" height="3.5" rx="1.5" fill="#a5b4fc"/>
          <circle cx="88" cy="88" r="18" fill="#4f46e5"/>
          <path d="M88 94 V82 M84 85.5 L88 82 L92 85.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Universities",
      value: totalUniversities,
      illus: (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="10" y="52" width="100" height="60" rx="4" fill="#4f46e5"/>
          <path d="M60 10 L10 38 L110 38 Z" fill="#4f46e5"/>
          <circle cx="60" cy="24" r="10" fill="#6366f1"/>
          <rect x="18" y="60" width="16" height="24" rx="2" fill="#818cf8"/>
          <rect x="44" y="60" width="16" height="24" rx="2" fill="#818cf8"/>
          <rect x="70" y="60" width="16" height="24" rx="2" fill="#818cf8"/>
          <rect x="96" y="60" width="16" height="24" rx="2" fill="#818cf8"/>
          <rect x="42" y="80" width="36" height="32" rx="2" fill="#6366f1"/>
          <rect x="52" y="90" width="7" height="7" rx="1" fill="#4f46e5"/>
          <rect x="63" y="90" width="7" height="7" rx="1" fill="#4f46e5"/>
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
        {stats.map(({ label, value, illus }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl bg-white px-5 py-4" style={{ border: "0.5px solid #e8e8f0" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, white 30%, rgba(255,255,255,0.97) 50%, rgba(255,255,255,0.85) 68%, rgba(255,255,255,0.55) 82%, rgba(255,255,255,0.15) 100%), linear-gradient(to top, white 0%, transparent 40%)" }} />
            <svg className="absolute right-0 bottom-0 opacity-[0.06]" width="110" height="110" viewBox={illus.props.viewBox} fill="none" aria-hidden="true">
              {illus.props.children}
            </svg>
            <p className="relative z-10 font-mono text-[52px] font-bold leading-none text-zinc-900">{value}</p>
            <p className="relative z-10 mt-2 text-xs text-zinc-500">{label}</p>
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
