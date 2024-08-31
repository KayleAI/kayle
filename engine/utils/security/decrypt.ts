/**
 * Decrypt a piece of text using AES-256-GCM.
 *
 * @param text - Text to decrypt
 * @param key - Key to decrypt with
 * @returns Decrypted text
 */
export async function decrypt(encryptedText: string, key: string) {
	const combined = Uint8Array.from(atob(encryptedText), (c) => c.charCodeAt(0));

	const iv = combined.slice(0, 12);
	const encryptedData = combined.slice(12);

	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(key),
		{ name: "AES-GCM" },
		false,
		["decrypt"],
	);

	const decryptedData = await crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv: iv,
		},
		cryptoKey,
		encryptedData,
	);

	return new TextDecoder().decode(decryptedData);
}
