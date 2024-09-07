/// Serving the API on a server instead of Cloudflare Workers

// Hono
import { Hono } from "hono";

// Hono Node Server
import { serve } from "@hono/node-server";

// v1
import { v1 } from "./v1";

const app = new Hono<{
	Bindings: CloudflareBindings;
}>();

app.notFound((c) => {
	return c.json(
		{
			message: "This endpoint doesn’t exist.",
			hint: "Check the URL and try again.",
			docs: "https://kayle.ai/docs",
		},
		404,
	);
});

app.onError((err, c) => {
	console.error(`[ERROR]: ${err.message}`);
	return c.json(
		{
			message: "An error occurred while processing your request.",
			hint: "This is likely an issue on our end—we’re looking into it.",
			docs: "https://kayle.ai/docs",
		},
		500,
	);
});

app.route("/v1", v1);

app.get("/", (c) => {
	return c.json({
		message: "Kayle’s API is working!",
		hint: "Check the status here -> https://status.kayle.ai",
		docs: "https://kayle.ai/docs",
	});
});

serve({
	fetch: app.fetch,
	port: 8787,
});
