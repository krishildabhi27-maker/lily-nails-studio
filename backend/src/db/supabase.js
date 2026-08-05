// Supabase client using the SERVICE ROLE key. Server-only — bypasses RLS.
// NEVER ship this key to the browser.
import { createClient } from "@supabase/supabase-js";
import { config } from "../config.js";

export const supabase = createClient(config.supabase.url, config.supabase.serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
