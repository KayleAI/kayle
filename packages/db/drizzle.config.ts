// Environment
import dotenv from "dotenv";

// Types
import type { Config } from "drizzle-kit";

dotenv.config();

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

// get file path
const filePath = "packages/db";

export default {
	out: `${filePath}/migrations`,
	schema: `${filePath}/drizzle.ts`,
	dialect: "postgresql",
	introspect: {
		casing: "preserve",
	},
	casing: "snake_case",
	dbCredentials: {
		url: process.env.DATABASE_URL,
		connectionString: process.env.DATABASE_URL,
	},
} as Config;
