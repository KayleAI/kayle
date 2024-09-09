/**
 * This route allows moderators to request user information
 * through an external (non-kayle) API.
 *
 * For example, a moderator reviewing messages may want to
 * view the user's name, avatar, and other information.
 */

import { type NextRequest, NextResponse } from "next/server";

export function GET(_: NextRequest) {
	return NextResponse.json({ message: "Hello World" });
}
