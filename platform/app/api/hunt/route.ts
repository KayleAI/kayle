import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { text } = await req.json();

	if (!process.env.KAYLE_API_KEY) {
		throw new Error("KAYLE_API_KEY environment variable is not set");
	}

	const engine =
		process.env.NODE_ENV === "production"
			? "https://api.kayle.ai/v1/moderate/text"
			: "http://127.0.0.1:8787/v1/moderate/text";

	const response = await fetch(engine, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.KAYLE_API_KEY}`,
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
