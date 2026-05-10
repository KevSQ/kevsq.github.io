import { createClient } from '@supabase/supabase-js';

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export function getSupabaseServer() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function fetchGuestbookEntries(limit: number): Promise<GuestbookEntry[]> {
  const client = getSupabaseServer();
  if (!client) return [];
  const { data } = await client
    .from('guestbook')
    .select('id, name, message, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}
