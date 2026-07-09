"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function reportResource(resourceId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to report." };

  const { error } = await supabase
    .from("reports")
    .insert({ resource_id: resourceId, reported_by: user.id, reason });

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteResource(resourceId: string, courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: resource } = await supabase
    .from("resources")
    .select("uploaded_by, file_path")
    .eq("id", resourceId)
    .single();

  if (!resource || resource.uploaded_by !== user.id)
    return { error: "Not authorized to delete this resource." };

  await supabase.storage.from("resources").remove([resource.file_path]);
  await supabase.from("resources").delete().eq("id", resourceId);

  revalidatePath(`/courses/${courseId}`);
  return { success: true };
}
