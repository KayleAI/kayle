// Hono
import type { Context } from "hono";
import { env as getEnv } from "hono/adapter";

// Zod
import { z } from "zod";

// Moderation
import { moderateText } from "@/utils/text/moderate";

// Normalisation
import { normaliseText } from "@/utils/text/normalise";

// Vector
import { createVector } from "@/utils/text/create";

// Search
import { searchVector, searchHash } from "@/utils/search";

// Hash
import { hashText } from "@/utils/text/hash";

// Store
import { storeContentModeration } from "@/utils/store/store-content-moderation";

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
				docs: "https://kayle.ai/docs",
			},
			400,
		);
	}

	const env = getEnv<{
		AI_API_KEY: string;
		AI_BASE_URL: string;
		AI_MODEL?: string;
		HYPERDRIVE: Hyperdrive;
		ENCRYPTION_KEY: string;
		EMBEDDING_MODEL?: string;
		VECTOR_SIMILARITY_THRESHOLD?: number;
	}>(c);

	const { text } = parsed.data;

	try {
		const textToModerate = normaliseText(text);

		const hash = await hashText(textToModerate);

		const [hashSearchResult, vector] = await Promise.all([
			searchHash({
				hash,
				env,
			}),
			createVector({
				text: textToModerate,
				env,
			}),
		]);

		if (hashSearchResult) {
			return c.json({
				data: hashSearchResult,
				error: null,
			});
		}

		const vectorSearchResult = await searchVector({
			env,
			vector,
		});

		if (vectorSearchResult) {
			return c.json({
				data: vectorSearchResult,
				error: null,
			});
		}

		const { data, error } = await moderateText({
			env,
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
			storeContentModeration({
				env,
				vector,
				hash,
				result,
				type: "text",
				content: textToModerate,
			}),
		);

		return c.json({
			data: result,
			error: null,
		});
	} catch (error) {
		console.error(`[ERROR]: ${error}`);
		return c.json(
			{
				message:
					"We were unable to moderate this content. This is likely an issue on our end.",
				hint: "Please try again or contact support.",
				docs: "https://kayle.ai/docs",
			},
			500,
		);
	}
}
