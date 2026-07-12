import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ResourceList } from "@/components/resources/ResourceList";
import { Button } from "@/components/ui/Button";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();

  const [{ data: course }, { data: resources }, { data: { user } }] =
    await Promise.all([
      supabase.from("courses").select("*, creator:profiles!created_by(display_name)").eq("id", courseId).single(),
      supabase
        .from("resources")
        .select("*, uploader:profiles!uploaded_by(display_name)")
        .eq("course_id", courseId)
        .eq("is_removed", false)
        .order("created_at", { ascending: false }),
      supabase.auth.getUser(),
    ]);

  const contributors: { name: string }[] = [];
  const seen = new Set<string>();
  for (const r of resources ?? []) {
    const name = (r as { uploader?: { display_name: string | null } | null }).uploader?.display_name;
    if (name && !seen.has(name)) { seen.add(name); contributors.push({ name }); }
  }

  if (!course) notFound();

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-10">
      <div className="mx-auto max-w-4xl">
      <Link
        href="/courses"
        className="mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        All courses
      </Link>

      {/* Course header card */}
      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-[13px] font-semibold text-zinc-700">
                {course.course_code}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">
                {course.semester} {course.year}
              </span>
            </div>
            <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              {course.course_name}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-zinc-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
              </svg>
              {course.university}
            </p>
            {course.description && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-600">
                {course.description}
              </p>
            )}

            {contributors.length > 0 && (
              <div className="mt-5 flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {contributors.slice(0, 5).map((c) => {
                    const initials = c.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
                    const colors = ["bg-indigo-100 text-indigo-700","bg-violet-100 text-violet-700","bg-blue-100 text-blue-700","bg-emerald-100 text-emerald-700","bg-amber-100 text-amber-700"];
                    const color = colors[c.name.charCodeAt(0) % colors.length];
                    return (
                      <span key={c.name} title={c.name}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold ${color}`}>
                        {initials}
                      </span>
                    );
                  })}
                </div>
                <span className="text-xs text-zinc-500">
                  <span className="font-medium text-zinc-700">
                    {contributors.slice(0, 2).map(c => c.name.split(" ")[0]).join(", ")}
                    {contributors.length > 2 ? ` +${contributors.length - 2} more` : ""}
                  </span>
                  {" "}contributed resources
                </span>
              </div>
            )}
          </div>

          {user && (
            <Link href={`/courses/${courseId}/upload`} className="shrink-0">
              <Button>
                <svg className="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
                Upload resource
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Resources */}
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">Resources</h2>
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700">
          {resources?.length ?? 0}
        </span>
      </div>
      <ResourceList resources={resources ?? []} courseId={courseId} userId={user?.id} />

      {!user && (
        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link
            href={`/login?redirectTo=/courses/${courseId}/upload`}
            className="font-semibold text-zinc-900 hover:underline"
          >
            Sign in
          </Link>{" "}
          to upload resources for this course.
        </p>
      )}
      </div>
    </div>
  );
}
