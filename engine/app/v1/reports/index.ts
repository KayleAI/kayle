// Hono
import { Hono } from "hono";

// Reporting Endpoints
import { submitReport } from "./submit";

export const reports = new Hono<{
	Bindings: CloudflareBindings;
}>();

reports.get("/", (c) => {
	return c.json({
		message: "Hello from Kayle's Reports API!",
		hint: "Check the docs to learn more about how to use this endpoint.",
		docs: "https://kayle.ai/docs",
	});
});

reports.route("/submit", submitReport);
