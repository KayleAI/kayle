'use client'

import AuthProvider from '@/utils/auth/AuthProvider'
import OrgProvider from '@/utils/auth/OrgProvider'
import { ThemeProvider } from 'next-themes'

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
        </ThemeProvider>
      </OrgProvider>
    </AuthProvider>
  )
}
