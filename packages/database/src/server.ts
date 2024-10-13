import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
	const cookieStore = cookies();
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl) {
		throw new Error("Supabase URL is not set.");
	}

	if (!supabaseAnonKey) {
		throw new Error("Supabase anon key is not set.");
	}

	return createServerClient(
		supabaseUrl,
		supabaseAnonKey,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				},
			},
		},
	);
}
