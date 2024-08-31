import { connect } from "@/db/connect";

export interface SearchResult {
	severity: number;
	violations: string[];
	pii: string[];
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

	// select from the vector table the closest vector to the input vector
	// use the cosine similarity metric
	// or find a completely matching hash

	

	return undefined;
}
