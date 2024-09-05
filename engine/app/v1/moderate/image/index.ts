// Hono
import type { Context } from "hono";
import { env as getEnv } from "hono/adapter";

// Zod
import { z } from "zod";

// Moderation
import { moderateImage } from "@/utils/moderate/image";

// DB
import { connect } from "@/db/connect";
import { createClient } from "@/db/supabase";

// Store
import { storeContent } from "@/utils/store/store-content";
import { storeModeration } from "@/utils/store/store-moderation";

// Utils
import { searchHash } from "@/utils/search";
import { hashAnyFile } from "@/utils/conversion/hash-any-file";
import { downloadFromUrl } from "@/utils/download/download-from-url";

const imageModerationRequestSchema = z.object({
	image_url: z.string(),
});

export async function moderateImageRoute(c: Context) {
	const body = await c.req.json();

	const parsed = imageModerationRequestSchema.safeParse(body);
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

	const { image_url } = body;

	let image_file: File;

	try {
		image_file = await downloadFromUrl(image_url, 20, "image");
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
		const imageHash = await hashAnyFile(image_file);

		const hashResult = await searchHash({
			env,
			hash: imageHash,
		});

		if (hashResult) {
			return c.json({
				data: hashResult,
				error: null,
			});
		}

		const supabase = createClient(env);

		const filename = `${imageHash}.${image_file.type.split("/")[1]}`;

		// since we don't have the file in our database, we are going to upload it
		const { data, error } = await supabase.storage
			.from("files")
			.upload(filename, image_file, {
				cacheControl: "3600",
				contentType: image_file.type,
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
			type: "image",
			objectId,
		});

		const { data: signedUrlData, error: signedUrlError } =
			await supabase.storage.from("files").createSignedUrl(filename, 60);

		if (signedUrlError) {
			console.error(signedUrlError);
			throw new Error("Failed to create signed URL");
		}

		if (!signedUrlData) {
			console.error(signedUrlData);
			throw new Error("Failed to create signed URL - no data");
		}

		const moderation = await moderateImage({
			env,
			imageUrl: signedUrlData?.signedUrl?.startsWith("https")
				? signedUrlData.signedUrl
				: `data:image/jpeg;base64,${Buffer.from(
						await image_file.arrayBuffer(),
					).toString("base64")}`,
		});

		if (!moderation?.data) {
			throw new Error("Failed to moderate image");
		}

		await storeModeration({
			db,
			hash: imageHash,
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
