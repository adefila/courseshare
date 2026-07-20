"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const SCHEMES = [
  {
    key: "indigo",
    dot: "#818cf8",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #3730a3 55%, #4f46e5 100%)",
    orb1: "rgba(99,102,241,0.35)",
    orb2: "rgba(139,92,246,0.22)",
    orb3: "rgba(167,139,250,0.18)",
    accent: "#a5b4fc",
    ring: "rgba(129,140,248,0.5)",
  },
  {
    key: "violet",
    dot: "#c084fc",
    gradient: "linear-gradient(135deg, #2e1065 0%, #5b21b6 55%, #7c3aed 100%)",
    orb1: "rgba(124,58,237,0.35)",
    orb2: "rgba(167,139,250,0.22)",
    orb3: "rgba(192,132,252,0.18)",
    accent: "#d8b4fe",
    ring: "rgba(192,132,252,0.5)",
  },
  {
    key: "rose",
    dot: "#fb7185",
    gradient: "linear-gradient(135deg, #4c0519 0%, #9f1239 55%, #e11d48 100%)",
    orb1: "rgba(225,29,72,0.35)",
    orb2: "rgba(251,113,133,0.22)",
    orb3: "rgba(253,164,175,0.18)",
    accent: "#fda4af",
    ring: "rgba(251,113,133,0.5)",
  },
  {
    key: "ocean",
    dot: "#38bdf8",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 55%, #0284c7 100%)",
    orb1: "rgba(2,132,199,0.35)",
    orb2: "rgba(56,189,248,0.22)",
    orb3: "rgba(125,211,252,0.18)",
    accent: "#7dd3fc",
    ring: "rgba(56,189,248,0.5)",
  },
  {
    key: "slate",
    dot: "#94a3b8",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
    orb1: "rgba(51,65,85,0.6)",
    orb2: "rgba(100,116,139,0.4)",
    orb3: "rgba(148,163,184,0.25)",
    accent: "#cbd5e1",
    ring: "rgba(148,163,184,0.5)",
  },
];

const STORAGE_KEY = "cs-hero-scheme";

export function HeroBanner({ displayName }: { displayName?: string }) {
  const [scheme, setScheme] = useState(SCHEMES[0]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = SCHEMES.find((s) => s.key === saved);
      if (found) setScheme(found);
    }
  }, []);

  function pick(s: typeof SCHEMES[0]) {
    setScheme(s);
    localStorage.setItem(STORAGE_KEY, s.key);
  }

  return (
    <>
      <style>{`
        @keyframes orb-drift-1 {
          0%,100% { transform: translate(0,0) scale(1); }
          30%      { transform: translate(40px,-30px) scale(1.08); }
          65%      { transform: translate(-25px,20px) scale(0.94); }
        }
        @keyframes orb-drift-2 {
          0%,100% { transform: translate(0,0) scale(1); }
          25%      { transform: translate(-50px,25px) scale(1.1); }
          70%      { transform: translate(30px,-40px) scale(0.92); }
        }
        @keyframes orb-drift-3 {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(20px,40px) scale(1.06); }
          80%      { transform: translate(-35px,-15px) scale(0.96); }
        }
        @keyframes shimmer-sweep {
          0%   { transform: translateX(-120%) skewX(-12deg); }
          100% { transform: translateX(220%) skewX(-12deg); }
        }
        @keyframes pulse-ring {
          0%,100% { opacity: 0.15; transform: scale(1); }
          50%      { opacity: 0.3;  transform: scale(1.04); }
        }
      `}</style>

      <div
        className="animate-fade-up relative mb-8 overflow-hidden rounded-2xl px-8 py-10 sm:px-12"
        style={{ background: scheme.gradient, transition: "background 0.6s ease" }}
      >
        {/* Animated orbs */}
        <div
          style={{
            position: "absolute", right: -60, top: -60, width: 260, height: 260,
            borderRadius: "50%", background: scheme.orb1,
            animation: "orb-drift-1 14s ease-in-out infinite", filter: "blur(2px)",
            transition: "background 0.6s ease",
          }}
        />
        <div
          style={{
            position: "absolute", left: -40, bottom: -80, width: 220, height: 220,
            borderRadius: "50%", background: scheme.orb2,
            animation: "orb-drift-2 18s ease-in-out infinite", filter: "blur(4px)",
            transition: "background 0.6s ease",
          }}
        />
        <div
          style={{
            position: "absolute", right: 80, bottom: -40, width: 160, height: 160,
            borderRadius: "50%", background: scheme.orb3,
            animation: "orb-drift-3 11s ease-in-out infinite", filter: "blur(3px)",
            transition: "background 0.6s ease",
          }}
        />

        {/* Pulsing ring overlay */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse 70% 80% at 60% 50%, ${scheme.orb1} 0%, transparent 70%)`,
            animation: "pulse-ring 8s ease-in-out infinite",
            transition: "background 0.6s ease",
          }}
        />

        {/* Shimmer sweep */}
        <div
          style={{
            position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
              animation: "shimmer-sweep 7s ease-in-out infinite",
            }}
          />
        </div>

        {/* Color switcher — top right */}
        <div
          className="absolute right-5 top-5 flex items-center gap-1.5"
          style={{ zIndex: 10 }}
        >
          {SCHEMES.map((s) => (
            <button
              key={s.key}
              onClick={() => pick(s)}
              title={s.key}
              className="cursor-pointer rounded-full transition-transform hover:scale-110 active:scale-95"
              style={{
                width: 14, height: 14, background: s.dot,
                border: scheme.key === s.key
                  ? `2px solid white`
                  : "2px solid rgba(255,255,255,0.3)",
                boxShadow: scheme.key === s.key ? `0 0 0 1px ${s.ring}` : "none",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative" style={{ zIndex: 5 }}>
          {/* Big welcome */}
          <p
            className="mb-0.5 text-sm font-medium"
            style={{ color: scheme.accent }}
          >
            {displayName ? `Welcome back, ${displayName}` : "Welcome to CourseShare"}
          </p>
          <h1 className="mb-1 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Your student
          </h1>
          <h1 className="mb-5 text-3xl font-semibold leading-tight sm:text-4xl" style={{ color: scheme.accent }}>
            resource hub
          </h1>

          <p className="mb-7 max-w-md text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
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
    </>
  );
}
