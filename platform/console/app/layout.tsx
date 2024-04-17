import "@repo/ui/globals.css";

import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';

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
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
