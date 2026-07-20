"use client";

import Link from "next/link";

export function HeroBanner() {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl" style={{ minHeight: 320 }}>
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="https://videos.pexels.com/video-files/3196396/3196396-hd_1920_1080_25fps.mp4"
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(15,15,40,0.82) 0%, rgba(30,27,75,0.70) 60%, rgba(79,70,229,0.45) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative px-8 py-10 sm:px-12" style={{ zIndex: 5 }}>
        <p className="mb-7 max-w-md text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
          Course materials, past papers, and notes shared by students across Nigerian universities.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/courses">
            <button className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 active:scale-[0.97]">
              Browse courses
            </button>
          </Link>
          <Link href="/courses/new">
            <button
              className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.97]"
              style={{ border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.1)" }}
            >
              Share a course
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
