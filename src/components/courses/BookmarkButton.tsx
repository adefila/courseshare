"use client";

import { useState, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

interface Props {
  courseId: string;
  courseName: string;
  size?: "sm" | "md";
}

export function BookmarkButton({ courseId, courseName, size = "md" }: Props) {
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) return;
      supabase
        .from("bookmarks")
        .select("course_id")
        .eq("user_id", uid)
        .eq("course_id", courseId)
        .maybeSingle()
        .then(({ data: row }) => setSaved(!!row));
    });
  }, [courseId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      window.location.href = `/login?redirectTo=/courses`;
      return;
    }
    setBusy(true);
    const supabase = createClient();
    if (saved) {
      await supabase.from("bookmarks").delete().eq("user_id", userId).eq("course_id", courseId);
      setSaved(false);
      toast("Removed from Saved", "info");
    } else {
      await supabase.from("bookmarks").insert({ user_id: userId, course_id: courseId });
      setSaved(true);
      toast(`Saved "${courseName}"`, "success");
    }
    setBusy(false);
  }

  const dim = size === "sm" ? "h-6 w-6" : "h-9 w-9";
  const icon = size === "sm" ? 12 : 14;
  const mdStyle = size === "md"
    ? `border ${saved ? "border-indigo-300 bg-indigo-50 text-indigo-600" : "border-zinc-200 bg-white text-zinc-400 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"}`
    : `border ${saved ? "border-indigo-300 bg-indigo-50 text-indigo-600" : "border-zinc-200 bg-white/80 text-zinc-400 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"}`;

  return (
    <button
      onClick={toggle}
      disabled={busy}
      title={saved ? "Remove from saved" : "Save course"}
      className={`cursor-pointer flex shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-100 disabled:hover:scale-100 ${dim} ${mdStyle}`}
    >
      <svg
        width={icon} height={icon}
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
