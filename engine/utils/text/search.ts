// DB
import { connect } from "@/db/connect";
import { moderations } from "@/db/drizzle/schema";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";

// Types
import type { ModerationResult } from "@/types/moderation";

export interface SearchResult {
	severity: number;
	violations: string[];
	pii: string[];
	similarity: number;
}

export async function search({
	hyperdrive,
	vector,
	hash,
}: {
	hyperdrive: Hyperdrive;
	vector: number[];
	hash: string;
}): Promise<undefined | SearchResult> {
	const db = await connect(hyperdrive);

	const similarity = sql<number>`1 - (${cosineDistance(moderations.vector, vector)})`;

	const result = await db
		.select({
			id: moderations.id,
			contentId: moderations.contentId,
			result: moderations.result,
			similarity,
		})
		.from(moderations)
		.where(gt(similarity, 0.5))
		.orderBy((t) => desc(t.similarity))
		.limit(1);

	if (result.length === 0) {
		return undefined;
	}

	return {
		severity: (result[0].result as ModerationResult).severity ?? 0,
		violations: (result[0].result as ModerationResult).violations ?? [],
		pii: (result[0].result as ModerationResult).pii ?? [],
		similarity: result[0].similarity,
	};
}
