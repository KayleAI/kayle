import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { GenerateSEO } from "@/components/marketing/GenerateSEO";

export const metadata: Metadata = GenerateSEO({
	title: "Our Blog",
	description: "Everything content moderation, all in one place.",
	url: "https://kayle.ai/blog",
});

export default function Layout({
	children,
}: {
	readonly children: React.ReactNode;
}): JSX.Element {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
