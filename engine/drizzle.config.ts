import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
	path: ".env.local", // Path to .env file
	override: true, // Override existing environment variables
});

export default defineConfig({
	dialect: "postgresql",
	schema: "./db/drizzle/schema.ts",
	out: "./db/drizzle",
	dbCredentials: {
		// Directly connect to the local Supabase instance as
		// this should be identical to the production database.
		url: process.env.DATABASE_URL ?? "",
	},
	schemaFilter: ["public", "storage", "auth"],
});
