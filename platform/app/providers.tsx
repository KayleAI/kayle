'use client'

import AuthProvider from 'utils/auth/AuthProvider'
import OrgProvider from 'utils/auth/OrgProvider'
import { ThemeProvider, useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner';

export function Providers({ children }: { readonly children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OrgProvider>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </OrgProvider>
    </AuthProvider>
  )
}

export function Toaster() {
  const { resolvedTheme } = useTheme();

  if (!resolvedTheme) return null;

  return (
    <Sonner
      richColors
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  )
}