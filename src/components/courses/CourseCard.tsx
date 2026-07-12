import Link from "next/link";
import type { Course } from "@/types/database";

interface CourseCardProps {
  course: Course & {
    resource_count?: number;
    contributors?: { name: string }[];
  };
}

function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-pink-100 text-pink-700",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold ${color}`}
      style={{ width: size, height: size }}
    >
      {initials || "?"}
    </span>
  );
}

export function CourseCard({ course }: CourseCardProps) {
  const count = course.resource_count ?? 0;
  const contributors = course.contributors ?? [];

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-150 hover:border-indigo-200 hover:shadow-sm"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {course.course_code}
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-500">
          {course.semester} {course.year}
        </span>
      </div>

      <h3 className="mb-1 font-medium leading-snug text-zinc-900 line-clamp-2 transition-colors group-hover:text-indigo-700">
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
        <div className="flex items-center gap-2">
          {contributors.length > 0 ? (
            <div className="flex -space-x-1.5">
              {contributors.slice(0, 4).map((c) => (
                <Avatar key={c.name} name={c.name} size={22} />
              ))}
            </div>
          ) : null}
          <span className="text-xs text-zinc-400">
            {count} {count !== 1 ? "resources" : "resource"}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
          View
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
