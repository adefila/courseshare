"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ResourceList } from "./ResourceList";
import type { Resource } from "@/types/database";

type ResourceWithUploader = Resource & {
  uploader?: { display_name: string | null } | null;
};

const EXT_LABEL: Record<string, string> = {
  pdf: "PDF", doc: "DOC", docx: "DOC",
  ppt: "PPT", pptx: "PPT",
  xls: "XLS", xlsx: "XLS",
  zip: "ZIP", txt: "TXT",
};

function getLabel(filePath: string) {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  return EXT_LABEL[ext] ?? "FILE";
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function ResourceListWithFilter({
  resources,
  courseId,
  userId,
}: {
  resources: ResourceWithUploader[];
  courseId: string;
  userId?: string;
}) {
  const types = unique(resources.map((r) => getLabel(r.file_path)));
  const [activeType, setActiveType] = useState<string>("All");
  const [downloading, setDownloading] = useState(false);

  const filtered = activeType === "All"
    ? resources
    : resources.filter((r) => getLabel(r.file_path) === activeType);

  async function downloadAll() {
    if (filtered.length === 0 || downloading) return;
    setDownloading(true);
    const supabase = createClient();

    for (const resource of filtered) {
      try {
        const { data } = await supabase.storage
          .from("resources")
          .createSignedUrl(resource.file_path, 120);
        if (!data?.signedUrl) continue;

        const res = await fetch(data.signedUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const ext = resource.file_path.split(".").pop() ?? "";
        const filename = resource.title.includes(".") ? resource.title : `${resource.title}.${ext}`;

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 200);

        // small gap so browser doesn't block multiple downloads
        await new Promise((r) => setTimeout(r, 400));
      } catch {
        // skip failed files
      }
    }
    setDownloading(false);
  }

  return (
    <>
      {/* Header row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-zinc-900">Resources</h2>
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700">
            {filtered.length}
            {activeType !== "All" && ` of ${resources.length}`}
          </span>
        </div>

        {resources.length > 0 && (
          <button
            onClick={downloadAll}
            disabled={downloading || filtered.length === 0}
            className="cursor-pointer flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M7 10l5 5 5-5" /><path d="M12 15V3" />
            </svg>
            {downloading ? "Downloading…" : `Download all${activeType !== "All" ? ` ${activeType}s` : ""}`}
          </button>
        )}
      </div>

      {/* File-type filter tabs */}
      {types.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {["All", ...types].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                activeType === t
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:border-indigo-200 hover:text-indigo-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <ResourceList resources={filtered} courseId={courseId} userId={userId} />
    </>
  );
}
