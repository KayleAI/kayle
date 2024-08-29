import arcjet, { tokenBucket } from "@arcjet/next";
import { type NextRequest, NextResponse } from "next/server";

const ajCharacteristics =
	process.env.NODE_ENV === "production" ? ["ip"] : ["ip2"];

const aj = arcjet({
	key: process.env.ARCJET_KEY!,
	characteristics: ajCharacteristics,
	rules: [
		tokenBucket({
			mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
			refillRate: 1,
			interval: 60,
			capacity: 10,
		}),
	],
});

export async function POST(req: NextRequest) {
	const ip = req.ip ?? "unknown";

	// we've got a weird ip bug in development, so we're using a hardcoded ip2 as a workaround
	const decision = await aj.protect(req, {
		...(process.env.NODE_ENV === "production" ? { ip } : { ip2: "127.0.0.1" }),
		requested: 1,
	});

	if (decision.isDenied()) {
		if (decision.reason.isRateLimit()) {
			return NextResponse.json(
				{
					error: "Too Many Requests",
					reason:
						"To protect our infrastructure, we’re limiting the number of requests you can make.",
				},
				{
					status: 429,
				},
			);
		}

		return NextResponse.json(
			{
				error: "Forbidden",
				reason: decision.reason,
			},
			{
				status: 403,
			},
		);
	}

	const { input, type } = await req.json();

	switch (type) {
		case "text":
			try {
				if (input instanceof File) {
					throw new Error("Input must be a string");
				}

				if (typeof input !== "string") {
					throw new Error("Input must be a string");
				}

				const response = await callKayleAPI({ input, type });

				return NextResponse.json(response);
			} catch (error) {
				return NextResponse.json({
					error: "An error occurred while calling the Kayle API",
				});
			}
		case "image":
			try {
				if (!(input instanceof File)) {
					throw new Error("Input must be a file");
				}

				const response = await callKayleAPI({ input, type });

				return response;
			} catch (error) {
				return NextResponse.json({
					error: "An error occurred while calling the Kayle API",
				});
			}

		case "audio":
			try {
				if (!(input instanceof File)) {
					throw new Error("Input must be a file");
				}

				const response = await callKayleAPI({ input, type });

				return response;
			} catch (error) {
				return NextResponse.json({
					error: "An error occurred while calling the Kayle API",
				});
			}
	}

	return NextResponse.json({
		error: "Invalid request",
	});
}

async function callKayleAPI({
	input,
	type,
}: {
	readonly input: string | File;
	readonly type: "text" | "image" | "audio";
}) {
	const kayleKey = process.env.KAYLE_API_KEY;

	if (!kayleKey) {
		throw new Error("KAYLE_API_KEY is not set");
	}

	const url = new URL(
		process.env.NODE_ENV === "production"
			? "https://api.kayle.ai"
			: "http://localhost:8787",
	);

	let body = {};

	switch (type) {
		case "text":
			url.pathname = "/v1/moderate/text";
			body = { text: input };
			break;
		case "image":
			url.pathname = "/v1/moderate/image";
			body = { image: input };
			break;
		case "audio":
			url.pathname = "/v1/moderate/audio";
			body = { audio: input };
			break;
	}

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${kayleKey}`,
		},
		body: JSON.stringify(body),
	});

	return response.json();
}
