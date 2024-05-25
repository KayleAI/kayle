import "@repo/ui/globals.css";

import type { Metadata } from "next";
import { SidebarLayout } from "@repo/ui/sidebar-layout";
import ConsoleSidebar from "@/components/ConsoleSidebar";
import ConsoleNavbar from "@/components/ConsoleNavbar";

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
    <body>
      <SidebarLayout
        sidebar={<ConsoleSidebar />}
        navbar={<ConsoleNavbar />}
      >
        {children}
      </SidebarLayout>
    </body>
  );
}
