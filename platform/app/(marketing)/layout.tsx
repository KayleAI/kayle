import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { GenerateSEO } from "@/components/marketing/GenerateSEO";

export const metadata: Metadata = GenerateSEO({
	title: "Content Moderation made Simple",
	description: "An all-in-one, easy-to-use, and affordable content moderation platform built for startups and enterprises.",
	url: "https://kayle.ai",
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
