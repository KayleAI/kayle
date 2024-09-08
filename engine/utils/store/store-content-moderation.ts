// DB
import { connect } from "@/db/connect";

// Store
import { storeContent } from "@/utils/store/store-content";
import { storeModeration } from "@/utils/store/store-moderation";

// Security
import { encrypt } from "@/utils/security/encrypt";

// Types
import type { ModerationResult, ModerationType } from "@repo/types/moderation";

/**
 * Store a moderation result for a given content
 *
 * @param env - The environment variables
 * @param type - The type of moderation
 * @param content - Either the text (not encrypted) or the objectId
 * @param hash - The hash of the content
 * @param vector - The vector of the content
 * @param result - The result of the moderation
 * @returns The moderation ID
 */
export async function storeContentModeration({
	env,
	type,
	content,
	hash,
	vector,
	result,
}: {
	env: {
		HYPERDRIVE: Hyperdrive;
		ENCRYPTION_KEY: string;
	};
	type: ModerationType;
	content: string;
	hash: string;
	vector: number[];
	result: ModerationResult;
}): Promise<string> {
	const db = await connect(env);

	const contentId = await storeContent({
		db,
		type,
		...(type === "text"
			? { encryptedText: await encrypt(content, env.ENCRYPTION_KEY) }
			: { objectId: content }),
	});

	const moderation = await storeModeration({
		db,
		hash,
		vector,
		result,
		contentId,
	});

	return moderation?.id;
}
