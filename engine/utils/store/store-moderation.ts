// DB
import { moderations } from "@/db/drizzle/schema";

// Types
import type { ModerationResult } from "@/types/moderation";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export async function storeModeration({
	db,
	vector,
	hash,
	result,
}: {
	db: NodePgDatabase<Record<string, never>>;
	vector: number[];
	hash: string;
	result: ModerationResult;
}): Promise<string | undefined> {
	const moderation = await db
		.insert(moderations)
		.values({
			vector,
			hash,
			result,
		})
		.returning({
			contentId: moderations.contentId,
		});

	return moderation?.[0]?.contentId;
}
