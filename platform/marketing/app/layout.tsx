import "@repo/ui/globals.css";

import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Kayle - open-source real-time content moderation platform",
    template: "%s - Kayle",
  },
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
