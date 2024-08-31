/**
 * Two-way encryption of a piece of text using AES-256-GCM.
 *
 * @param text - Text to encrypt
 * @param key - Key to encrypt with
 * @returns Encrypted text
 */
export async function encrypt(text: string, key: string) {
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(key),
		{ name: "AES-GCM" },
		false,
		["encrypt"],
	);

	const iv = crypto.getRandomValues(new Uint8Array(12));

	const encryptedData = await crypto.subtle.encrypt(
		{
			name: "AES-GCM",
			iv: iv,
		},
		cryptoKey,
		new TextEncoder().encode(text),
	);

	const combined = new Uint8Array(iv.length + encryptedData.byteLength);
	combined.set(iv, 0);
	combined.set(new Uint8Array(encryptedData), iv.length);

	return btoa(String.fromCharCode(...combined));
}
