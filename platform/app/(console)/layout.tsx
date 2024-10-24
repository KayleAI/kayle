import type { Metadata } from "next";
import AuthCheckpoint from "@/utils/auth/checkpoint";
import { NavigationProvider } from "@/components/layout/navigation";

export const metadata: Metadata = {
	title: {
		default: "Kayle Console",
		template: "%s - Kayle Console",
	},
	description: "",
};

export default function RootLayout({
	children,
}: {
	readonly children: React.ReactNode;
}): JSX.Element {
	return (
		<AuthCheckpoint ifUnauthenticated={"/sign-in"}>
			<NavigationProvider>{children}</NavigationProvider>
		</AuthCheckpoint>
	);
}
