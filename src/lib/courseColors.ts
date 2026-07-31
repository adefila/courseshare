type CourseColor = {
  gradient: string;   // CSS gradient string for card header
  glow: string;       // rgba for radial glow
  accent: string;     // hex for small accents
  pill: string;       // Tailwind classes for the code badge
};

const PALETTE: { prefix: string; color: CourseColor }[] = [
  { prefix: "CSC", color: { gradient: "linear-gradient(155deg,#1e3a5f 0%,#1e40af 55%,#2563eb 100%)", glow: "rgba(59,130,246,0.35)", accent: "#3b82f6", pill: "bg-blue-50 text-blue-700" } },
  { prefix: "CVE", color: { gradient: "linear-gradient(155deg,#451a03 0%,#92400e 55%,#b45309 100%)", glow: "rgba(245,158,11,0.35)", accent: "#f59e0b", pill: "bg-amber-50 text-amber-700" } },
  { prefix: "CEG", color: { gradient: "linear-gradient(155deg,#451a03 0%,#92400e 55%,#b45309 100%)", glow: "rgba(245,158,11,0.35)", accent: "#f59e0b", pill: "bg-amber-50 text-amber-700" } },
  { prefix: "BIO", color: { gradient: "linear-gradient(155deg,#052e16 0%,#065f46 55%,#059669 100%)", glow: "rgba(16,185,129,0.35)", accent: "#10b981", pill: "bg-emerald-50 text-emerald-700" } },
  { prefix: "PHY", color: { gradient: "linear-gradient(155deg,#2e1065 0%,#5b21b6 55%,#7c3aed 100%)", glow: "rgba(139,92,246,0.35)", accent: "#8b5cf6", pill: "bg-violet-50 text-violet-700" } },
  { prefix: "CHE", color: { gradient: "linear-gradient(155deg,#042f2e 0%,#115e59 55%,#0d9488 100%)", glow: "rgba(20,184,166,0.35)", accent: "#14b8a6", pill: "bg-teal-50 text-teal-700" } },
  { prefix: "MAT", color: { gradient: "linear-gradient(155deg,#4c0519 0%,#9f1239 55%,#e11d48 100%)", glow: "rgba(244,63,94,0.35)", accent: "#f43f5e", pill: "bg-rose-50 text-rose-700" } },
  { prefix: "EEE", color: { gradient: "linear-gradient(155deg,#083344 0%,#0e7490 55%,#0891b2 100%)", glow: "rgba(6,182,212,0.35)", accent: "#06b6d4", pill: "bg-cyan-50 text-cyan-700" } },
  { prefix: "CVS", color: { gradient: "linear-gradient(155deg,#1c1917 0%,#44403c 55%,#57534e 100%)", glow: "rgba(120,113,108,0.35)", accent: "#78716c", pill: "bg-stone-100 text-stone-600" } },
  { prefix: "MEC", color: { gradient: "linear-gradient(155deg,#1a1a2e 0%,#374151 55%,#4b5563 100%)", glow: "rgba(107,114,128,0.3)", accent: "#6b7280", pill: "bg-zinc-100 text-zinc-600" } },
];

const DEFAULT: CourseColor = {
  gradient: "linear-gradient(155deg,#1e1b4b 0%,#312e81 55%,#3730a3 100%)",
  glow: "rgba(99,102,241,0.3)",
  accent: "#6366f1",
  pill: "bg-indigo-50 text-indigo-700",
};

export function getCourseColor(courseCode: string): CourseColor {
  const code = courseCode.toUpperCase();
  const match = PALETTE.find((p) => code.startsWith(p.prefix));
  return match?.color ?? DEFAULT;
}
