"use client";

import { useState, useTransition, useEffect } from "react";
import { reportResource } from "@/app/actions/resources";

const REASONS = [
  "Broken or missing file",
  "Wrong course content",
  "Inappropriate content",
  "Duplicate resource",
];

export function ReportButton({ resourceId }: { resourceId: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [detail, setDetail] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function submit() {
    const reason = selected
      ? `${selected}${detail.trim() ? `: ${detail.trim()}` : ""}`
      : detail.trim();
    startTransition(async () => {
      await reportResource(resourceId, reason);
      setDone(true);
      setTimeout(() => setOpen(false), 0);
    });
  }

  if (done) return <span className="text-xs text-zinc-400">Reported</span>;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer text-xs text-zinc-400 transition-colors hover:text-red-500"
      >
        Report
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-[2px] sm:items-center"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white"
            style={{ border: "0.5px solid #e4e4e7" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between bg-gradient-to-b from-red-50/60 to-white px-6 py-5"
              style={{ borderBottom: "0.5px solid #fce8e8" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">Report resource</h3>
                  <p className="text-xs text-zinc-500">We&apos;ll review it and take action.</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                Reason
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelected(selected === r ? "" : r)}
                    className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      selected === r
                        ? "bg-red-50 text-red-600 ring-1 ring-red-200"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Additional details (optional)…"
                rows={3}
                className="w-full resize-none rounded-xl bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-100"
                style={{ border: "0.5px solid #e4e4e7" }}
              />

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={submit}
                  disabled={isPending || (!selected && !detail.trim())}
                  className="cursor-pointer flex-1 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "Submitting…" : "Submit report"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 active:scale-[0.97]"
                  style={{ border: "0.5px solid #e4e4e7" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
