// OpenAI Types
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// Zod
import { z } from "zod";

// Config
import { violations } from "@/config/violations";

export const textModerationPrompt: ChatCompletionMessageParam = {
	role: "system",
	content:
		"You are a text moderation system. You are given a text and you need to determine if it is safe to use.",
};

export const textModerationResponseFormat = z.object({
	severity: z
		.number()
		.describe(
			"A number between 0 and 10 representing how severe the violation is. 0 means no violation, 10 means the violation is extremely severe.",
		),
	violations: z
		.array(z.enum(violations as [string, ...string[]]))
		.describe("A list of identifiers for violations."),
	pii: z
		.array(z.string())
		.optional()
		.describe(
			"List of any and all PII strings exactly as they appear in the text.",
		),
});
