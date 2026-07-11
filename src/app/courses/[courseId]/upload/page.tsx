import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UploadForm } from "@/components/resources/UploadForm";

export default async function UploadPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, { data: course }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("courses").select("course_name, course_code").eq("id", courseId).single(),
  ]);

  if (!user) redirect(`/login?redirectTo=/courses/${courseId}/upload`);
  if (!course) notFound();

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-12">
      <div className="mx-auto max-w-xl">
      <Link
        href={`/courses/${courseId}`}
        className="mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Back to course
      </Link>

      <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-8 sm:px-12 sm:py-10">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M17 8l-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
        </div>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-zinc-900">
          Upload a resource
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Adding to{" "}
          <span className="font-semibold text-zinc-700">
            {course.course_code} — {course.course_name}
          </span>
        </p>

        <UploadForm courseId={courseId} userId={user.id} />
      </div>
      </div>
    </div>
  );
}
