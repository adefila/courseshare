"use client";

import Link from "next/link";

export function HeroBanner() {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl" style={{ minHeight: 300 }}>
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
          background: "linear-gradient(135deg, rgba(15,15,40,0.80) 0%, rgba(30,27,75,0.68) 60%, rgba(79,70,229,0.42) 100%)",
        }}
      />

      {/* Centered content */}
      <div className="relative flex flex-col items-center justify-center px-8 py-14 text-center sm:px-12" style={{ zIndex: 5 }}>
        <p className="mb-2 text-sm font-medium uppercase tracking-widest" style={{ color: "rgba(165,180,252,0.9)" }}>
          Student Resource Hub
        </p>
        <h2 className="mb-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
          Everything you need,<br />shared by those who know.
        </h2>
        <p className="mb-8 max-w-md text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
          Course materials, past papers, and notes shared by students across Nigerian universities.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/courses">
            <button className="cursor-pointer rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 active:scale-[0.97]">
              Browse courses
            </button>
          </Link>
          <Link href="/courses/new">
            <button
              className="cursor-pointer rounded-full px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.97]"
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
