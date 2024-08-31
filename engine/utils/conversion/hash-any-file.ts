/**
 * Hashes any file including images, videos, audio, documents, etc.
 *
 * @param file - The file to hash.
 * @returns The hexadecimal hash of the file.
 */
export async function hashAnyFile(file: File) {
	const arrayBuffer = await file.arrayBuffer();
	const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
}
