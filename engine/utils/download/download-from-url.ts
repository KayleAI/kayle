// Types
import type { ModerationType } from "@repo/types/moderation";

// Utils
import { getFileNameFromResponse } from "./utils";

export async function downloadFromUrl(
	url: string,
	maxMB = 20,
	type?: ModerationType,
): Promise<File> {
	const { isBase64, data } = validateUrl(url);

	try {
		if (isBase64) {
			return handleBase64Data(data, maxMB, type);
		}

		return await handleUrlData(url, maxMB, type);
	} catch (error) {
		throw new Error(`Failed to download file: ${error}`);
	}
}

function validateUrl(url: string): { isBase64: boolean; data: string } {
	const urlPattern = /^https?:\/\/.+/i;
	const base64Pattern = /^data:([a-z]+\/[a-z0-9-+.]+);base64,/i;

	if (base64Pattern.test(url)) {
		return { isBase64: true, data: url };
	}

	if (!url || !urlPattern.test(url)) {
		throw new Error("Invalid URL format");
	}

	return { isBase64: false, data: url };
}

function handleBase64Data(
	data: string,
	maxMB: number,
	type?: ModerationType,
): File {
	const base64Pattern = /^data:([a-z]+\/[a-z0-9-+.]+);base64,/i;
	const matches = base64Pattern.exec(data);
	if (!matches) throw new Error("Invalid base64 data");

	const contentType = matches[1];
	
	if (type && !contentType.includes(type)) {
		throw new Error("Invalid content type");
	}

	const base64Data = data.replace(/^data:([a-z]+\/[a-z0-9-+.]+);base64,/i, "");
	const decodedData = atob(base64Data);
	const arrayBuffer = new ArrayBuffer(decodedData.length);
	const uint8Array = new Uint8Array(arrayBuffer);

	for (let i = 0; i < decodedData.length; i++) {
		uint8Array[i] = decodedData.charCodeAt(i);
	}

	const maxSize = maxMB * 1024 * 1024;
	if (arrayBuffer.byteLength > maxSize) {
		throw new Error(`File size exceeds the maximum limit of ${maxMB}MB`);
	}

	return new File([arrayBuffer], "base64_file", { type: contentType });
}

async function handleUrlData(
	url: string,
	maxMB: number,
	type?: ModerationType,
): Promise<File> {
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
}
