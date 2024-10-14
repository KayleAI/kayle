import { updateSession } from "@repo/db/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const baseUrl = new URL(request.nextUrl.origin);

	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	// update the session
	const { response: updatedResponse, supabase } = await updateSession(
		request,
		response,
	);

	response = updatedResponse;

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (request.nextUrl.pathname === "/") {
		baseUrl.pathname = "/home";
		if (!error && user) {
			baseUrl.pathname = "/dashboard";
		}
		response = NextResponse.rewrite(baseUrl.toString());
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
