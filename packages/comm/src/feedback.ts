import { createClient } from "@repo/db/client";

export async function captureFeedback({
	feedback,
	feedbackType,
}: {
	feedback: string;
	feedbackType: string;
}): Promise<{ success: boolean; error: string | null }> {
	const supabase = createClient();

	try {
		const { error } = await supabase.from("contact").insert({
			is_feedback: true,
			message: feedback,
			type: feedbackType,
		});

		if (error) {
			throw error;
		}

		return {
			success: true,
			error: null,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: "An unknown error occurred",
		};
	}
}
