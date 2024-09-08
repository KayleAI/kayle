// DB
import { connect } from "@/db/connect";
import { moderations } from "@/db/drizzle/schema";
import { cosineDistance, desc, eq, gt, sql } from "drizzle-orm";

// Types
import type { ModerationResult } from "@repo/types/moderation";
import type { SearchResult } from "@repo/types/search";

export async function searchVector({
	env,
	vector,
}: {
	env: {
		HYPERDRIVE: Hyperdrive;
		VECTOR_SIMILARITY_THRESHOLD?: number;
	};
	vector: number[];
}): Promise<SearchResult | undefined> {
	const db = await connect(env);

	const similarity = sql<number>`1 - (${cosineDistance(moderations.vector, vector)})`;

	const result = await db
		.select({
			id: moderations.id,
			contentId: moderations.contentId,
			result: moderations.result,
			similarity,
		})
		.from(moderations)
		.where(gt(similarity, env?.VECTOR_SIMILARITY_THRESHOLD ?? 0.9))
		.orderBy((t) => desc(t.similarity))
		.limit(1);

	if (result.length === 0) {
		return undefined;
	}

	return {
		severity: (result[0].result as ModerationResult).severity ?? 0,
		violations: (result[0].result as ModerationResult).violations ?? [],
		pii: (result[0].result as ModerationResult).pii ?? [],
	};
}

export async function searchHash({
	env,
	hash,
}: {
	hash: string;
	env: {
		HYPERDRIVE: Hyperdrive;
	};
}): Promise<SearchResult | undefined> {
	const db = await connect(env);

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
	};
}
