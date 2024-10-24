"server-only";

// Better Auth
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { admin } from "better-auth/plugins";

// Database
import { db } from "@repo/db/connect";

// Environment Check
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

export const auth = betterAuth({
	// Database
	database: {
		db,
		type: "postgres",
	},

	// Auth Config
	emailAndPassword: {
		enabled: true,
	},

	// Plugins
	plugins: [
		admin({
			impersonationSessionDuration: 60 * 60, // 1 hour
			defaultRole: "member",
		}),
		organization({
			creatorRole: "admin",
			organizationLimit: 1,
			allowUserToCreateOrganization: true,
		}),
	],
});
