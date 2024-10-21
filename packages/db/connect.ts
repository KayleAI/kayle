"server-only";

// Kysely
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

// Environment
import dotenv from "dotenv";

// Database Types
import type { DB } from "kysely-codegen";

dotenv.config();

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: process.env.DATABASE_URL,
	}),
});

export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process.env.DATABASE_URL,
		}),
	}),
});
