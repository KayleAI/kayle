import OpenAI from "openai";

/**
 * Create a vector from a piece of text
 *
 * If you’re using OpenAI, we recommend `text-embedding-3-large`
 * as it has better performance against the MIRACL.
 *
 * Another good option is `nomic-embed-text-v1.5` available
 * via the Groq API.
 *
 * @param AI_API_KEY - OpenAI API key (or alternative)
 * @param AI_BASE_URL - OpenAI base URL (or alternative)
 * @param EMBEDDING_MODEL - Embedding model to use
 * @param text - Text to create a vector from
 * @returns Vector
 */
export async function createVector({
	env,
	text,
}: {
	env: {
		AI_API_KEY: string;
		AI_BASE_URL: string;
		EMBEDDING_MODEL?: string;
	};
	text: string;
}) {
	const ai = new OpenAI({
		apiKey: env.AI_API_KEY,
		baseURL: env.AI_BASE_URL ?? "https://api.openai.com/v1",
	});

	const vector = await ai.embeddings.create({
		model: env.EMBEDDING_MODEL ?? "text-embedding-3-large",
		dimensions: 1536,
		input: text,
	});

	return vector.data[0].embedding;
}
