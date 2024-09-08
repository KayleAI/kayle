import { relations } from "drizzle-orm/relations";
import { sessionsInAuth, refreshTokensInAuth, bucketsInStorage, objectsInStorage, s3MultipartUploadsInStorage, s3MultipartUploadsPartsInStorage, usersInAuth, identitiesInAuth, mfaFactorsInAuth, ssoProvidersInAuth, ssoDomainsInAuth, mfaChallengesInAuth, samlRelayStatesInAuth, flowStateInAuth, mfaAmrClaimsInAuth, samlProvidersInAuth, oneTimeTokensInAuth, organisations, orgDetails, orgMembers, users, userDetails, content, moderations } from "./schema";

export const refreshTokensInAuthRelations = relations(refreshTokensInAuth, ({one}) => ({
	sessionsInAuth: one(sessionsInAuth, {
		fields: [refreshTokensInAuth.sessionId],
		references: [sessionsInAuth.id]
	}),
}));

export const sessionsInAuthRelations = relations(sessionsInAuth, ({one, many}) => ({
	refreshTokensInAuths: many(refreshTokensInAuth),
	usersInAuth: one(usersInAuth, {
		fields: [sessionsInAuth.userId],
		references: [usersInAuth.id]
	}),
	mfaAmrClaimsInAuths: many(mfaAmrClaimsInAuth),
}));

export const objectsInStorageRelations = relations(objectsInStorage, ({one, many}) => ({
	bucketsInStorage: one(bucketsInStorage, {
		fields: [objectsInStorage.bucketId],
		references: [bucketsInStorage.id]
	}),
	contents: many(content),
}));

export const bucketsInStorageRelations = relations(bucketsInStorage, ({many}) => ({
	objectsInStorages: many(objectsInStorage),
	s3MultipartUploadsInStorages: many(s3MultipartUploadsInStorage),
	s3MultipartUploadsPartsInStorages: many(s3MultipartUploadsPartsInStorage),
}));

export const s3MultipartUploadsInStorageRelations = relations(s3MultipartUploadsInStorage, ({one, many}) => ({
	bucketsInStorage: one(bucketsInStorage, {
		fields: [s3MultipartUploadsInStorage.bucketId],
		references: [bucketsInStorage.id]
	}),
	s3MultipartUploadsPartsInStorages: many(s3MultipartUploadsPartsInStorage),
}));

export const s3MultipartUploadsPartsInStorageRelations = relations(s3MultipartUploadsPartsInStorage, ({one}) => ({
	s3MultipartUploadsInStorage: one(s3MultipartUploadsInStorage, {
		fields: [s3MultipartUploadsPartsInStorage.uploadId],
		references: [s3MultipartUploadsInStorage.id]
	}),
	bucketsInStorage: one(bucketsInStorage, {
		fields: [s3MultipartUploadsPartsInStorage.bucketId],
		references: [bucketsInStorage.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	sessionsInAuths: many(sessionsInAuth),
	identitiesInAuths: many(identitiesInAuth),
	mfaFactorsInAuths: many(mfaFactorsInAuth),
	oneTimeTokensInAuths: many(oneTimeTokensInAuth),
	users: many(users),
}));

export const identitiesInAuthRelations = relations(identitiesInAuth, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [identitiesInAuth.userId],
		references: [usersInAuth.id]
	}),
}));

export const mfaFactorsInAuthRelations = relations(mfaFactorsInAuth, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [mfaFactorsInAuth.userId],
		references: [usersInAuth.id]
	}),
	mfaChallengesInAuths: many(mfaChallengesInAuth),
}));

export const ssoDomainsInAuthRelations = relations(ssoDomainsInAuth, ({one}) => ({
	ssoProvidersInAuth: one(ssoProvidersInAuth, {
		fields: [ssoDomainsInAuth.ssoProviderId],
		references: [ssoProvidersInAuth.id]
	}),
}));

export const ssoProvidersInAuthRelations = relations(ssoProvidersInAuth, ({many}) => ({
	ssoDomainsInAuths: many(ssoDomainsInAuth),
	samlRelayStatesInAuths: many(samlRelayStatesInAuth),
	samlProvidersInAuths: many(samlProvidersInAuth),
}));

export const mfaChallengesInAuthRelations = relations(mfaChallengesInAuth, ({one}) => ({
	mfaFactorsInAuth: one(mfaFactorsInAuth, {
		fields: [mfaChallengesInAuth.factorId],
		references: [mfaFactorsInAuth.id]
	}),
}));

export const samlRelayStatesInAuthRelations = relations(samlRelayStatesInAuth, ({one}) => ({
	ssoProvidersInAuth: one(ssoProvidersInAuth, {
		fields: [samlRelayStatesInAuth.ssoProviderId],
		references: [ssoProvidersInAuth.id]
	}),
	flowStateInAuth: one(flowStateInAuth, {
		fields: [samlRelayStatesInAuth.flowStateId],
		references: [flowStateInAuth.id]
	}),
}));

export const flowStateInAuthRelations = relations(flowStateInAuth, ({many}) => ({
	samlRelayStatesInAuths: many(samlRelayStatesInAuth),
}));

export const mfaAmrClaimsInAuthRelations = relations(mfaAmrClaimsInAuth, ({one}) => ({
	sessionsInAuth: one(sessionsInAuth, {
		fields: [mfaAmrClaimsInAuth.sessionId],
		references: [sessionsInAuth.id]
	}),
}));

export const samlProvidersInAuthRelations = relations(samlProvidersInAuth, ({one}) => ({
	ssoProvidersInAuth: one(ssoProvidersInAuth, {
		fields: [samlProvidersInAuth.ssoProviderId],
		references: [ssoProvidersInAuth.id]
	}),
}));

export const oneTimeTokensInAuthRelations = relations(oneTimeTokensInAuth, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [oneTimeTokensInAuth.userId],
		references: [usersInAuth.id]
	}),
}));

export const orgDetailsRelations = relations(orgDetails, ({one}) => ({
	organisation: one(organisations, {
		fields: [orgDetails.id],
		references: [organisations.id]
	}),
}));

export const organisationsRelations = relations(organisations, ({many}) => ({
	orgDetails: many(orgDetails),
	orgMembers: many(orgMembers),
}));

export const orgMembersRelations = relations(orgMembers, ({one}) => ({
	organisation: one(organisations, {
		fields: [orgMembers.orgId],
		references: [organisations.id]
	}),
	user: one(users, {
		fields: [orgMembers.userId],
		references: [users.id]
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

export const userDetailsRelations = relations(userDetails, ({one}) => ({
	user: one(users, {
		fields: [userDetails.id],
		references: [users.id]
	}),
}));

export const contentRelations = relations(content, ({one}) => ({
	objectsInStorage: one(objectsInStorage, {
		fields: [content.objectId],
		references: [objectsInStorage.id]
	}),
	moderation: one(moderations, {
		fields: [content.id],
		references: [moderations.contentId]
	}),
}));

export const moderationsRelations = relations(moderations, ({many}) => ({
	contents: many(content),
}));