'use client'

import { useAuth } from '@/lib/auth-context'
import { AuthForm } from './auth-form'
import { Loading } from '@/components/ui/loading'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return (
      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">
            Sign in to continue
          </h1>
          <AuthForm />
        </div>
      </div>
    )
  }

  return <>{children}</>
} 