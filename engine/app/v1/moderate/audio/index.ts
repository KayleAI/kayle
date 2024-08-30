// Hono
import { Hono, type Context } from "hono";
import { env } from "hono/adapter";

// Zod
import { z } from "zod";

// Moderation
import { moderateText } from "@/utils/text/moderate";

// Utils
import { convertAudioToText } from "@/utils/conversion/convert-audio-to-text";
import { downloadAudioFromUrl } from "@/utils/download/download-audio-from-url";

export const audioModeration = new Hono<{
	Bindings: CloudflareBindings;
}>();

const audioModerationRequestSchema = z.object({
	audio_url: z.string(),
});

export async function moderateAudioRoute(c: Context) {
	const body = await c.req.json();

	const parsed = audioModerationRequestSchema.safeParse(body);
	if (!parsed.success) {
		return c.json(
			{
				message: "Invalid JSON in request body",
				hint: "Make sure to send a valid JSON object.",
				docs: "https://docs.kayle.ai",
			},
			400,
		);
	}

	const { AI_API_KEY, AI_BASE_URL, GROQ_API_KEY } = env<{
		AI_API_KEY: string;
		AI_BASE_URL: string;
		GROQ_API_KEY: string;
	}>(c);

	const { audio_url } = body;

	let audio_file: File;

	try {
		audio_file = await downloadAudioFromUrl(audio_url);
	} catch (error) {
		console.error(`[ERROR]: ${error}`);
		return c.json(
			{
				message: "Failed to download audio from URL",
				hint: "Make sure the URL is valid and points to an audio file.",
				docs: "https://docs.kayle.ai",
			},
			400,
		);
	}

	try {
		const text = await convertAudioToText(GROQ_API_KEY, audio_file);

		const moderation = await moderateText({ AI_API_KEY, AI_BASE_URL, text });

		return c.json(moderation);
	} catch (error) {
		console.error(`[ERROR]: ${error}`);
		return c.json(
			{
				message:
					"We were unable to moderate this content. This is likely an issue on our end.",
				hint: "Please try again later or contact support.",
				docs: "https://docs.kayle.ai",
			},
			500,
		);
	}
}
