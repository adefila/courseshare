import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-key";

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const url = rawUrl.startsWith("http") ? rawUrl : PLACEHOLDER_URL;
  const key = rawKey.length > 10 ? rawKey : PLACEHOLDER_KEY;
  return createBrowserClient<Database>(url, key);
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("http");
}
