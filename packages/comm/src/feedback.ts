"use server";

export async function captureFeedback({
  feedback,
  feedbackType,
}: {
  feedback: string;
  feedbackType: string;
}): Promise<{ success: boolean; error: string | null }> {
  // TODO: Only authenticated users should be able to submit feedback

  try {
    console.log(`Feedback: ${feedback}`);
    console.log(`Feedback Type: ${feedbackType}`);
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
