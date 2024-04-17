import "@repo/ui/globals.css";

import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: {
    default: "Kayle Example Project",
    template: "%s - Kayle Example Project",
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
        {children}
      </body>
    </html>
  );
}
