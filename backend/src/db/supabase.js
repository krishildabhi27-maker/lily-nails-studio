import { config } from "../config.js";
import { createClient } from "@supabase/supabase-js";

class NoopWebSocket {
  constructor() { this.readyState = 3; }
  addEventListener() {}
  removeEventListener() {}
  send() {}
  close() {}
}

export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    realtime: {
      transport: NoopWebSocket,
      params: {
        eventsPerSecond: 0
      }
    },
    global: {
      headers: {
        "X-Client-Info": "lily-nails-backend"
      }
    }
  }
);
