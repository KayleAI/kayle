import { getFileNameFromResponse } from "./utils";

export async function downloadImageFromUrl(url: string): Promise<File> {
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
		if (!contentType || !contentType.includes("image")) {
			throw new Error("URL does not point to an image file");
		}

		const buffer = await response.arrayBuffer();

		const maxSize = 20 * 1024 * 1024;
		if (buffer.byteLength > maxSize) {
			throw new Error("File size exceeds the maximum limit of 20MB");
		}

		const fileName =
			getFileNameFromResponse(response.headers as unknown as Headers) ??
			"image.png";
		return new File([buffer], fileName, { type: contentType });
	} catch (error) {
		throw new Error(`Failed to download file: ${error}`);
	}
}
