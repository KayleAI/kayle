export function getFileNameFromResponse(headers: Headers): string | null {
	const contentDisposition = headers.get("content-disposition");
	if (contentDisposition) {
		const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
		if (fileNameMatch) {
			return fileNameMatch[1];
		}
	}
	return null;
}