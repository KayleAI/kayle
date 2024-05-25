'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { readonly children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      enableSystem
    >
      {children}
    </ThemeProvider>
  )
}
