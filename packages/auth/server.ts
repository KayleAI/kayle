"server-only";

// Better Auth
import { betterAuth, type Auth } from "better-auth";
import { organization } from "better-auth/plugins";
import { admin } from "better-auth/plugins";

// Database
import { db } from "@repo/db/connect";

// Environment Check
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

export const auth: Auth = betterAuth({
	// Database
	database: {
		db,
		type: "postgres",
	},

	// Schema (Snake case is preferred for the database)
	user: {
		modelName: "user",
		fields: {
			emailVerified: "email_verified",
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	},
	session: {
		modelName: "session",
		fields: {
			expiresAt: "expires_at",
			ipAddress: "ip_address",
			userAgent: "user_agent",
			userId: "user_id",
		},
		expiresIn: 60 * 60 * 24 * 30, // 30 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	account: {
		modelName: "account",
		fields: {
			accountId: "account_id",
			providerId: "provider_id",
			userId: "user_id",
			accessToken: "access_token",
			refreshToken: "refresh_token",
			idToken: "id_token",
			expiresAt: "expires_at",
		},
	},
	verification: {
		modelName: "verification",
		fields: {
			expiresAt: "expires_at",
		},
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
			defaultBanReason: "You are no longer permitted to access Kayle.",
			defaultBanExpiresIn: undefined, // No expiration
		}),
		organization({
			creatorRole: "admin",
			organizationLimit: 1,
			allowUserToCreateOrganization: true,
		}),
	],
});
