import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient(env: {
	SUPABASE_URL: string;
	SUPABASE_SERVICE_ROLE_KEY: string;
}) {
	return createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
