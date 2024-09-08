export function getFileNameFromResponse(headers: Headers): string | null {
	const contentDisposition = headers.get("content-disposition");
	if (contentDisposition) {
		const fileNameRegex = /filename="?(.+)"?/i;
		const fileNameMatch = fileNameRegex.exec(contentDisposition);
		if (fileNameMatch) {
			return fileNameMatch[1];
		}
	}
	return null;
}
