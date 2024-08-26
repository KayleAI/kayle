"use client";

import { SidebarLayout } from "@repo/ui/sidebar-layout";
import ConsoleSidebar from "@/components/layout/sidebar";
import ConsoleNavbar from "@/components/layout/navbar";

export function NavigationProvider({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	return (
		<SidebarLayout sidebar={<ConsoleSidebar />} navbar={<ConsoleNavbar />}>
			{children}
		</SidebarLayout>
	);
}
