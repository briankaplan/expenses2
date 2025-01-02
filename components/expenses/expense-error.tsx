'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function ExpenseError({ 
  error, 
  reset 
}: { 
  error: Error
  reset: () => void 
}) {
  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-red-500">
          Failed to load expenses
        </h3>
        <p className="text-sm text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </Card>
  )
} 