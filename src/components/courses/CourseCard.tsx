import Link from "next/link";
import type { Course } from "@/types/database";

interface CourseCardProps {
  course: Course & { resource_count?: number };
}

export function CourseCard({ course }: CourseCardProps) {
  const count = course.resource_count ?? 0;

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-150 hover:border-zinc-400"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
          {course.course_code}
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500">
          {course.semester} {course.year}
        </span>
      </div>

      <h3 className="mb-1 font-semibold leading-snug text-zinc-900 line-clamp-2 transition-colors group-hover:text-black">
        {course.course_name}
      </h3>
      <p className="mb-3 flex items-center gap-1 text-[13px] text-zinc-500 line-clamp-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
        </svg>
        {course.university}
      </p>

      {course.description && (
        <p className="mb-4 text-xs leading-relaxed text-zinc-500 line-clamp-2">
          {course.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {count} resource{count !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-zinc-900 opacity-0 transition-opacity group-hover:opacity-100">
          View
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
