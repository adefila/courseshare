"use client";

import { useState, useTransition } from "react";
import { reportResource } from "@/app/actions/resources";
import { Button } from "@/components/ui/Button";

export function ReportButton({ resourceId }: { resourceId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await reportResource(resourceId, reason);
      setDone(true);
      setOpen(false);
    });
  }

  if (done) return <span className="text-xs text-gray-400">Reported</span>;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer text-xs text-zinc-400 transition-colors hover:text-red-500"
      >
        Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-3 font-semibold text-gray-900">Report resource</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you reporting this? (optional)"
              rows={3}
              className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <Button onClick={submit} disabled={isPending} size="sm" variant="danger">
                {isPending ? "Sending…" : "Submit report"}
              </Button>
              <Button onClick={() => setOpen(false)} size="sm" variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
