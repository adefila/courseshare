"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatBytes, formatDate } from "@/lib/utils";
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
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 py-12 text-center">
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 w-40">
          <circle cx="100" cy="80" r="52" fill="#eef2ff" />
          <g transform="rotate(-8 100 88)">
            <rect x="62" y="32" width="64" height="82" rx="6" fill="#c7d2fe" />
            <rect x="74" y="48" width="38" height="3.5" rx="1.5" fill="#a5b4fc" />
            <rect x="74" y="57" width="28" height="3.5" rx="1.5" fill="#a5b4fc" />
          </g>
          <g transform="rotate(-3 100 88)">
            <rect x="58" y="28" width="64" height="82" rx="6" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="1" />
            <rect x="70" y="44" width="38" height="3.5" rx="1.5" fill="#c7d2fe" />
            <rect x="70" y="53" width="28" height="3.5" rx="1.5" fill="#c7d2fe" />
          </g>
          <rect x="54" y="24" width="64" height="82" rx="6" fill="white" stroke="#e0e7ff" strokeWidth="1.5" />
          <rect x="66" y="40" width="38" height="3.5" rx="1.5" fill="#f0f0ff" />
          <rect x="66" y="50" width="28" height="3.5" rx="1.5" fill="#f0f0ff" />
          <rect x="66" y="60" width="34" height="3.5" rx="1.5" fill="#f0f0ff" />
          {/* Upload arrow in circle */}
          <circle cx="136" cy="62" r="22" fill="white" stroke="#e0e7ff" strokeWidth="1.5" />
          <path d="M136 72 L136 54 M129 61 L136 54 L143 61" stroke="#a5b4fc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="130" y1="74" x2="142" y2="74" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
          {/* Sparkles */}
          <path d="M38 50 L39 45 L40 50 L45 51 L40 52 L39 57 L38 52 L33 51 Z" fill="#c7d2fe" />
          <path d="M163 36 L164 32 L165 36 L169 37 L165 38 L164 42 L163 38 L159 37 Z" fill="#a5b4fc" />
          <circle cx="44" cy="112" r="4" fill="#e0e7ff" />
          <circle cx="158" cy="110" r="3" fill="#e0e7ff" />
        </svg>
        <p className="text-sm font-medium text-zinc-700">No resources yet</p>
        <p className="mt-1 text-xs text-zinc-400">Be the first to upload something useful.</p>
      </div>
    );
  }

  return (
    <ul className="list-stagger flex flex-col gap-3">
      {resources.map((resource) => (
        <ResourceRow key={resource.id} resource={resource} />
      ))}
    </ul>
  );
}

function ResourceRow({ resource }: { resource: Resource }) {
  const [downloading, setDownloading] = useState(false);

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
