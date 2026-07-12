import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CourseForm } from "@/components/courses/CourseForm";

function NewCourseIllustration() {
  return (
    <svg viewBox="0 0 320 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="160" cy="78" r="62" fill="#eef2ff" />

      {/* Back document */}
      <g transform="rotate(-8 160 85)">
        <rect x="112" y="30" width="72" height="90" rx="6" fill="#c7d2fe" />
        <rect x="122" y="46" width="42" height="4" rx="2" fill="#a5b4fc" />
        <rect x="122" y="56" width="30" height="4" rx="2" fill="#a5b4fc" />
      </g>

      {/* Mid document */}
      <g transform="rotate(-3 160 85)">
        <rect x="108" y="26" width="72" height="90" rx="6" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="1" />
        <rect x="118" y="42" width="42" height="4" rx="2" fill="#c7d2fe" />
        <rect x="118" y="52" width="32" height="4" rx="2" fill="#c7d2fe" />
      </g>

      {/* Front document */}
      <rect x="104" y="22" width="72" height="90" rx="6" fill="white" stroke="#e0e7ff" strokeWidth="1.5" />
      <rect x="114" y="38" width="42" height="4" rx="2" fill="#f0f0ff" />
      <rect x="114" y="50" width="30" height="4" rx="2" fill="#f0f0ff" />
      <rect x="114" y="62" width="36" height="4" rx="2" fill="#f0f0ff" />

      {/* Plus badge */}
      <circle cx="176" cy="22" r="16" fill="#4f46e5" />
      <path d="M176 14 L176 30 M168 22 L184 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Sparkles */}
      <path d="M63 38 L64.4 32 L65.8 38 L71.8 39.4 L65.8 40.8 L64.4 46.8 L63 40.8 L57 39.4 Z" fill="#c7d2fe" />
      <path d="M249 30 L250.2 25 L251.4 30 L256.4 31.2 L251.4 32.4 L250.2 37.4 L249 32.4 L244 31.2 Z" fill="#a5b4fc" />

      {/* Floating dots */}
      <circle cx="60" cy="80" r="5" fill="#e0e7ff" />
      <circle cx="264" cy="72" r="7" fill="#e0e7ff" />
      <circle cx="258" cy="118" r="4" fill="#eef2ff" />
      <circle cx="62" cy="120" r="4" fill="#eef2ff" />

      {/* Shadow */}
      <ellipse cx="140" cy="120" rx="46" ry="6" fill="#e0e7ff" opacity="0.5" />
    </svg>
  );
}

export default async function NewCoursePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/courses/new");

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-8 pr-8 sm:pr-10">
      <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white">
        <div className="flex h-40 items-center justify-center rounded-t-2xl border-b border-zinc-100 bg-zinc-50 px-6">
          <NewCourseIllustration />
        </div>
        <div className="px-8 py-8 sm:px-10">
          <h1 className="mb-1 text-2xl font-semibold text-zinc-900">
            Create a course
          </h1>
          <p className="mb-8 text-sm text-zinc-500">
            Add a new course so students can find and upload resources for it.
          </p>
          <CourseForm />
        </div>
      </div>
    </div>
  );
}
