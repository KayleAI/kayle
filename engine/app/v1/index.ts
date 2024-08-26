// Hono
import { Hono } from "hono";

// Unkey
import { type UnkeyContext, unkey } from "@unkey/hono";

// Moderation Endpoint
import { moderate } from "./moderate";

export const v1 = new Hono<{
	Bindings: CloudflareBindings;
	Variables: { unkey: UnkeyContext };
}>();

v1.use(
	"*",
	unkey({
		apiId: "api_Q3Er9nRPV3Hf9g52ytcMQkSgi4P",
		getKey(c) {
			// Authorization: Bearer <key>
			return c.req.header("Authorization")?.replace("Bearer ", "");
		},
		handleInvalidKey(c, result) {
			console.warn(`Invalid API key: ${result?.keyId ?? "unknown key"}`);
			return c.json(
				{
					message: "You are not authorised to access this resource.",
					hint: "Check your API key or contact support.",
					docs: "https://docs.kayle.ai",
				},
				401,
			);
		},
		onError(c, error) {
			console.error(`Authentication Error: ${error.message}`);
			return c.json(
				{
					message: "An error occurred while authenticating your request.",
					hint: "We’re looking into it.",
					status: "https://status.kayle.ai",
				},
				500,
			);
		},
	}),
);

v1.get("/", (c) => {
	return c.json({
		message: "Hello from Kayle v1!",
	});
});

v1.route("/moderate", moderate);
