// Groq
import { Groq } from "groq-sdk";

export async function convertAudioToText(apiKey: string, audio: File) {
	const groq = new Groq({ apiKey });

	const transcription = await groq.audio.transcriptions.create({
		file: audio,
		model: "whisper-large-v3",
		response_format: "json",
		temperature: 0.0,
	});

	return transcription.text;
}
