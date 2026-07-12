"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatBytes, formatDate } from "@/lib/utils";
import { deleteResource } from "@/app/actions/resources";
import { ReportButton } from "./ReportButton";
import type { Resource } from "@/types/database";

interface ResourceListProps {
  resources: Resource[];
  courseId: string;
  userId?: string;
}

const FILE_META: Record<string, { label: string; bg: string; text: string; badge: string }> = {
  pdf:  { label: "PDF",  bg: "bg-red-50",     text: "text-red-500",     badge: "bg-red-500" },
  doc:  { label: "DOC",  bg: "bg-blue-50",    text: "text-blue-500",    badge: "bg-blue-500" },
  docx: { label: "DOC",  bg: "bg-blue-50",    text: "text-blue-500",    badge: "bg-blue-500" },
  ppt:  { label: "PPT",  bg: "bg-orange-50",  text: "text-orange-500",  badge: "bg-orange-500" },
  pptx: { label: "PPT",  bg: "bg-orange-50",  text: "text-orange-500",  badge: "bg-orange-500" },
  xls:  { label: "XLS",  bg: "bg-emerald-50", text: "text-emerald-600", badge: "bg-emerald-600" },
  xlsx: { label: "XLS",  bg: "bg-emerald-50", text: "text-emerald-600", badge: "bg-emerald-600" },
  zip:  { label: "ZIP",  bg: "bg-amber-50",   text: "text-amber-600",   badge: "bg-amber-600" },
  txt:  { label: "TXT",  bg: "bg-zinc-100",   text: "text-zinc-500",    badge: "bg-zinc-500" },
};

function fileMeta(filePath: string) {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  return FILE_META[ext] ?? { label: "FILE", bg: "bg-indigo-50", text: "text-indigo-500", badge: "bg-indigo-500" };
}

function FileIcon({ filePath }: { filePath: string }) {
  const meta = fileMeta(filePath);
  return (
    <div className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-zinc-100 ${meta.bg}`}>
      {/* document shape */}
      <div className="flex h-full flex-col items-center pt-[7px]">
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <path d="M2 0H11L18 7V18C18 19.1 17.1 20 16 20H2C.9 20 0 19.1 0 18V2C0 .9.9 0 2 0Z" fill="white" stroke="#e4e4e7" strokeWidth="1.5"/>
          <path d="M11 0L18 7H13C11.9 7 11 6.1 11 5V0Z" fill="#e4e4e7"/>
        </svg>
      </div>
      {/* label badge */}
      <div className={`absolute bottom-0 left-0 right-0 py-[3px] text-center text-[8px] font-bold leading-none tracking-wide text-white ${meta.badge}`}>
        {meta.label}
      </div>
    </div>
  );
}

export function ResourceList({ resources, courseId, userId }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-200 bg-white/60 py-10 text-center">
        <svg viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 w-36">
          <ellipse cx="100" cy="158" rx="58" ry="8" fill="#e4e4e7" opacity="0.5" />
          <g transform="rotate(-7 100 95)">
            <rect x="58" y="28" width="84" height="108" rx="6" fill="#e4e4e7" />
            <rect x="72" y="46" width="50" height="4" rx="2" fill="#d4d4d8" />
            <rect x="72" y="56" width="36" height="4" rx="2" fill="#d4d4d8" />
          </g>
          <g transform="rotate(-3 100 95)">
            <rect x="54" y="24" width="84" height="108" rx="6" fill="#ececec" stroke="#e4e4e7" strokeWidth="1" />
            <rect x="68" y="42" width="50" height="4" rx="2" fill="#e4e4e7" />
            <rect x="68" y="52" width="38" height="4" rx="2" fill="#e4e4e7" />
          </g>
          <rect x="50" y="20" width="84" height="108" rx="6" fill="white" stroke="#e4e4e7" strokeWidth="1.5" />
          <rect x="64" y="38" width="50" height="4" rx="2" fill="#f4f4f5" />
          <rect x="64" y="50" width="36" height="4" rx="2" fill="#f4f4f5" />
          <rect x="64" y="62" width="44" height="4" rx="2" fill="#f4f4f5" />
          <circle cx="92" cy="96" r="16" fill="#f4f4f5" />
          <path d="M92 89 L92 103 M85 96 L99 96" stroke="#a1a1aa" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <p className="text-sm font-medium text-zinc-700">No resources yet</p>
        <p className="mt-1 text-xs text-zinc-400">Be the first to upload something useful.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {resources.map((resource) => (
        <ResourceRow key={resource.id} resource={resource} courseId={courseId} userId={userId} />
      ))}
    </ul>
  );
}

function ResourceRow({ resource, courseId, userId }: { resource: Resource; courseId: string; userId?: string }) {
  const [downloading, setDownloading] = useState(false);
  const [deleting, startDeleting] = useTransition();

  async function handleDownload() {
    setDownloading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase.storage.from("resources").createSignedUrl(resource.file_path, 60);
      if (data?.signedUrl) {
        const a = document.createElement("a");
        a.href = data.signedUrl;
        a.download = resource.title;
        a.click();
      }
    } finally {
      setDownloading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this resource? This cannot be undone.")) return;
    startDeleting(async () => {
      await deleteResource(resource.id, courseId);
    });
  }

  const isOwner = userId === resource.uploaded_by;

  return (
    <li className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition-all duration-150 hover:border-indigo-200">
      <FileIcon filePath={resource.file_path} />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-900">{resource.title}</p>
        {resource.description && (
          <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">{resource.description}</p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
          {resource.file_size_bytes != null && <span>{formatBytes(resource.file_size_bytes)}</span>}
          <span>{formatDate(resource.created_at)}</span>
          <ReportButton resourceId={resource.id} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete resource"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
          >
            {deleting ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            )}
          </button>
        )}

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5" />
            <path d="M12 15V3" />
          </svg>
          {downloading ? "…" : "Download"}
        </button>
      </div>
    </li>
  );
}
