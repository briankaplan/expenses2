'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'

interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category?: string
  merchant?: string
}

export function FastViewer() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUncategorizedExpenses()
  }, [])

  async function loadUncategorizedExpenses() {
    try {
      setLoading(true)
      const response = await fetch('/api/expenses/uncategorized')
      if (!response.ok) throw new Error('Failed to load expenses')
      const data = await response.json()
      setExpenses(data)
    } catch (error) {
      console.error('Fast viewer error:', error)
      toast({
        title: 'Error',
        description: 'Failed to load uncategorized expenses',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function categorizeExpense(expenseId: string, category: string) {
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      })

      if (!response.ok) throw new Error('Failed to update expense')

      // Move to next expense
      setCurrentIndex(i => i + 1)
      toast({
        title: 'Success',
        description: 'Expense categorized successfully',
      })
    } catch (error) {
      console.error('Categorization error:', error)
      toast({
        title: 'Error',
        description: 'Failed to categorize expense',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    )
  }

  if (expenses.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No uncategorized expenses found
        </div>
      </Card>
    )
  }

  const currentExpense = expenses[currentIndex]
  if (!currentExpense) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          All expenses have been categorized!
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">
            Expense {currentIndex + 1} of {expenses.length}
          </h3>
          <p className="text-sm text-muted-foreground">
            Quick categorize your expenses
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Description</label>
            <p className="text-lg">{currentExpense.description}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Amount</label>
            <p className="text-lg">{formatCurrency(currentExpense.amount)}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Date</label>
            <p className="text-lg">
              {new Date(currentExpense.date).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              onValueChange={(value) => categorizeExpense(currentExpense.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="skip">Skip for Now</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(i => i - 1)}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(i => i + 1)}
            disabled={currentIndex === expenses.length - 1}
          >
            Skip
          </Button>
        </div>
      </div>
    </Card>
  )
} 