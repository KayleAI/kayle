import "@repo/ui/globals.css";

import type { Metadata } from "next";

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <div className="max-w-7xl mx-auto min-h-screen px-4 sm:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
