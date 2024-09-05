// Hono
import type { Context } from "hono";
import { env as getEnv } from "hono/adapter";

// Zod
import { z } from "zod";

// Moderation
import { moderateText } from "@/utils/moderate/text";

// DB
import { connect } from "@/db/connect";
import { createClient } from "@/db/supabase";

// Store
import { storeContent } from "@/utils/store/store-content";
import { storeModeration } from "@/utils/store/store-moderation";

// Utils
import { searchHash } from "@/utils/search";
import { hashAnyFile } from "@/utils/conversion/hash-any-file";
import { convertAudioToText } from "@/utils/conversion/convert-audio-to-text";
import { downloadFromUrl } from "@/utils/download/download-from-url";

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
				docs: "https://kayle.ai/docs",
			},
			400,
		);
	}

	const env = getEnv<{
		HYPERDRIVE: Hyperdrive;
		AI_API_KEY: string;
		AI_BASE_URL: string;
		GROQ_API_KEY: string;
		SUPABASE_URL: string;
		SUPABASE_SERVICE_ROLE_KEY: string;
	}>(c);

	const db = await connect(env);

	const { audio_url } = body;

	let audio_file: File;

	try {
		audio_file = await downloadFromUrl(audio_url, 25, "audio");
	} catch (error) {
		console.error(`[ERROR]: ${error}`);
		return c.json(
			{
				message: "Failed to download audio from URL",
				hint: "Make sure the URL is valid and points to an audio file.",
				docs: "https://kayle.ai/docs",
			},
			400,
		);
	}

	try {
		const audioHash = await hashAnyFile(audio_file);

		const hashResult = await searchHash({
			env,
			hash: audioHash,
		});

		if (hashResult) {
			return c.json({
				data: hashResult,
				error: null,
			});
		}

		const supabase = createClient(env);

		// since we don't have the file in our database, we are going to upload it
		const { data, error } = await supabase.storage
			.from("files")
			.upload(`${audioHash}.${audio_file.type.split("/")[1]}`, audio_file, {
				cacheControl: "3600",
				contentType: audio_file.type,
				upsert: false,
			});

		if (error) {
			console.error(error);
			throw new Error("Failed to upload audio to Supabase");
		}

		const objectId = data?.id;

		if (!objectId) {
			console.error(data);
			throw new Error("Failed to upload audio to Supabase - no object ID");
		}

		// store the content in the database
		const contentId = await storeContent({
			db,
			type: "audio",
			objectId,
		});

		const text = await convertAudioToText(env?.GROQ_API_KEY, audio_file);

		// TODO: After this point, we need to give the text back to the
		// /text endpoint instead of potentially wasting resources here

		const moderation = await moderateText({
			env,
			text,
		});

		if (!moderation?.data) {
			throw new Error("Failed to moderate text");
		}

		await storeModeration({
			db,
			hash: audioHash,
			result: moderation.data,
			contentId,
		});

		return c.json({
			data: moderation.data,
			error: moderation.error,
		});
	} catch (error) {
		console.error(`[ERROR]: ${error}`);
		return c.json(
			{
				message:
					"We were unable to moderate this content. This is likely an issue on our end.",
				hint: "Please try again later or contact support.",
				docs: "https://kayle.ai/docs",
			},
			500,
		);
	}
}
