"use client";

import { createClient } from "@/utils/supabase/client";

export function signout() {
  const supabase = createClient();

  return supabase.auth.signOut();
}
