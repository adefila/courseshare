import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CourseForm } from "@/components/courses/CourseForm";

export default async function NewCoursePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/courses/new");

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-12">
      <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white px-8 py-8 sm:px-12 sm:py-10">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M12 7v6M9 10h6" />
          </svg>
        </div>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-zinc-900">
          Create a course
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Add a new course so students can find and upload resources for it.
        </p>
        <CourseForm />
      </div>
    </div>
  );
}
