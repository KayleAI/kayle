"use server";

import { Unkey } from "@unkey/api";
import { createClient } from "@/lib/supabase/server";

const unkey = new Unkey({ rootKey: process.env.UNKEY_AUTH_TOKEN! });

export async function performActionOnKey({
  keyId,
  action
}:{
  keyId: string;
  action: "activate" | "suspend" | "revoke";
}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { error };
  }

  if (!data) {
    return { error: "No data." };
  }

  const response = await fetch(
    `https://api.unkey.dev/v1/keys.getKey?keyId=${keyId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.UNKEY_AUTH_TOKEN!}` },
    },
  );

  const result = await response.json();

  if (result.error) {
    return { error: result.error.message };
  }

  if (result.ownerId !== data.user.id) {
    return { error: "Unauthorized" };
  }

  switch (action) {
    case "activate":
      await unkey.keys.update({ keyId: keyId, enabled: true });
      break;
    case "suspend":
      await unkey.keys.update({ keyId: keyId, enabled: false });
      break;
    case "revoke":
      await unkey.keys.delete({ keyId: keyId });
      break;
    default:
      return { error: "Invalid action" };
  }

  return { error: null, success: true };
}
