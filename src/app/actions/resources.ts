"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function reportResource(resourceId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to report." };

  const { error } = await supabase
    .from("reports")
    .insert({ resource_id: resourceId, reported_by: user.id, reason });

  if (error) return { error: error.message };

  // Send email notification via Resend if API key is configured
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const { data: resource } = await supabase
      .from("resources")
      .select("title, courses(course_name, course_code)")
      .eq("id", resourceId)
      .single();

    const courseData = (resource as unknown as { courses?: { course_name: string; course_code: string } | null })?.courses;
    const resourceTitle = resource?.title ?? resourceId;
    const courseName = courseData?.course_name ?? "Unknown course";
    const courseCode = courseData?.course_code ?? "";

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "CourseShare <onboarding@resend.dev>",
        to: ["adefilasamuel929@gmail.com"],
        subject: `[CourseShare] Resource reported: ${resourceTitle}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#18181b">
            <div style="background:linear-gradient(135deg,#1e1b4b,#4f46e5);padding:32px;border-radius:12px 12px 0 0">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#a5b4fc">CourseShare</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#fff">Resource reported</h1>
            </div>
            <div style="border:0.5px solid #e4e4e7;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px">
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:8px 0;color:#71717a;width:120px">Resource</td><td style="padding:8px 0;font-weight:500">${resourceTitle}</td></tr>
                <tr><td style="padding:8px 0;color:#71717a">Course</td><td style="padding:8px 0;font-weight:500">${courseCode ? `${courseCode} – ` : ""}${courseName}</td></tr>
                <tr><td style="padding:8px 0;color:#71717a">Reason</td><td style="padding:8px 0">${reason || "<em style='color:#a1a1aa'>None provided</em>"}</td></tr>
                <tr><td style="padding:8px 0;color:#71717a">Reported by</td><td style="padding:8px 0">${user.email}</td></tr>
              </table>
              <div style="margin-top:24px;padding-top:20px;border-top:0.5px solid #f4f4f5">
                <a href="https://supabase.com/dashboard/project/yknxzbgkfdsbzwisygib/editor" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:10px 20px;border-radius:9999px;font-size:13px;font-weight:600">
                  Review in Supabase →
                </a>
              </div>
              <p style="margin-top:20px;font-size:12px;color:#a1a1aa">Resource ID: ${resourceId}</p>
            </div>
          </div>
        `,
      }),
    }).catch(() => {
      // Email failure is non-fatal — report is already saved to DB
    });
  }

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

  revalidateTag("platform-stats", "max");
  revalidatePath(`/courses/${courseId}`);
  return { success: true };
}
