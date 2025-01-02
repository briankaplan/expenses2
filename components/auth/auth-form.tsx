'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
        toast({ title: 'Account created successfully' })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast({ title: 'Signed in successfully' })
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast({
        title: 'Error',
        description: 'Authentication failed',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast({ title: 'Signed in with Google' })
    } catch (error) {
      console.error('Google auth error:', error)
      toast({
        title: 'Error',
        description: 'Google sign in failed',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="p-6 w-full max-w-sm mx-auto">
      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold text-center">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        
        <div className="space-y-2">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            disabled={loading}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        </Button>
      </form>
    </Card>
  )
} 