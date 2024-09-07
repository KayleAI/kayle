import { which } from "node-emoji";
/**
 * Normalise a piece of text to specific rules.
 *
 * TODO: Add more normalisation rules here.
 * For example, removing special characters and changing certain emojis to their textual representation.
 * NOTE: We keep texts case sensitive as they'll
 *
 * @param textToNormalise - Text to normalise
 * @returns Normalised text
 */
export function normaliseText(textToNormalise: string) {
	// remove excess whitespace
	let text = textToNormalise.trim();

	// replace newline with space
	text = text.replace(/(\r\n|\n|\r)/gm, " ");

	text = normaliseEmoji(text);

	/** 
	// find l33t sp34k
	 * text = normaliseLeet(text);
	**/

	return text;
}

function normaliseEmoji(textToNormalise: string) {
	/**
	 * global unicode (gu) search on UTF emoji identifiers within @param textToNormalise
	 * which(emoji) functionality: 🦄 returns => name: 'unicorn'
	 */
	const newtext = textToNormalise.replace(
		/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
		(emoji: string) => which(emoji) || emoji,
	);
	console.log(
		`Emoji: ${/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu}, Name: ${(emoji: string) => which(emoji) || emoji}`,
	);
	return newtext;
}

// l33tsp34k helper function using Regex

/** 
 * DISCUSS: 'Multi threading? (i.e. multiple inputs )
const normaliseLeet = (text: string): string => {
  return text.replace(/4|@|∆/g, 'A')
             .replace(/3/g, 'E')
             .replace(/1|!|l/g, 'I')
             .replace(/0/g, 'O')
             .replace(/5|\$/g, 'S')
             .replace(/7/g, 'T')
             .replace(/2/g, 'Z')
             .replace(/8/g, 'B');
};
**/
