"use client";

import { createClient } from "@repo/db/client";

export async function signout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error.message);
  }
}
