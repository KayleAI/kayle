import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
	title: {
		default: "Kayle Support - Open-source content moderation platform",
		template: "%s - Kayle Support",
	},
	description: "Get help with Kayle.",
};

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
