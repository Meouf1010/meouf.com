"use client";

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

export const supabase = createSupabaseBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
