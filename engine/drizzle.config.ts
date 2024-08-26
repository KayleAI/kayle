import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./db/drizzle/schema.ts",
	out: "./db/drizzle",
	dbCredentials: {
		// Directly connect to the local Supabase instance as
		// this should be identical to the production database.
		url: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
	},
});
