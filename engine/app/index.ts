// Hono
import { Hono } from "hono";

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
			docs: "https://docs.kayle.ai",
		},
		404,
	);
});

app.onError((err, c) => {
	console.error(`Error: ${err.message}`);
	return c.json(
		{
			message: "An error occurred while processing your request.",
			hint: "This is likely an issue on our end—we’re looking into it.",
			docs: "https://docs.kayle.ai",
		},
		500,
	);
});

app.route("/v1", v1);

app.get("/", (c) => {
	return c.json({
		message: "Kayle’s API is working!",
		hint: "Check the status here -> https://status.kayle.ai",
		docs: "https://docs.kayle.ai",
	});
});

export default app;
