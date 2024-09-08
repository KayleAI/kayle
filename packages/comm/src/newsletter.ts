"use server";

import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
	throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

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
			email,
			...(firstName ? { firstName } : {}),
			...(lastName ? { lastName } : {}),
			unsubscribed: false,
			audienceId,
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
			email,
			audienceId,
		});

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
