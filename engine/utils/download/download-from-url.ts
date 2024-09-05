// Types
import type { ModerationType } from "@/types/moderation";

// Utils
import { getFileNameFromResponse } from "./utils";

export async function downloadFromUrl(
	url: string,
	maxMB = 20,
	type?: ModerationType,
): Promise<File> {
	validateUrl(url);

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const contentType = response.headers.get("content-type");
		if (!contentType || (type && !contentType.includes(type))) {
			throw new Error("Invalid content type");
		}

		const buffer = await response.arrayBuffer();

		const maxSize = maxMB * 1024 * 1024;
		if (buffer.byteLength > maxSize) {
			throw new Error("File size exceeds the maximum limit of 20MB");
		}

		const fileName =
			getFileNameFromResponse(response.headers as unknown as Headers) ??
			"unknown";
		return new File([buffer], fileName, { type: contentType });
	} catch (error) {
		throw new Error(`Failed to download file: ${error}`);
	}
}

function validateUrl(url: string) {
	const urlPattern = /^https?:\/\/.+/i;
	if (!url || !urlPattern.test(url)) {
		throw new Error("Invalid URL format");
	}
}
