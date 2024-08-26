export function newUrl({
	organisationSlug,
	url,
}: {
	readonly organisationSlug: string;
	readonly url: string;
}): string {
	return url.replace("_", organisationSlug);
}
