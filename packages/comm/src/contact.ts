import { createClient } from "@repo/db/client";

export async function captureContactForm({
	message,
}: {
	message: string;
}): Promise<{ success: boolean; error: string | null }> {
	const supabase = createClient();

	try {
		const {
			data: { session },
			error: userError,
		} = await supabase.auth.getSession();

		if (userError) {
			throw new Error("Something went wrong. We’re working on it!");
		}

		if (!session) {
			throw new Error("You need to log in so we can get back to you!");
		}

		const { error } = await supabase.from("contact").insert({
			is_feedback: false,
			message: message,
			user_id: session?.user.id,
		});

		if (error) {
			throw new Error("Something went wrong. We’re working on it!");
		}

		return {
			success: true,
			error: null,
		};
	} catch (error: any) {
		console.error(error);
		return {
			success: false,
			error: error?.message ?? "An unknown error occurred",
		};
	}
}
