import { createClient } from "@repo/db/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const host = req.nextUrl.host;
	const supabase = createClient();

	const { error } = await supabase.auth.signOut();

	const url = new URL(host);

	if (error) {
		url.searchParams.append("error", error.message);
		return NextResponse.redirect(url.toString());
	}

	return NextResponse.redirect(url.toString());
}
