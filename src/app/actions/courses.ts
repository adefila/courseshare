"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const courseSchema = z.object({
  course_name: z.string().min(2).max(120),
  course_code: z.string().min(1).max(30),
  university: z.string().min(2).max(120),
  semester: z.enum(["1st Semester", "2nd Semester", "Harmattan", "Rain"]),
  year: z.coerce.number().int().min(2000).max(2100),
  description: z.string().max(500).optional(),
});

export async function createCourse(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = courseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { data, error } = await supabase
    .from("courses")
    .insert({ ...parsed.data, created_by: user.id })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidateTag("platform-stats", "max");
  revalidatePath("/courses");
  redirect(`/courses/${data.id}`);
}
