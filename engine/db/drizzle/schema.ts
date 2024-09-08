import {
	pgTable,
	pgSchema,
	varchar,
	uuid,
	text,
	timestamp,
	uniqueIndex,
	index,
	unique,
	jsonb,
	boolean,
	smallint,
	json,
	foreignKey,
	bigserial,
	bigint,
	integer,
	inet,
	vector,
	pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const auth = pgSchema("auth");
export const storage = pgSchema("storage");
export const aalLevelInAuth = auth.enum("aal_level", ["aal1", "aal2", "aal3"]);
export const codeChallengeMethodInAuth = auth.enum("code_challenge_method", [
	"s256",
	"plain",
]);
export const factorStatusInAuth = auth.enum("factor_status", [
	"unverified",
	"verified",
]);
export const factorTypeInAuth = auth.enum("factor_type", [
	"totp",
	"webauthn",
	"phone",
]);
export const oneTimeTokenTypeInAuth = auth.enum("one_time_token_type", [
	"confirmation_token",
	"reauthentication_token",
	"recovery_token",
	"email_change_token_new",
	"email_change_token_current",
	"phone_change_token",
]);
export const accountStatus = pgEnum("Account Status", [
	"Active",
	"Inactive",
	"Suspended",
	"Terminated",
]);
export const contentType = pgEnum("Content Type", [
	"text",
	"audio",
	"image",
	"video",
	"document",
]);
export const organisationRole = pgEnum("Organisation Role", [
	"Owner",
	"Admin",
	"Moderator",
	"Developer",
	"Guest",
]);
export const userRole = pgEnum("User Role", ["User", "Administrator", "Owner"]);

export const schemaMigrationsInAuth = auth.table("schema_migrations", {
	version: varchar("version", { length: 255 }).primaryKey().notNull(),
});

export const instancesInAuth = auth.table("instances", {
	id: uuid("id").primaryKey().notNull(),
	uuid: uuid("uuid"),
	rawBaseConfig: text("raw_base_config"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const usersInAuth = auth.table(
	"users",
	{
		instanceId: uuid("instance_id"),
		id: uuid("id").primaryKey().notNull(),
		aud: varchar("aud", { length: 255 }),
		role: varchar("role", { length: 255 }),
		email: varchar("email", { length: 255 }),
		encryptedPassword: varchar("encrypted_password", { length: 255 }),
		emailConfirmedAt: timestamp("email_confirmed_at", {
			withTimezone: true,
			mode: "string",
		}),
		invitedAt: timestamp("invited_at", { withTimezone: true, mode: "string" }),
		confirmationToken: varchar("confirmation_token", { length: 255 }),
		confirmationSentAt: timestamp("confirmation_sent_at", {
			withTimezone: true,
			mode: "string",
		}),
		recoveryToken: varchar("recovery_token", { length: 255 }),
		recoverySentAt: timestamp("recovery_sent_at", {
			withTimezone: true,
			mode: "string",
		}),
		emailChangeTokenNew: varchar("email_change_token_new", { length: 255 }),
		emailChange: varchar("email_change", { length: 255 }),
		emailChangeSentAt: timestamp("email_change_sent_at", {
			withTimezone: true,
			mode: "string",
		}),
		lastSignInAt: timestamp("last_sign_in_at", {
			withTimezone: true,
			mode: "string",
		}),
		rawAppMetaData: jsonb("raw_app_meta_data"),
		rawUserMetaData: jsonb("raw_user_meta_data"),
		isSuperAdmin: boolean("is_super_admin"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		phone: text("phone").default(sql`NULL`),
		phoneConfirmedAt: timestamp("phone_confirmed_at", {
			withTimezone: true,
			mode: "string",
		}),
		phoneChange: text("phone_change").default(""),
		phoneChangeToken: varchar("phone_change_token", { length: 255 }).default(
			"",
		),
		phoneChangeSentAt: timestamp("phone_change_sent_at", {
			withTimezone: true,
			mode: "string",
		}),
		confirmedAt: timestamp("confirmed_at", {
			withTimezone: true,
			mode: "string",
		}).generatedAlwaysAs(sql`LEAST(email_confirmed_at, phone_confirmed_at)`),
		emailChangeTokenCurrent: varchar("email_change_token_current", {
			length: 255,
		}).default(""),
		emailChangeConfirmStatus: smallint("email_change_confirm_status").default(
			0,
		),
		bannedUntil: timestamp("banned_until", {
			withTimezone: true,
			mode: "string",
		}),
		reauthenticationToken: varchar("reauthentication_token", {
			length: 255,
		}).default(""),
		reauthenticationSentAt: timestamp("reauthentication_sent_at", {
			withTimezone: true,
			mode: "string",
		}),
		isSsoUser: boolean("is_sso_user").default(false).notNull(),
		deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
		isAnonymous: boolean("is_anonymous").default(false).notNull(),
	},
	(table) => {
		return {
			confirmationTokenIdx: uniqueIndex("confirmation_token_idx")
				.using("btree", table.confirmationToken.asc().nullsLast())
				.where(sql`((confirmation_token)::text !~ '^[0-9 ]*$'::text)`),
			emailChangeTokenCurrentIdx: uniqueIndex("email_change_token_current_idx")
				.using("btree", table.emailChangeTokenCurrent.asc().nullsLast())
				.where(sql`((email_change_token_current)::text !~ '^[0-9 ]*$'::text)`),
			emailChangeTokenNewIdx: uniqueIndex("email_change_token_new_idx")
				.using("btree", table.emailChangeTokenNew.asc().nullsLast())
				.where(sql`((email_change_token_new)::text !~ '^[0-9 ]*$'::text)`),
			reauthenticationTokenIdx: uniqueIndex("reauthentication_token_idx")
				.using("btree", table.reauthenticationToken.asc().nullsLast())
				.where(sql`((reauthentication_token)::text !~ '^[0-9 ]*$'::text)`),
			recoveryTokenIdx: uniqueIndex("recovery_token_idx")
				.using("btree", table.recoveryToken.asc().nullsLast())
				.where(sql`((recovery_token)::text !~ '^[0-9 ]*$'::text)`),
			emailPartialKey: uniqueIndex("users_email_partial_key")
				.using("btree", table.email.asc().nullsLast())
				.where(sql`(is_sso_user = false)`),
			instanceIdEmailIdx: index("users_instance_id_email_idx").using(
				"btree",
				sql`instance_id`,
				sql`null`,
			),
			instanceIdIdx: index("users_instance_id_idx").using(
				"btree",
				table.instanceId.asc().nullsLast(),
			),
			isAnonymousIdx: index("users_is_anonymous_idx").using(
				"btree",
				table.isAnonymous.asc().nullsLast(),
			),
			usersPhoneKey: unique("users_phone_key").on(table.phone),
		};
	},
);

export const auditLogEntriesInAuth = auth.table(
	"audit_log_entries",
	{
		instanceId: uuid("instance_id"),
		id: uuid("id").primaryKey().notNull(),
		payload: json("payload"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		ipAddress: varchar("ip_address", { length: 64 }).default("").notNull(),
	},
	(table) => {
		return {
			auditLogsInstanceIdIdx: index("audit_logs_instance_id_idx").using(
				"btree",
				table.instanceId.asc().nullsLast(),
			),
		};
	},
);

export const refreshTokensInAuth = auth.table(
	"refresh_tokens",
	{
		instanceId: uuid("instance_id"),
		id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
		token: varchar("token", { length: 255 }),
		userId: varchar("user_id", { length: 255 }),
		revoked: boolean("revoked"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		parent: varchar("parent", { length: 255 }),
		sessionId: uuid("session_id"),
	},
	(table) => {
		return {
			instanceIdIdx: index("refresh_tokens_instance_id_idx").using(
				"btree",
				table.instanceId.asc().nullsLast(),
			),
			instanceIdUserIdIdx: index(
				"refresh_tokens_instance_id_user_id_idx",
			).using(
				"btree",
				table.instanceId.asc().nullsLast(),
				table.userId.asc().nullsLast(),
			),
			parentIdx: index("refresh_tokens_parent_idx").using(
				"btree",
				table.parent.asc().nullsLast(),
			),
			sessionIdRevokedIdx: index("refresh_tokens_session_id_revoked_idx").using(
				"btree",
				table.sessionId.asc().nullsLast(),
				table.revoked.asc().nullsLast(),
			),
			updatedAtIdx: index("refresh_tokens_updated_at_idx").using(
				"btree",
				table.updatedAt.desc().nullsFirst(),
			),
			refreshTokensSessionIdFkey: foreignKey({
				columns: [table.sessionId],
				foreignColumns: [sessionsInAuth.id],
				name: "refresh_tokens_session_id_fkey",
			}).onDelete("cascade"),
			refreshTokensTokenUnique: unique("refresh_tokens_token_unique").on(
				table.token,
			),
		};
	},
);

export const bucketsInStorage = storage.table(
	"buckets",
	{
		id: text("id").primaryKey().notNull(),
		name: text("name").notNull(),
		owner: uuid("owner"),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		public: boolean("public").default(false),
		avifAutodetection: boolean("avif_autodetection").default(false),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		fileSizeLimit: bigint("file_size_limit", { mode: "number" }),
		allowedMimeTypes: text("allowed_mime_types").array(),
		ownerId: text("owner_id"),
	},
	(table) => {
		return {
			bname: uniqueIndex("bname").using("btree", table.name.asc().nullsLast()),
		};
	},
);

export const objectsInStorage = storage.table(
	"objects",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		bucketId: text("bucket_id"),
		name: text("name"),
		owner: uuid("owner"),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		lastAccessedAt: timestamp("last_accessed_at", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		metadata: jsonb("metadata"),
		pathTokens: text("path_tokens")
			.array()
			.generatedAlwaysAs(sql`string_to_array(name, '/'::text)`),
		version: text("version"),
		ownerId: text("owner_id"),
		userMetadata: jsonb("user_metadata"),
	},
	(table) => {
		return {
			bucketidObjname: uniqueIndex("bucketid_objname").using(
				"btree",
				table.bucketId.asc().nullsLast(),
				table.name.asc().nullsLast(),
			),
			idxObjectsBucketIdName: index("idx_objects_bucket_id_name").using(
				"btree",
				table.bucketId.asc().nullsLast(),
				table.name.asc().nullsLast(),
			),
			namePrefixSearch: index("name_prefix_search").using(
				"btree",
				table.name.asc().nullsLast(),
			),
			objectsBucketIdFkey: foreignKey({
				columns: [table.bucketId],
				foreignColumns: [bucketsInStorage.id],
				name: "objects_bucketId_fkey",
			}),
		};
	},
);

export const migrationsInStorage = storage.table(
	"migrations",
	{
		id: integer("id").primaryKey().notNull(),
		name: varchar("name", { length: 100 }).notNull(),
		hash: varchar("hash", { length: 40 }).notNull(),
		executedAt: timestamp("executed_at", { mode: "string" }).default(
			sql`CURRENT_TIMESTAMP`,
		),
	},
	(table) => {
		return {
			migrationsNameKey: unique("migrations_name_key").on(table.name),
		};
	},
);

export const s3MultipartUploadsInStorage = storage.table(
	"s3_multipart_uploads",
	{
		id: text("id").primaryKey().notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		inProgressSize: bigint("in_progress_size", { mode: "number" })
			.default(0)
			.notNull(),
		uploadSignature: text("upload_signature").notNull(),
		bucketId: text("bucket_id").notNull(),
		key: text("key").notNull(),
		version: text("version").notNull(),
		ownerId: text("owner_id"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		userMetadata: jsonb("user_metadata"),
	},
	(table) => {
		return {
			idxMultipartUploadsList: index("idx_multipart_uploads_list").using(
				"btree",
				table.bucketId.asc().nullsLast(),
				table.key.asc().nullsLast(),
				table.createdAt.asc().nullsLast(),
			),
			s3MultipartUploadsBucketIdFkey: foreignKey({
				columns: [table.bucketId],
				foreignColumns: [bucketsInStorage.id],
				name: "s3_multipart_uploads_bucket_id_fkey",
			}),
		};
	},
);

export const s3MultipartUploadsPartsInStorage = storage.table(
	"s3_multipart_uploads_parts",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		uploadId: text("upload_id").notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		size: bigint("size", { mode: "number" }).default(0).notNull(),
		partNumber: integer("part_number").notNull(),
		bucketId: text("bucket_id").notNull(),
		key: text("key").notNull(),
		etag: text("etag").notNull(),
		ownerId: text("owner_id"),
		version: text("version").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
	},
	(table) => {
		return {
			s3MultipartUploadsPartsUploadIdFkey: foreignKey({
				columns: [table.uploadId],
				foreignColumns: [s3MultipartUploadsInStorage.id],
				name: "s3_multipart_uploads_parts_upload_id_fkey",
			}).onDelete("cascade"),
			s3MultipartUploadsPartsBucketIdFkey: foreignKey({
				columns: [table.bucketId],
				foreignColumns: [bucketsInStorage.id],
				name: "s3_multipart_uploads_parts_bucket_id_fkey",
			}),
		};
	},
);

export const sessionsInAuth = auth.table(
	"sessions",
	{
		id: uuid("id").primaryKey().notNull(),
		userId: uuid("user_id").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		factorId: uuid("factor_id"),
		aal: aalLevelInAuth("aal"),
		notAfter: timestamp("not_after", { withTimezone: true, mode: "string" }),
		refreshedAt: timestamp("refreshed_at", { mode: "string" }),
		userAgent: text("user_agent"),
		ip: inet("ip"),
		tag: text("tag"),
	},
	(table) => {
		return {
			notAfterIdx: index("sessions_not_after_idx").using(
				"btree",
				table.notAfter.desc().nullsFirst(),
			),
			userIdIdx: index("sessions_user_id_idx").using(
				"btree",
				table.userId.asc().nullsLast(),
			),
			userIdCreatedAtIdx: index("user_id_created_at_idx").using(
				"btree",
				table.userId.asc().nullsLast(),
				table.createdAt.asc().nullsLast(),
			),
			sessionsUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [usersInAuth.id],
				name: "sessions_user_id_fkey",
			}).onDelete("cascade"),
		};
	},
);

export const identitiesInAuth = auth.table(
	"identities",
	{
		providerId: text("provider_id").notNull(),
		userId: uuid("user_id").notNull(),
		identityData: jsonb("identity_data").notNull(),
		provider: text("provider").notNull(),
		lastSignInAt: timestamp("last_sign_in_at", {
			withTimezone: true,
			mode: "string",
		}),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		email: text("email").generatedAlwaysAs(
			sql`lower((identity_data ->> 'email'::text))`,
		),
		id: uuid("id").defaultRandom().primaryKey().notNull(),
	},
	(table) => {
		return {
			emailIdx: index("identities_email_idx").using(
				"btree",
				table.email.asc().nullsLast(),
			),
			userIdIdx: index("identities_user_id_idx").using(
				"btree",
				table.userId.asc().nullsLast(),
			),
			identitiesUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [usersInAuth.id],
				name: "identities_user_id_fkey",
			}).onDelete("cascade"),
			identitiesProviderIdProviderUnique: unique(
				"identities_provider_id_provider_unique",
			).on(table.providerId, table.provider),
		};
	},
);

export const mfaFactorsInAuth = auth.table(
	"mfa_factors",
	{
		id: uuid("id").primaryKey().notNull(),
		userId: uuid("user_id").notNull(),
		friendlyName: text("friendly_name"),
		factorType: factorTypeInAuth("factor_type").notNull(),
		status: factorStatusInAuth("status").notNull(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		secret: text("secret"),
		phone: text("phone"),
		lastChallengedAt: timestamp("last_challenged_at", {
			withTimezone: true,
			mode: "string",
		}),
	},
	(table) => {
		return {
			factorIdCreatedAtIdx: index("factor_id_created_at_idx").using(
				"btree",
				table.userId.asc().nullsLast(),
				table.createdAt.asc().nullsLast(),
			),
			userFriendlyNameUnique: uniqueIndex(
				"mfa_factors_user_friendly_name_unique",
			)
				.using(
					"btree",
					table.friendlyName.asc().nullsLast(),
					table.userId.asc().nullsLast(),
				)
				.where(sql`(TRIM(BOTH FROM friendly_name) <> ''::text)`),
			userIdIdx: index("mfa_factors_user_id_idx").using(
				"btree",
				table.userId.asc().nullsLast(),
			),
			uniqueVerifiedPhoneFactor: uniqueIndex(
				"unique_verified_phone_factor",
			).using(
				"btree",
				table.userId.asc().nullsLast(),
				table.phone.asc().nullsLast(),
			),
			mfaFactorsUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [usersInAuth.id],
				name: "mfa_factors_user_id_fkey",
			}).onDelete("cascade"),
			mfaFactorsPhoneKey: unique("mfa_factors_phone_key").on(table.phone),
			mfaFactorsLastChallengedAtKey: unique(
				"mfa_factors_last_challenged_at_key",
			).on(table.lastChallengedAt),
		};
	},
);

export const ssoProvidersInAuth = auth.table(
	"sso_providers",
	{
		id: uuid("id").primaryKey().notNull(),
		resourceId: text("resource_id"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
	},
	(table) => {
		return {
			resourceIdIdx: uniqueIndex("sso_providers_resource_id_idx").using(
				"btree",
				sql`lower(resource_id)`,
			),
		};
	},
);

export const ssoDomainsInAuth = auth.table(
	"sso_domains",
	{
		id: uuid("id").primaryKey().notNull(),
		ssoProviderId: uuid("sso_provider_id").notNull(),
		domain: text("domain").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
	},
	(table) => {
		return {
			domainIdx: uniqueIndex("sso_domains_domain_idx").using(
				"btree",
				sql`lower(domain)`,
			),
			ssoProviderIdIdx: index("sso_domains_sso_provider_id_idx").using(
				"btree",
				table.ssoProviderId.asc().nullsLast(),
			),
			ssoDomainsSsoProviderIdFkey: foreignKey({
				columns: [table.ssoProviderId],
				foreignColumns: [ssoProvidersInAuth.id],
				name: "sso_domains_sso_provider_id_fkey",
			}).onDelete("cascade"),
		};
	},
);

export const mfaChallengesInAuth = auth.table(
	"mfa_challenges",
	{
		id: uuid("id").primaryKey().notNull(),
		factorId: uuid("factor_id").notNull(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		verifiedAt: timestamp("verified_at", {
			withTimezone: true,
			mode: "string",
		}),
		ipAddress: inet("ip_address").notNull(),
		otpCode: text("otp_code"),
	},
	(table) => {
		return {
			mfaChallengeCreatedAtIdx: index("mfa_challenge_created_at_idx").using(
				"btree",
				table.createdAt.desc().nullsFirst(),
			),
			mfaChallengesAuthFactorIdFkey: foreignKey({
				columns: [table.factorId],
				foreignColumns: [mfaFactorsInAuth.id],
				name: "mfa_challenges_auth_factor_id_fkey",
			}).onDelete("cascade"),
		};
	},
);

export const samlRelayStatesInAuth = auth.table(
	"saml_relay_states",
	{
		id: uuid("id").primaryKey().notNull(),
		ssoProviderId: uuid("sso_provider_id").notNull(),
		requestId: text("request_id").notNull(),
		forEmail: text("for_email"),
		redirectTo: text("redirect_to"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		flowStateId: uuid("flow_state_id"),
	},
	(table) => {
		return {
			createdAtIdx: index("saml_relay_states_created_at_idx").using(
				"btree",
				table.createdAt.desc().nullsFirst(),
			),
			forEmailIdx: index("saml_relay_states_for_email_idx").using(
				"btree",
				table.forEmail.asc().nullsLast(),
			),
			ssoProviderIdIdx: index("saml_relay_states_sso_provider_id_idx").using(
				"btree",
				table.ssoProviderId.asc().nullsLast(),
			),
			samlRelayStatesSsoProviderIdFkey: foreignKey({
				columns: [table.ssoProviderId],
				foreignColumns: [ssoProvidersInAuth.id],
				name: "saml_relay_states_sso_provider_id_fkey",
			}).onDelete("cascade"),
			samlRelayStatesFlowStateIdFkey: foreignKey({
				columns: [table.flowStateId],
				foreignColumns: [flowStateInAuth.id],
				name: "saml_relay_states_flow_state_id_fkey",
			}).onDelete("cascade"),
		};
	},
);

export const mfaAmrClaimsInAuth = auth.table(
	"mfa_amr_claims",
	{
		sessionId: uuid("session_id").notNull(),
		createdAt: timestamp("created_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		updatedAt: timestamp("updated_at", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		authenticationMethod: text("authentication_method").notNull(),
		id: uuid("id").primaryKey().notNull(),
	},
	(table) => {
		return {
			mfaAmrClaimsSessionIdFkey: foreignKey({
				columns: [table.sessionId],
				foreignColumns: [sessionsInAuth.id],
				name: "mfa_amr_claims_session_id_fkey",
			}).onDelete("cascade"),
			mfaAmrClaimsSessionIdAuthenticationMethodPkey: unique(
				"mfa_amr_claims_session_id_authentication_method_pkey",
			).on(table.sessionId, table.authenticationMethod),
		};
	},
);

export const samlProvidersInAuth = auth.table(
	"saml_providers",
	{
		id: uuid("id").primaryKey().notNull(),
		ssoProviderId: uuid("sso_provider_id").notNull(),
		entityId: text("entity_id").notNull(),
		metadataXml: text("metadata_xml").notNull(),
		metadataUrl: text("metadata_url"),
		attributeMapping: jsonb("attribute_mapping"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		nameIdFormat: text("name_id_format"),
	},
	(table) => {
		return {
			ssoProviderIdIdx: index("saml_providers_sso_provider_id_idx").using(
				"btree",
				table.ssoProviderId.asc().nullsLast(),
			),
			samlProvidersSsoProviderIdFkey: foreignKey({
				columns: [table.ssoProviderId],
				foreignColumns: [ssoProvidersInAuth.id],
				name: "saml_providers_sso_provider_id_fkey",
			}).onDelete("cascade"),
			samlProvidersEntityIdKey: unique("saml_providers_entity_id_key").on(
				table.entityId,
			),
		};
	},
);

export const flowStateInAuth = auth.table(
	"flow_state",
	{
		id: uuid("id").primaryKey().notNull(),
		userId: uuid("user_id"),
		authCode: text("auth_code").notNull(),
		codeChallengeMethod: codeChallengeMethodInAuth(
			"code_challenge_method",
		).notNull(),
		codeChallenge: text("code_challenge").notNull(),
		providerType: text("provider_type").notNull(),
		providerAccessToken: text("provider_access_token"),
		providerRefreshToken: text("provider_refresh_token"),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		authenticationMethod: text("authentication_method").notNull(),
		authCodeIssuedAt: timestamp("auth_code_issued_at", {
			withTimezone: true,
			mode: "string",
		}),
	},
	(table) => {
		return {
			createdAtIdx: index("flow_state_created_at_idx").using(
				"btree",
				table.createdAt.desc().nullsFirst(),
			),
			idxAuthCode: index("idx_auth_code").using(
				"btree",
				table.authCode.asc().nullsLast(),
			),
			idxUserIdAuthMethod: index("idx_user_id_auth_method").using(
				"btree",
				table.userId.asc().nullsLast(),
				table.authenticationMethod.asc().nullsLast(),
			),
		};
	},
);

export const oneTimeTokensInAuth = auth.table(
	"one_time_tokens",
	{
		id: uuid("id").primaryKey().notNull(),
		userId: uuid("user_id").notNull(),
		tokenType: oneTimeTokenTypeInAuth("token_type").notNull(),
		tokenHash: text("token_hash").notNull(),
		relatesTo: text("relates_to").notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.defaultNow()
			.notNull(),
	},
	(table) => {
		return {
			relatesToHashIdx: index("one_time_tokens_relates_to_hash_idx").using(
				"hash",
				table.relatesTo.asc().nullsLast(),
			),
			tokenHashHashIdx: index("one_time_tokens_token_hash_hash_idx").using(
				"hash",
				table.tokenHash.asc().nullsLast(),
			),
			userIdTokenTypeKey: uniqueIndex(
				"one_time_tokens_user_id_token_type_key",
			).using(
				"btree",
				table.userId.asc().nullsLast(),
				table.tokenType.asc().nullsLast(),
			),
			oneTimeTokensUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [usersInAuth.id],
				name: "one_time_tokens_user_id_fkey",
			}).onDelete("cascade"),
		};
	},
);

export const orgDetails = pgTable(
	"org_details",
	{
		id: uuid("id").primaryKey().notNull(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		avatar: text("avatar"),
		type: text("type"),
	},
	(table) => {
		return {
			orgDetailsIdFkey: foreignKey({
				columns: [table.id],
				foreignColumns: [organisations.id],
				name: "org_details_id_fkey",
			})
				.onUpdate("cascade")
				.onDelete("cascade"),
			orgDetailsSlugKey: unique("org_details_slug_key").on(table.slug),
		};
	},
);

export const orgMembers = pgTable(
	"org_members",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		userId: uuid("user_id").notNull(),
		orgId: uuid("org_id").notNull(),
		role: organisationRole("role").default("Guest").notNull(),
	},
	(table) => {
		return {
			orgMembersOrgIdFkey: foreignKey({
				columns: [table.orgId],
				foreignColumns: [organisations.id],
				name: "org_members_org_id_fkey",
			})
				.onUpdate("cascade")
				.onDelete("cascade"),
			orgMembersUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [users.id],
				name: "org_members_user_id_fkey",
			})
				.onUpdate("cascade")
				.onDelete("cascade"),
		};
	},
);

export const organisations = pgTable("organisations", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
		.defaultNow()
		.notNull(),
	id: uuid("id").defaultRandom().primaryKey().notNull(),
});

export const userDetails = pgTable(
	"user_details",
	{
		id: uuid("id").primaryKey().notNull(),
		name: text("name"),
		email: text("email"),
		avatar: text("avatar"),
	},
	(table) => {
		return {
			publicUserDetailsIdFkey: foreignKey({
				columns: [table.id],
				foreignColumns: [users.id],
				name: "public_user_details_id_fkey",
			})
				.onUpdate("cascade")
				.onDelete("cascade"),
			userDetailsIdKey: unique("user_details_id_key").on(table.id),
		};
	},
);

export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().notNull(),
		joinedAt: timestamp("joined_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		role: userRole("role").default("User").notNull(),
		status: accountStatus("status").default("Active").notNull(),
	},
	(table) => {
		return {
			publicUsersIdFkey: foreignKey({
				columns: [table.id],
				foreignColumns: [table.id],
				name: "public_users_id_fkey",
			})
				.onUpdate("cascade")
				.onDelete("cascade"),
			usersIdKey: unique("users_id_key").on(table.id),
		};
	},
);

export const content = pgTable(
	"content",
	{
		objectId: uuid("object_id"),
		encryptedText: text("encrypted_text"),
		type: contentType("type").default("text").notNull(),
		id: uuid("id"),
	},
	(table) => {
		return {
			contentObjectIdFkey: foreignKey({
				columns: [table.objectId],
				foreignColumns: [objectsInStorage.id],
				name: "content_object_id_fkey",
			})
				.onUpdate("cascade")
				.onDelete("cascade"),
			contentIdFkey: foreignKey({
				columns: [table.id],
				foreignColumns: [moderations.contentId],
				name: "content_id_fkey",
			})
				.onUpdate("cascade")
				.onDelete("cascade"),
			contentObjectIdKey: unique("content_object_id_key").on(table.objectId),
			contentIdKey: unique("content_id_key").on(table.id),
		};
	},
);

export const moderations = pgTable(
	"moderations",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
		contentId: uuid("content_id").defaultRandom().notNull(),
		hash: text("hash").notNull(),
		vector: vector("vector", { dimensions: 1536 }),
		result: jsonb("result").default({}).notNull(),
	},
	(table) => {
		return {
			idxModerationsVector: index("idx_moderations_vector").using(
				"ivfflat",
				table.vector.asc().nullsLast().op("vector_l2_ops"),
			),
			moderationsContentIdKey: unique("moderations_content_id_key").on(
				table.contentId,
			),
			moderationsHashKey: unique("moderations_hash_key").on(table.hash),
		};
	},
);
