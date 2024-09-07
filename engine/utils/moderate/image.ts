// Groq
import { Groq } from "groq-sdk";

// OpenAI
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

// Prompt & Response Format
import {
	imageModerationPrompt,
	imageModerationResponseFormat,
} from "@/prompts/image-moderation-prompt";

/**
 * Moderate an image.
 *
 * @param GROQ_API_KEY - Groq API key
 * @param AI_API_KEY - OpenAI API key (or alternative)
 * @param AI_BASE_URL - OpenAI base URL (or alternative)
 * @param AI_MODEL - OpenAI model (or alternative)
 * @param imageUrl - Image to moderate (from Supabase)
 * @returns Moderation result
 */
export async function moderateImage({
	env,
	imageUrl,
}: {
	env: {
		GROQ_API_KEY: string;
		AI_API_KEY: string;
		AI_BASE_URL: string;
		AI_MODEL?: string;
	};
	imageUrl: string;
}) {
	const groq = new Groq({ apiKey: env.GROQ_API_KEY });
	const ai = new OpenAI({
		apiKey: env?.AI_API_KEY,
		baseURL: env?.AI_BASE_URL ?? "https://api.openai.com/v1",
	});

	try {
		const imageDescription = await groq.chat.completions.create({
			model: "llava-v1.5-7b-4096-preview",
			messages: [
				{
					role: "user",
					content: [
						{
							type: "text",
							text: "Describe the image in detail including the objects, people, background, and any other details.",
						},
						{
							type: "image_url",
							image_url: {
								url: imageUrl,
							},
						},
					],
				},
			],
		});

		const imageDescriptionResult = imageDescription?.choices[0].message.content;

		if (!imageDescriptionResult) {
			console.error("[ERROR]: Failed to moderate image: No content");
			return {
				data: null,
				error: "Failed to moderate image: No content",
			};
		}

		const moderation = await ai.chat.completions.create({
			model: env.AI_MODEL ?? "gpt-4o-2024-08-06",
			messages: [
				imageModerationPrompt,
				{
					role: "user",
					content: imageDescriptionResult,
				},
			],
			response_format: zodResponseFormat(
				imageModerationResponseFormat,
				"image_moderation",
			),
		});

		if (!moderation.choices[0].message.content) {
			console.error("[ERROR]: Failed to moderate text: No content");
			return {
				data: null,
				error: "Failed to moderate text: No content",
			};
		}

		const parsed = imageModerationResponseFormat.safeParse(
			JSON.parse(moderation.choices[0].message.content),
		);

		if (!parsed.success) {
			console.error(`[ERROR]: Failed to moderate image: ${parsed.error}`);
			return {
				data: null,
				error: "Failed to moderate image: Invalid response format",
			};
		}

		return {
			data: parsed.data,
			error: null,
		};
	} catch (error) {
		console.error(`[ERROR]: Failed to moderate image: ${error}`);
		return {
			data: null,
			error: "Failed to moderate image: Internal server error",
		};
	}
}
