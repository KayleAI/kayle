import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";

export async function updateSession(
	request: NextRequest,
	response: NextResponse,
): Promise<{ response: NextResponse; supabase: SupabaseClient }> {
	if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
		throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
	}

	if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
		throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
	}

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					for (const { name, value, options } of cookiesToSet) {
						response.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	await supabase.auth.getUser();

	return { response, supabase };
}
