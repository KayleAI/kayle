export default function MagicLinkEmail({ url }: { readonly url: string }) {
	return (
		<main>
			<h1>Magic Link</h1>
			<p>Click the link below to sign in to your account.</p>
			<a href={url}>{url}</a>
		</main>
	);
}
