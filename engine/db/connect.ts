import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export async function connect(HYPERDRIVE: Hyperdrive) {
	const client = new Client({ connectionString: HYPERDRIVE.connectionString });

	await client.connect();

	return drizzle(client);

	// TODO: Some kind of cleanup function for the client.
}
