// DB
import { moderations } from "@/db/drizzle/schema";

// Types
import type { ModerationResult } from "@/types/moderation";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

/**
 * Store moderation in the database
 *
 * @returns Content ID
 */
export async function storeModeration({
	db,
	vector,
	hash,
	result,
	contentId = undefined,
}: {
	db: NodePgDatabase<Record<string, never>>;
	vector?: number[];
	hash: string;
	result: ModerationResult;
	contentId?: string;
}): Promise<{ id: string; contentId: string }> {
	const moderation = await db
		.insert(moderations)
		.values({
			vector,
			hash,
			result,
			contentId: contentId ?? undefined,
		})
		.returning({
			id: moderations.id,
			contentId: moderations.contentId,
		});

	return {
		id: moderation?.[0]?.id,
		contentId: moderation?.[0]?.contentId,
	};
}
