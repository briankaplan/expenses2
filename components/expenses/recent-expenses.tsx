'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category?: string
  merchant?: string
}

export function RecentExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/expenses/recent')
      .then(res => res.json())
      .then(data => {
        setExpenses(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Recent expenses error:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Recent Expenses</h2>
        <Link 
          href="/expenses" 
          className="text-sm text-muted-foreground hover:text-primary"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div>
              <p className="font-medium">{expense.description}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(expense.amount)}
              </p>
              {expense.category && (
                <p className="text-sm text-muted-foreground">
                  {expense.category}
                </p>
              )}
            </div>
          </div>
        ))}

        {expenses.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No recent expenses
          </p>
        )}
      </div>
    </Card>
  )
} 