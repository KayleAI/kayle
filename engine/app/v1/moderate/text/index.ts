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

// Search
import { searchVector, searchHash } from "@/utils/text/search";

// Hash
import { hashText } from "@/utils/text/hash";

// Store
import { storeTextModeration } from "@/utils/store/store-text-moderation";

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
		ENCRYPTION_KEY,
	} = env<{
		AI_API_KEY: string;
		AI_BASE_URL: string;
		AI_MODEL?: string;
		HYPERDRIVE: Hyperdrive;
		EMBEDDING_MODEL?: string;
		ENCRYPTION_KEY: string;
	}>(c);

	const { text } = parsed.data;

	try {
		const textToModerate = normaliseText(text);

		const hash = await hashText(textToModerate);

		const [hashSearchResult, vector] = await Promise.all([
			searchHash({
				hyperdrive: HYPERDRIVE,
				hash,
			}),
			createVector({
				AI_API_KEY,
				AI_BASE_URL,
				EMBEDDING_MODEL,
				text: textToModerate,
			}),
		]);

		if (hashSearchResult) {
			return c.json({
				severity: hashSearchResult.severity,
				violations: hashSearchResult.violations,
			});
		}

		const vectorSearchResult = await searchVector({
			hyperdrive: HYPERDRIVE,
			vector,
		});

		if (vectorSearchResult) {
			return c.json({
				severity: vectorSearchResult.severity,
				violations: vectorSearchResult.violations,
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

			console.debug(`[DEBUG]: Redacted text: ${redactedText}`);
		}

		const result = {
			severity,
			violations,
			pii,
		};

		c.executionCtx.waitUntil(
			storeTextModeration({
				hyperdrive: HYPERDRIVE,
				vector,
				hash,
				result,
				text: textToModerate,
				ENCRYPTION_KEY,
			}),
		);

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
