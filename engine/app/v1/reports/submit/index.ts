// Hono
import { Hono } from "hono";

export const submitReport = new Hono<{
	Bindings: CloudflareBindings;
}>();

submitReport.post("/", (c) => {
	return c.json(
		{
			message: "We’re working on adding this soon!",
			hint: "Check back soon!",
			docs: "https://kayle.ai/docs",
		},
		501,
	);
});
