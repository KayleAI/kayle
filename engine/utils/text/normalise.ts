/**
 * Normalise a piece of text to specific rules.
 *
 * TODO: Add more normalisation rules here.
 * For example, removing special characters and changing certain emojis to their textual representation.
 *
 * @param textToNormalise - Text to normalise
 * @returns Normalised text
 */
export function normaliseText(textToNormalise: string) {
	let text = textToNormalise.trim();

	text = text.replace(/(\r\n|\n|\r)/gm, " ");

	return text;
}
