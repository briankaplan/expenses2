import { Inter } from 'next/font/google'
import { AppShell } from '@/components/layout/AppShell'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { AuthLayout } from '@/components/auth/auth-layout'
import { UserMenu } from '@/components/auth/user-menu'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'E34A Dashboard',
  description: 'Financial statement and receipt management dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppShell>
              <AuthLayout>
                {children}
              </AuthLayout>
            </AppShell>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 