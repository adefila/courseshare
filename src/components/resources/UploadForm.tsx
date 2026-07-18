"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

interface UploadFormProps {
  courseId: string;
  userId: string;
}

export function UploadForm({ courseId, userId }: UploadFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [progress, setProgress] = useState(0);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_BYTES) {
      setFileError("File exceeds the 50 MB limit.");
      e.target.value = "";
      return;
    }
    setFile(f);
    setFileError("");
    if (f && !title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFileError("");
    setTitleError("");
    setSubmitError("");

    if (!title.trim()) { setTitleError("Title is required"); return; }
    if (!file) { setFileError("Please select a file."); return; }

    const selectedFile = file;

    startTransition(async () => {
      const supabase = createClient();

      // Generate UUID on the client so cleanup is trivial if DB insert fails
      const resourceId = crypto.randomUUID();
      const filePath = `${courseId}/${resourceId}/${selectedFile.name}`;

      setProgress(30);

      // 1. Upload to Storage
      const { error: storageError } = await supabase.storage
        .from("resources")
        .upload(filePath, selectedFile);

      if (storageError) {
        setProgress(0);
        return setSubmitError(storageError.message);
      }

      setProgress(70);

      // 2. Insert DB record
      const { error: dbError } = await supabase.from("resources").insert({
        id: resourceId,
        course_id: courseId,
        uploaded_by: userId,
        title: title.trim(),
        description: description.trim() || null,
        file_path: filePath,
        file_size_bytes: selectedFile.size,
        file_type: selectedFile.type || null,
      });

      if (dbError) {
        // Cleanup orphaned storage object
        await supabase.storage.from("resources").remove([filePath]);
        setProgress(0);
        return setSubmitError(dbError.message);
      }

      setProgress(100);
      router.push(`/courses/${courseId}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-zinc-700">
          File *
        </label>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar"
          onChange={handleFileChange}
          className="w-full cursor-pointer rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-3.5 py-3 text-sm text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-50 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-zinc-100 file:px-3.5 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-700 hover:file:bg-zinc-200"
        />
        {fileError ? (
          <p className="mt-1.5 text-xs text-red-600">{fileError}</p>
        ) : (
          <p className="mt-1.5 text-xs text-zinc-400">
            PDF, Word, PowerPoint, Excel, TXT, ZIP — max 50 MB
          </p>
        )}
      </div>

      <Input
        id="title"
        label="Title *"
        placeholder="Week 3 Lecture Notes"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setTitleError(""); }}
        error={titleError}
      />

      <Textarea
        id="description"
        label="Description (optional)"
        placeholder="What's in this file? Topics covered, semester, etc."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {submitError && (
        <p className="text-sm text-red-500">{submitError}</p>
      )}

      {isPending && progress > 0 && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <Button type="submit" disabled={isPending} size="lg">
        {isPending ? "Uploading…" : "Upload resource"}
      </Button>
    </form>
  );
}
