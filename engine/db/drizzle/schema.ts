import { pgTable, foreignKey, uuid, timestamp, unique, text, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const accountStatus = pgEnum("Account Status", ['Active', 'Inactive', 'Suspended', 'Terminated'])
export const organisationRole = pgEnum("Organisation Role", ['Owner', 'Admin', 'Moderator', 'Developer', 'Guest'])
export const userRole = pgEnum("User Role", ['User', 'Administrator', 'Owner'])



export const orgMembers = pgTable("org_members", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
	orgId: uuid("org_id").notNull(),
	role: organisationRole("role").default('Guest').notNull(),
},
(table) => {
	return {
		orgMembersUserIdFkey: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "org_members_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		orgMembersOrgIdFkey: foreignKey({
			columns: [table.orgId],
			foreignColumns: [organisations.id],
			name: "org_members_org_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	}
});

export const orgDetails = pgTable("org_details", {
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
			name: "org_details_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		orgDetailsSlugKey: unique("org_details_slug_key").on(table.slug),
	}
});

export const userDetails = pgTable("user_details", {
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
			name: "public_user_details_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		userDetailsIdKey: unique("user_details_id_key").on(table.id),
	}
});

export const users = pgTable("users", {
	id: uuid("id").primaryKey().notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	role: userRole("role").default('User').notNull(),
	status: accountStatus("status").default('Active').notNull(),
},
(table) => {
	return {
		publicUsersIdFkey: foreignKey({
			columns: [table.id],
			foreignColumns: [table.id],
			name: "public_users_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
		usersIdKey: unique("users_id_key").on(table.id),
	}
});

export const organisations = pgTable("organisations", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	id: uuid("id").defaultRandom().primaryKey().notNull(),
});