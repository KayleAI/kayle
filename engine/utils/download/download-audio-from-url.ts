import { getFileNameFromResponse } from "./utils";

export async function downloadAudioFromUrl(url: string): Promise<File> {
	// Validate URL format
	const urlPattern = /^https?:\/\/.+/i;
	if (!url || !urlPattern.test(url)) {
		throw new Error("Invalid URL format");
	}

	try {
		const response = await fetch(url);

		// Check if the response is ok
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		// Validate content type
		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("audio")) {
			throw new Error("URL does not point to an audio file");
		}

		const buffer = await response.arrayBuffer();

		const maxSize = 25 * 1024 * 1024;
		if (buffer.byteLength > maxSize) {
			throw new Error("File size exceeds the maximum limit of 25MB");
		}

		const fileName =
			getFileNameFromResponse(response.headers as unknown as Headers) ??
			"audio.mp3";
		return new File([buffer], fileName, { type: contentType });
	} catch (error) {
		throw new Error(`Failed to download file: ${error}`);
	}
}