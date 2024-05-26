"use server";

export async function captureFeedback({
  feedback,
  feedbackType,
}: {
  feedback: string;
  feedbackType: string;
}): Promise<boolean> {
  // TODO: Only authenticated users should be able to submit feedback

  try {
    console.log(`Feedback: ${feedback}`);
    console.log(`Feedback Type: ${feedbackType}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
