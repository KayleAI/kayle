// DB
import { connect } from "@/db/connect";
import { moderations } from "@/db/drizzle/schema";
import { cosineDistance, desc, eq, gt, sql } from "drizzle-orm";

// Types
import type { ModerationResult } from "@/types/moderation";

export interface SearchResult {
	severity: number;
	violations: string[];
	pii: string[];
	similarity: number;
}

export async function searchVector({
	hyperdrive,
	vector,
}: {
	hyperdrive: Hyperdrive;
	vector: number[];
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
		.where(gt(similarity, 0.9)) // FIXME: We should probably use a higher threshold here or at least make it configurable
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

export async function searchHash({
	hyperdrive,
	hash,
}: {
	hyperdrive: Hyperdrive;
	hash: string;
}): Promise<undefined | SearchResult> {
	const db = await connect(hyperdrive);

	const result = await db
		.select({
			id: moderations.id,
			contentId: moderations.contentId,
			result: moderations.result,
		})
		.from(moderations)
		.where(eq(moderations.hash, hash))
		.limit(1);

	if (result.length === 0) {
		return undefined;
	}

	return {
		severity: (result[0].result as ModerationResult).severity ?? 0,
		violations: (result[0].result as ModerationResult).violations ?? [],
		pii: (result[0].result as ModerationResult).pii ?? [],
		similarity: 1,
	};
}
