import "@repo/ui/globals.css";

import type { Metadata } from "next";
import { SidebarLayout } from "@repo/ui/sidebar-layout";
import ConsoleSidebar from "@/components/console/Sidebar";
import ConsoleNavbar from "@/components/console/Navbar";

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
    <SidebarLayout
      sidebar={<ConsoleSidebar />}
      navbar={<ConsoleNavbar />}
    >
      {children}
    </SidebarLayout>
  );
}
