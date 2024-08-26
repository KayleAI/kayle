// OpenAI
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

// Prompt & Response Format
import {
	textModerationPrompt,
	textModerationResponseFormat,
} from "@/prompts/text-moderation-prompt";

/**
 * Moderate a piece of given text
 *
 * @param AI_API_KEY - OpenAI API key (or alternative)
 * @param AI_BASE_URL - OpenAI base URL (or alternative)
 * @param text - Text to moderate
 * @returns Moderation result
 */
export async function moderateText({
	AI_API_KEY,
	AI_BASE_URL,
	text,
}: {
	AI_API_KEY: string;
	AI_BASE_URL: string;
	text: string;
}) {
	const ai = new OpenAI({
		apiKey: AI_API_KEY,
		baseURL: AI_BASE_URL,
	});

	try {
		const moderation = await ai.chat.completions.create({
			model: "gpt-4o-2024-08-06",
			messages: [
				textModerationPrompt,
				{
					role: "user",
					content: text,
				},
			],
			response_format: zodResponseFormat(
				textModerationResponseFormat,
				"text_moderation",
			),
		});

		if (!moderation.choices[0].message.content) {
			console.error("[ERROR] Failed to moderate text: No content");
			return {
				data: null,
				error: "Failed to moderate text: No content",
			};
		}

		const parsed = textModerationResponseFormat.safeParse(
			JSON.parse(moderation.choices[0].message.content),
		);

		if (!parsed.success) {
			console.error(`[ERROR] Failed to moderate text: ${parsed.error}`);
			return {
				data: null,
				error: "Failed to moderate text: Invalid response format",
			};
		}

		return {
			data: parsed.data,
			error: null,
		};
	} catch (error) {
		console.error(`[ERROR] Failed to moderate text: ${error}`);
		return {
			data: null,
			error: "Failed to moderate text: Internal server error",
		};
	}
}
