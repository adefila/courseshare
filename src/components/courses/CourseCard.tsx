"use client";

import { useState } from "react";
import Link from "next/link";
import type { Course } from "@/types/database";

interface CourseCardProps {
  course: Course & {
    resource_count?: number;
    contributors?: { name: string }[];
  };
}

function Avatar({ name, size = 22 }: { name: string; size?: number }) {
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

function FolderIllustration({ hovered }: { hovered: boolean }) {
  const spring = "cubic-bezier(0.34, 1.56, 0.64, 1)";

  return (
    <div
      className="relative overflow-hidden rounded-t-2xl"
      style={{
        height: 152,
        background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 60%, #3730a3 100%)",
      }}
    >
      {/* Folder tab */}
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 0,
          width: 56,
          height: 14,
          borderRadius: "6px 6px 0 0",
          background: "rgba(99,102,241,0.5)",
        }}
      />

      {/* Subtle inner glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 110%, rgba(99,102,241,0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Documents */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "44%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        {/* Back doc — tilts left */}
        <div
          style={{
            width: 42,
            height: 58,
            borderRadius: 10,
            background: "rgba(255,255,255,0.90)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            transform: hovered
              ? "translateY(-20px) rotate(-7deg)"
              : "translateY(2px) rotate(-7deg)",
            transition: `transform 0.45s ${spring}`,
            flexShrink: 0,
          }}
        >
          <div style={{ padding: "10px 8px 0", display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ height: 5, width: 24, borderRadius: 3, background: "#c7d2fe" }} />
            <div style={{ height: 4, width: 17, borderRadius: 3, background: "#e0e7ff" }} />
            <div style={{ height: 4, width: 21, borderRadius: 3, background: "#e0e7ff" }} />
          </div>
        </div>

        {/* Centre doc — goes up highest */}
        <div
          style={{
            width: 46,
            height: 64,
            borderRadius: 10,
            background: "rgba(238,242,255,0.97)",
            boxShadow: "0 10px 28px rgba(0,0,0,0.4)",
            transform: hovered
              ? "translateY(-28px) rotate(0deg)"
              : "translateY(2px) rotate(0deg)",
            transition: `transform 0.45s ${spring} 0.04s`,
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          <div style={{ padding: "10px 8px 0", display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ height: 5, width: 28, borderRadius: 3, background: "#a5b4fc" }} />
            <div style={{ height: 4, width: 18, borderRadius: 3, background: "#c7d2fe" }} />
            <div style={{ height: 4, width: 24, borderRadius: 3, background: "#c7d2fe" }} />
            <div style={{ height: 4, width: 15, borderRadius: 3, background: "#e0e7ff" }} />
          </div>
        </div>

        {/* Front doc — tilts right */}
        <div
          style={{
            width: 42,
            height: 54,
            borderRadius: 10,
            background: "rgba(255,255,255,0.90)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            transform: hovered
              ? "translateY(-14px) rotate(6deg)"
              : "translateY(2px) rotate(6deg)",
            transition: `transform 0.45s ${spring} 0.08s`,
            flexShrink: 0,
          }}
        >
          <div style={{ padding: "10px 8px 0", display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ height: 5, width: 20, borderRadius: 3, background: "#c7d2fe" }} />
            <div style={{ height: 4, width: 14, borderRadius: 3, background: "#e0e7ff" }} />
            <div style={{ height: 4, width: 18, borderRadius: 3, background: "#e0e7ff" }} />
          </div>
        </div>
      </div>

      {/* Folder front flap */}
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0 0",
          height: "48%",
          background: "linear-gradient(to bottom, rgba(79,70,229,0.82), rgba(67,56,202,0.96))",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Glossy top edge */}
        <div style={{ position: "absolute", inset: "0 0 auto 0", height: 1, background: "rgba(165,180,252,0.5)" }} />
        <div style={{ position: "absolute", inset: "0 0 auto 0", height: 18, background: "linear-gradient(to bottom, rgba(165,180,252,0.14), transparent)" }} />
        {/* Subtle sheen across flap */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
      </div>
    </div>
  );
}

export function CourseCard({ course }: CourseCardProps) {
  const [hovered, setHovered] = useState(false);
  const count = course.resource_count ?? 0;
  const contributors = course.contributors ?? [];

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
      style={{ boxShadow: hovered ? "0 20px 40px -12px rgba(79,70,229,0.18)" : undefined }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <FolderIllustration hovered={hovered} />

      <div className="flex flex-1 flex-col px-5 py-4">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-indigo-700">
            {course.course_code}
          </span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            {course.semester} {course.year}
          </span>
        </div>

        <h3 className="mb-1 font-semibold leading-snug text-zinc-900 line-clamp-2 transition-colors group-hover:text-indigo-700">
          {course.course_name}
        </h3>
        <p className="mb-3 flex items-center gap-1.5 text-[13px] text-zinc-500 line-clamp-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
          </svg>
          {course.university}
        </p>

        {course.description && (
          <p className="mb-3 text-xs leading-relaxed text-zinc-500 line-clamp-2">
            {course.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-3">
          <div className="flex items-center gap-2">
            {contributors.length > 0 && (
              <div className="flex -space-x-1.5">
                {contributors.slice(0, 4).map((c) => (
                  <Avatar key={c.name} name={c.name} size={22} />
                ))}
              </div>
            )}
            <span className="text-xs text-zinc-400">
              {count} {count !== 1 ? "resources" : "resource"}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            View
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
