// DB
import { connect } from "@/db/connect";

// Types
import type { ModerationResult } from "@/types/moderation";
import { storeModeration } from "./store-moderation";
import { encrypt } from "../security/encrypt";
import { storeTextContent } from "./store-text-content";

export async function storeTextModeration({
	hyperdrive,
	vector,
	hash,
	result,
	text,
	ENCRYPTION_KEY,
}: {
	hyperdrive: Hyperdrive;
	vector: number[];
	hash: string;
	result: ModerationResult;
	text: string;
	ENCRYPTION_KEY: string;
}) {
	const db = await connect(hyperdrive);

	const contentId = await storeModeration({
		db,
		vector,
		hash,
		result,
	});

	if (!contentId) {
		throw new Error("Failed to store moderation");
	}

	// now we store the encrypted content into `content`
	const encryptedText = await encrypt(text, ENCRYPTION_KEY);

	await storeTextContent({
		db,
		contentId,
		content: encryptedText,
	});

	return;
}
