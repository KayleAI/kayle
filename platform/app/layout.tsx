import "@/styles/globals.css";

import type { Metadata } from "next";
import { Providers } from "./providers";
import clsx from "clsx";
import { GenerateSEO } from "@/components/marketing/GenerateSEO";

export const metadata: Metadata = GenerateSEO({
	title: "Kayle",
	description: "Content moderation made simple.",
	url: "https://kayle.ai",
});

export default function RootLayout({
	children,
}: {
	readonly children: React.ReactNode;
}): JSX.Element {
	return (
		<html
			lang="en"
			className={clsx(
				"h-full antialiased font-display",
				"bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950",
			)}
			suppressHydrationWarning
		>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
