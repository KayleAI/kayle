import '@repo/ui/styles/tailwind.css';

import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { Providers } from "./providers";
import clsx from 'clsx';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const monaSans = localFont({
  src: '../fonts/Mona-Sans.var.woff2',
  display: 'swap',
  variable: '--font-mona-sans',
  weight: '200 900',
})

export const metadata: Metadata = {
  title: {
    default: "Kayle",
    template: "%s - Kayle",
  },
  description: "",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): JSX.Element {
  return (
    <html
      lang="en"
      className={clsx(
        "h-full antialiased",
        "bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950",
        inter.variable,
        monaSans.variable
      )}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
