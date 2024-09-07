// DB
import { content as contentTable } from "@/db/drizzle/schema";
import type { ModerationType } from "@/types/moderation";

// Types
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export async function storeContent({
	db,
	type,
	contentId = undefined,
	...props
}: {
	db: NodePgDatabase<Record<string, never>>;
	type: ModerationType;
	contentId?: string;
} & (
	| { objectId: string; encryptedText?: never }
	| { objectId?: never; encryptedText: string }
)): Promise<string> {
	const contentResult = await db
		.insert(contentTable)
		.values({
			id: contentId ?? undefined,
			encryptedText: props?.encryptedText ?? null,
			objectId: props?.objectId ?? null,
			type,
		})
		.returning({
			id: contentTable.id,
		});

	return contentResult?.[0]?.id;
}
