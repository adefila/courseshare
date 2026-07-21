import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

/**
 * Platform-wide counts shown on the home and browse stat cards.
 * Cached for 60s (and tagged so course/resource mutations can bust it) —
 * uses a plain anon client because cookie-bound clients can't run inside
 * a cache scope, and these are public numbers anyway.
 */
export const getPlatformStats = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [{ count: totalCourses }, { count: totalResources }, { data: universityRows }] =
      await Promise.all([
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("resources").select("*", { count: "exact", head: true }).eq("is_removed", false),
        supabase.from("courses").select("university"),
      ]);

    return {
      totalCourses: totalCourses ?? 0,
      totalResources: totalResources ?? 0,
      universities: [...new Set((universityRows ?? []).map((r) => r.university))],
    };
  },
  ["platform-stats"],
  { revalidate: 60, tags: ["platform-stats"] }
);
