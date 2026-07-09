"use client";

import { useActionState } from "react";
import { createCourse } from "@/app/actions/courses";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const CURRENT_YEAR = new Date().getFullYear();

export function CourseForm() {
  const [state, action, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await createCourse(formData);
    },
    null
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      <Input
        id="course_name"
        name="course_name"
        label="Course name *"
        placeholder="Introduction to Computer Science"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="course_code"
          name="course_code"
          label="Course code *"
          placeholder="COMP101"
          required
        />
        <Input
          id="university"
          name="university"
          label="University *"
          placeholder="University of Lagos"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="semester" className="text-[13px] font-semibold text-zinc-700">
            Semester *
          </label>
          <select
            id="semester"
            name="semester"
            required
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select…</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>
        </div>
        <Input
          id="year"
          name="year"
          label="Year *"
          type="number"
          min={2000}
          max={2100}
          defaultValue={CURRENT_YEAR}
          required
        />
      </div>
      <Textarea
        id="description"
        name="description"
        label="Description (optional)"
        placeholder="Brief overview of what this course covers…"
        rows={3}
      />

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} size="lg">
        {isPending ? "Creating…" : "Create course"}
      </Button>
    </form>
  );
}
