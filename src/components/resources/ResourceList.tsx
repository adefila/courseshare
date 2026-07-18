"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatBytes, formatDate } from "@/lib/utils";
import { ReportButton } from "./ReportButton";
import type { Resource } from "@/types/database";

type ResourceWithUploader = Resource & {
  uploader?: { display_name: string | null } | null;
};

interface ResourceListProps {
  resources: ResourceWithUploader[];
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
    <div className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ${meta.bg}`} style={{ border: "0.5px solid #ebebf0" }}>
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

function EmptyIllustration() {
  return (
    <svg width="128" height="108" viewBox="0 0 128 108" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Back-left doc */}
      <g transform="rotate(-12, 32, 30)">
        <rect x="14" y="18" width="44" height="56" rx="5" fill="#e0e7ff" />
        <rect x="14" y="18" width="44" height="56" rx="5" stroke="#c7d2fe" strokeWidth="1.2" />
        <rect x="21" y="36" width="24" height="2.5" rx="1.2" fill="#c7d2fe" />
        <rect x="21" y="42" width="18" height="2.5" rx="1.2" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="0.5" />
        <rect x="21" y="48" width="21" height="2.5" rx="1.2" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="0.5" />
      </g>
      {/* Back-right doc */}
      <g transform="rotate(11, 90, 26)">
        <rect x="68" y="14" width="44" height="56" rx="5" fill="#ede9fe" />
        <rect x="68" y="14" width="44" height="56" rx="5" stroke="#ddd6fe" strokeWidth="1.2" />
        <rect x="75" y="32" width="24" height="2.5" rx="1.2" fill="#ddd6fe" />
        <rect x="75" y="38" width="16" height="2.5" rx="1.2" fill="#ede9fe" stroke="#ddd6fe" strokeWidth="0.5" />
      </g>
      {/* Front center doc (white card) */}
      <rect x="40" y="10" width="48" height="64" rx="6" fill="white" stroke="#c7d2fe" strokeWidth="1.5" />
      {/* dog-ear fold */}
      <path d="M76 10 L88 22 H76 Z" fill="#e0e7ff" />
      <path d="M76 10 L88 22" stroke="#c7d2fe" strokeWidth="1.5" strokeLinejoin="round" />
      {/* content lines */}
      <rect x="48" y="32" width="28" height="3" rx="1.5" fill="#c7d2fe" />
      <rect x="48" y="40" width="20" height="2.5" rx="1.25" fill="#e0e7ff" />
      <rect x="48" y="47" width="24" height="2.5" rx="1.25" fill="#e0e7ff" />
      <rect x="48" y="54" width="16" height="2.5" rx="1.25" fill="#e0e7ff" />
      {/* Upload button circle */}
      <circle cx="64" cy="90" r="14" fill="#eef2ff" />
      <circle cx="64" cy="90" r="10" fill="#4f46e5" />
      <path d="M64 95 V85 M60.5 88.5 L64 85 L67.5 88.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* motion dots */}
      <circle cx="64" cy="77" r="1.5" fill="#a5b4fc" opacity="0.7" />
      <circle cx="58" cy="79" r="1" fill="#a5b4fc" opacity="0.5" />
      <circle cx="70" cy="79" r="1" fill="#a5b4fc" opacity="0.5" />
    </svg>
  );
}

export function ResourceList({ resources, courseId, userId }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-indigo-50/60 to-white px-8 py-12 text-center">
        <EmptyIllustration />
        <p className="mt-4 mb-1 text-sm font-semibold text-zinc-800">No resources yet</p>
        <p className="mb-6 max-w-xs text-xs leading-relaxed text-zinc-400">
          Be the first to upload something useful — notes, past papers, slides.
        </p>
        <Link
          href={`/courses/${courseId}/upload`}
          className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-500"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M17 8l-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
          Upload resource
        </Link>
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

function ResourceRow({ resource }: { resource: ResourceWithUploader }) {
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
    <li className="group flex items-center gap-4 rounded-2xl bg-white px-5 py-4 transition-all duration-200 hover:bg-indigo-50/30" style={{ border: "0.5px solid #e8e8f0" }}>
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
          {resource.uploader?.display_name && (
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              {resource.uploader.display_name}
            </span>
          )}
          <ReportButton resourceId={resource.id} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="cursor-pointer flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-600 transition hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
          style={{ border: "0.5px solid #e4e4e7" }}
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
