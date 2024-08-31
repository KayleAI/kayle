// DB
import { content as contentTable } from "@/db/drizzle/schema";

// Types
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export async function storeTextContent({
	db,
	contentId,
	content,
}: {
	db: NodePgDatabase<Record<string, never>>;
	contentId: string;
	content: string;
}): Promise<void> {
	await db.insert(contentTable).values({
		id: contentId,
		encryptedText: content,
		type: "text",
	});

	return;
}
