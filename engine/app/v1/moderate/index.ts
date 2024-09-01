// Hono
import { Hono } from "hono";

// Moderation Endpoints
import { moderateAudioRoute } from "./audio";
import { moderateTextRoute } from "./text";

export const moderate = new Hono<{
	Bindings: CloudflareBindings;
	Variables: {
		type: string;
	};
}>();

moderate.use("/:type?", async (c, next) => {
	const { type: paramType = undefined } = c.req.param();
	let bodyType = undefined;

	switch (c.req.header("Content-Type")) {
		case "application/json":
			try {
				const body = await c.req.json();
				bodyType = body.type;
			} catch (error) {
				return c.json(
					{
						message: "Invalid JSON body",
					},
					400,
				);
			}
			break;
		// TODO: We might potentially add support for other content types in the future
		default:
			break;
	}

	const type = bodyType ?? paramType;

	if (!type) {
		return c.json(
			{
				message: "Missing 'type' in request body",
				hint: "Add the 'type' field to your request body and set it to the type of moderation you want to perform.",
				docs: "https://kayle.ai/docs",
			},
			400,
		);
	}

	c.set("type", type);

	await next();
});

moderate.all("/:type?", async (c) => {
	const type = c.get("type") ?? "";

	switch (type) {
		case "text":
			return await moderateTextRoute(c);
		case "audio":
			return await moderateAudioRoute(c);
		default:
			return c.json(
				{
					message: "Invalid moderation type",
				},
				400,
			);
	}
});
