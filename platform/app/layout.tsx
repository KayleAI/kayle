import "@repo/ui/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "./providers";
import clsx from "clsx";
import { GenerateSEO } from "@/components/marketing/GenerateSEO";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const monaSans = localFont({
	src: "../fonts/Mona-Sans.woff2",
	display: "swap",
	variable: "--font-mona-sans",
	weight: "200 900",
});

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
				inter.variable,
				monaSans.variable,
			)}
			suppressHydrationWarning
		>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
