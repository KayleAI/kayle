import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { text } = await req.json();
	const KAYLE_API_KEY = process.env.KAYLE_API_KEY!;

	const engine =
		process.env.NODE_ENV === "production"
			? "https://api.kayle.ai/v1/moderate/text"
			: "http://127.0.0.1:8787/v1/moderate/text";

	const response = await fetch(engine, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${KAYLE_API_KEY}`,
		},
		body: JSON.stringify({
			text,
		}),
	});

	// parse the response
	const { severity, violations } = await response.json();

	// return the response
	return NextResponse.json({ severity, violations });
}
