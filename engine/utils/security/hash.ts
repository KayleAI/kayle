/**
 * Hashes either a string or a File.
 *
 * @param content - Either a string or a File.
 * @returns The hexadecimal hash of the content.
 */
export async function hash(content: string | File): Promise<string> {
	if (typeof content === "string") {
		const encoder = new TextEncoder();
		const data = encoder.encode(content);

		const hashBuffer = await crypto.subtle.digest("SHA-256", data);

		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");

		return hashHex;
	}

	if (content instanceof File) {
		const arrayBuffer = await content.arrayBuffer();
		const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");
		return hashHex;
	}

	return "";
}
