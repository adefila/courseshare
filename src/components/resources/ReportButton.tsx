"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
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
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function submit() {
    const reason = selected
      ? `${selected}${detail.trim() ? `: ${detail.trim()}` : ""}`
      : detail.trim();
    startTransition(async () => {
      await reportResource(resourceId, reason);
      setDone(true);
    });
  }

  if (done && !open) return <span className="text-xs text-zinc-400">Reported</span>;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer text-xs text-zinc-400 transition-colors hover:text-red-500"
      >
        Report
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex flex-col bg-white">

          {/* Top bar */}
          <div
            className="flex h-14 shrink-0 items-center justify-between px-5 sm:px-8"
            style={{ borderBottom: "0.5px solid #f0f0f5" }}
          >
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Close
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </div>
              <span className="font-semibold text-zinc-900">Report resource</span>
            </div>

            {/* spacer to center title */}
            <div className="w-16" />
          </div>

          {/* Scrollable content */}
          <div className="flex flex-1 flex-col items-center overflow-y-auto px-5 py-10 sm:px-8">
            <div className="w-full max-w-lg">
              {done ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-green-50">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold text-zinc-900">Report received</h2>
                  <p className="mb-8 max-w-sm text-sm leading-relaxed text-zinc-500">
                    We received your report and will review it shortly. Thank you for helping keep CourseShare accurate and useful.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="cursor-pointer rounded-full bg-zinc-900 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 active:scale-[0.97]"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="mb-1 text-2xl font-semibold text-zinc-900">What&apos;s the issue?</h2>
                    <p className="text-sm text-zinc-500">Help us understand why this resource should be reviewed.</p>
                  </div>

                  {/* Reason chips */}
                  <div className="mb-6">
                    <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                      Select a reason
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {REASONS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setSelected(selected === r ? "" : r)}
                          className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
                            selected === r
                              ? "bg-red-50 text-red-600 ring-1 ring-red-300"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detail */}
                  <div className="mb-8">
                    <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                      Additional details (optional)
                    </p>
                    <textarea
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      placeholder="Describe the issue in more detail…"
                      rows={5}
                      className="w-full resize-none rounded-2xl bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      style={{ border: "0.5px solid #e4e4e7" }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={submit}
                      disabled={isPending || (!selected && !detail.trim())}
                      className="cursor-pointer flex-1 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isPending ? "Submitting…" : "Submit report"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="cursor-pointer rounded-full px-6 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 active:scale-[0.97]"
                      style={{ border: "0.5px solid #e4e4e7" }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
