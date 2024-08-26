// Hono
import { Hono, type Context } from "hono";
import { env } from "hono/adapter";
import { validator } from "hono/validator";

// Zod
import { z } from "zod";

// Moderation
import { moderateText } from "@/utils/text/moderate";

export const textModeration = new Hono<{
	Bindings: CloudflareBindings;
}>();

const textModerationRequestSchema = z.object({
	text: z.string(),
	user: z.string().optional(),
});

textModeration.post(
	"/",
	validator("json", (value, c) => {
		const parsed = textModerationRequestSchema.safeParse(value);
		if (!parsed.success) {
			return c.json(
				{
					message: `${parsed.error.issues[0].message} for '${parsed.error.issues[0].path[0]}'`,
					hint: "Resolve the issue and try again.",
					docs: "https://docs.kayle.ai",
				},
				400,
			);
		}
		return parsed.data;
	}),
	async (c: Context) => {
		const { AI_API_KEY, AI_BASE_URL } = env<{
			AI_API_KEY: string;
			AI_BASE_URL: string;
		}>(c);

		const { text } = await c.req.json();

		try {
			const { data, error } = await moderateText({
				AI_API_KEY,
				AI_BASE_URL,
				text,
			});

			if (error) {
				throw new Error(error);
			}

			if (!data) {
				throw new Error("Failed to moderate text: No data");
			}

			const { severity, violations, pii } = data;

			if (pii && pii.length > 0) {
				// Escape any special characters in the PII strings for use in a regular expression
				const escapedPii = pii.map((str) =>
					str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
				);

				// Create a single regular expression to match any of the PII strings
				const regex = new RegExp(escapedPii.join("|"), "g");

				// Replace all occurrences of PII with "[REDACTED]"
				const redactedText = text.replace(regex, "[REDACTED]");

				console.log(`Redacted text: ${redactedText}`);
			}

			return c.json({ severity, violations });
		} catch (error) {
			console.error(`[ERROR]: ${error}`);
			return c.json(
				{
					message:
						"We were unable to moderate this content. This is likely an issue on our end.",
					hint: "Please try again or contact support.",
					docs: "https://docs.kayle.ai",
				},
				500,
			);
		}
	},
);
