// OpenAI
import { OpenAI } from "openai";

export async function vectoriseText({
	AI_API_KEY,
	AI_BASE_URL,
	text,
}: {
	AI_API_KEY: string;
	AI_BASE_URL: string;
	text: string;
}) {
	const ai = new OpenAI({
		apiKey: AI_API_KEY,
		baseURL: AI_BASE_URL,
	});

	const embedding = await ai.embeddings.create({
		model: "text-embedding-3-large",
		input: text,
	});

	return embedding.data[0].embedding;
}
