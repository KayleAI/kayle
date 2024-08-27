export function newUrl({
	replace,
	url,
}: {
	readonly replace: string;
	readonly url: string;
}): string {
	return url.replace("_", replace);
}
