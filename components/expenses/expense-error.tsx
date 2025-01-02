'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ExpenseErrorProps {
  error: Error
  reset: () => void
}

export function ExpenseError({ error, reset }: ExpenseErrorProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error loading expenses</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 