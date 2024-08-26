// Hono
import { Hono } from "hono";

// Moderation Endpoints
import { audioModeration } from "./audio";
import { textModeration } from "./text";

export const moderate = new Hono<{
	Bindings: CloudflareBindings;
}>();

moderate.get("/", (c) => {
	return c.json({
		message: "Hello from Kayle's Moderation API!",
		hint: "Check the docs to learn more about how to use this endpoint.",
		docs: "https://docs.kayle.ai",
	});
});

moderate.route("/text", textModeration);

moderate.route("/audio", audioModeration);
