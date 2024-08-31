// Hono
import type { Context } from "hono";
import { env } from "hono/adapter";

// Zod
import { z } from "zod";

// Moderation
import { moderateText } from "@/utils/text/moderate";

// Normalisation
import { normaliseText } from "@/utils/text/normalise";

// Vector
import { createVector } from "@/utils/text/create";
import { search } from "@/utils/text/search";
import { hashText } from "@/utils/text/hash";

const textModerationRequestSchema = z.object({
	text: z.string(),
	user: z.string().optional(),
});

export async function moderateTextRoute(c: Context) {
	const body = await c.req.json();

	const parsed = textModerationRequestSchema.safeParse(body);
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

	const {
		AI_API_KEY,
		AI_BASE_URL,
		AI_MODEL = "gpt-4o-2024-08-06",
		HYPERDRIVE,
		EMBEDDING_MODEL = "text-embedding-3-large",
	} = env<{
		AI_API_KEY: string;
		AI_BASE_URL: string;
		AI_MODEL?: string;
		HYPERDRIVE: Hyperdrive;
		EMBEDDING_MODEL?: string;
	}>(c);

	const { text } = parsed.data;

	try {
		const textToModerate = normaliseText(text);

		const vector = await createVector({
			AI_API_KEY,
			AI_BASE_URL,
			EMBEDDING_MODEL,
			text: textToModerate,
		});

		const hash = await hashText(textToModerate);

		const searchResult = await search({
			hyperdrive: HYPERDRIVE,
			vector,
			hash,
		});

		if (searchResult) {
			return c.json({
				message: "Content has been flagged.",
			});
		}

		const { data, error } = await moderateText({
			AI_API_KEY,
			AI_BASE_URL,
			AI_MODEL,
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

			console.debug(`Redacted text: ${redactedText}`);
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
}
