import { relations } from "drizzle-orm/relations";
import { users, orgMembers, organisations, orgDetails, userDetails, usersInAuth } from "./schema";

export const orgMembersRelations = relations(orgMembers, ({one}) => ({
	user: one(users, {
		fields: [orgMembers.userId],
		references: [users.id]
	}),
	organisation: one(organisations, {
		fields: [orgMembers.orgId],
		references: [organisations.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	orgMembers: many(orgMembers),
	userDetails: many(userDetails),
	usersInAuth: one(usersInAuth, {
		fields: [users.id],
		references: [usersInAuth.id]
	}),
}));

export const organisationsRelations = relations(organisations, ({many}) => ({
	orgMembers: many(orgMembers),
	orgDetails: many(orgDetails),
}));

export const orgDetailsRelations = relations(orgDetails, ({one}) => ({
	organisation: one(organisations, {
		fields: [orgDetails.id],
		references: [organisations.id]
	}),
}));

export const userDetailsRelations = relations(userDetails, ({one}) => ({
	user: one(users, {
		fields: [userDetails.id],
		references: [users.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	users: many(users),
}));