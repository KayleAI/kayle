// OpenAI Types
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// Zod
import { z } from "zod";

export const imageModerationPrompt: ChatCompletionMessageParam = {
	role: "system",
	content:
		"You are given a description of an image and you need to determine if it violates any rules, it's severity, and any PII it contains.",
};

export const imageModerationResponseFormat = z.object({
	severity: z
		.number()
		.describe(
			"A number between 0 and 10 representing how severe the violation is. 0 means no violation, 10 means the violation is extremely severe.",
		),
	violations: z
		.array(z.string())
		.describe(
			"A list of identifiers for violations (for example, 'hate', 'self-harm', 'pii', 'profanity', and so on)",
		),
	pii: z
		.array(z.string())
		.optional()
		.describe(
			"List of any and all PII strings exactly as they appear in the text.",
		),
});
