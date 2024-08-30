// Hono
import { Hono } from "hono";

// Moderation Endpoints
import { audioModeration, moderateAudioRoute } from "./audio";
import { textModeration, moderateTextRoute } from "./text";

// Zod
import { z } from "zod";

export const moderate = new Hono<{
	Bindings: CloudflareBindings;
	Variables: {
		type: string;
	};
}>();

moderate.use("/:type?", async (c, next) => {
	const { type = "" } = c.req.param();
	c.set("type", type);

	if (type === "") {
		const { type: newType = "" } = await c.req.json();

		if (newType === "") {
			return c.json(
				{
					message: "Missing 'type' in request body",
					hint: "Add the 'type' field to your request body and set it to the type of moderation you want to perform.",
					docs: "https://docs.kayle.ai",
				},
				400,
			);
		}

		c.set("type", newType);
	}

	await next();
});

moderate.get("/", (c) => {
	return c.json({
		message: "Hello from Kayle's Moderation API!",
		hint: "Check the docs to learn more about how to use this endpoint.",
		docs: "https://docs.kayle.ai",
	});
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
