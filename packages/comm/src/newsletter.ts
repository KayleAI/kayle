"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY! ?? "");

export async function join({
	email,
	audienceId,
	firstName = null,
	lastName = null,
}: {
	email: string;
	audienceId: string;
	firstName?: string | null;
	lastName?: string | null;
}): Promise<boolean> {
	try {
		await resend.contacts.create({
			email: email,
			...(firstName ? { firstName: firstName } : {}),
			...(lastName ? { lastName: lastName } : {}),
			unsubscribed: false,
			audienceId: audienceId,
		});

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function remove({
	email,
	audienceId,
}: {
	email: string;
	audienceId: string;
}): Promise<boolean> {
	try {
		await resend.contacts.remove({
			email: email,
			audienceId: audienceId,
		});

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
