"use client";

import { useActionState } from "react";
import { createCourse } from "@/app/actions/courses";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const CURRENT_YEAR = new Date().getFullYear();

const NIGERIAN_UNIVERSITIES = [
  "Ahmadu Bello University (ABU)",
  "American University of Nigeria (AUN)",
  "Babcock University",
  "Baze University",
  "Bells University of Technology",
  "Covenant University",
  "Crawford University",
  "Federal University of Technology, Akure (FUTA)",
  "Federal University of Technology, Minna (FUTMINNA)",
  "Federal University of Technology, Owerri (FUTO)",
  "Landmark University",
  "Lagos State University (LASU)",
  "Ladoke Akintola University of Technology (LAUTECH)",
  "Nnamdi Azikiwe University (NAU)",
  "Obafemi Awolowo University (OAU)",
  "Pan-Atlantic University",
  "Redeemer's University",
  "Rivers State University",
  "University of Abuja",
  "University of Benin (UNIBEN)",
  "University of Ibadan (UI)",
  "University of Ilorin (UNILORIN)",
  "University of Jos (UNIJOS)",
  "University of Lagos (UNILAG)",
  "University of Nigeria, Nsukka (UNN)",
  "University of Port Harcourt (UNIPORT)",
];

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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="university" className="text-[13px] font-medium text-zinc-700">
            University *
          </label>
          <input
            id="university"
            name="university"
            list="university-list"
            placeholder="University of Lagos"
            required
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
          />
          <datalist id="university-list">
            {NIGERIAN_UNIVERSITIES.map((u) => <option key={u} value={u} />)}
          </datalist>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="semester" className="text-[13px] font-medium text-zinc-700">
            Semester *
          </label>
          <div className="relative">
            <select
              id="semester"
              name="semester"
              required
              className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-zinc-900 transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            >
              <option value="">Select…</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="Harmattan">Harmattan</option>
              <option value="Rain">Rain</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
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
