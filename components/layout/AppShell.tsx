'use client'

import { MainNav } from '@/components/layout/MainNav'
import { UserMenu } from '@/components/auth/user-menu'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <MainNav />
          <UserMenu />
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 