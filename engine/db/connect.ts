import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export async function connect(env: {
	HYPERDRIVE: Hyperdrive;
}) {
	const client = new Client({
		connectionString: env.HYPERDRIVE.connectionString,
	});

	await client.connect();

	return drizzle(client);

	// TODO: Some kind of cleanup function for the client.
}
