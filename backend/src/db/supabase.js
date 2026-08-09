export const supabase = createClient(config.supabase.url, config.supabase.serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { params: { eventsPerSecond: 0 } },
  global: { headers: { "X-Client-Info": "lily-nails-backend" } },
});
