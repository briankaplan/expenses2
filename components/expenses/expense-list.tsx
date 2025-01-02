'use client'

import { useState, useEffect, useCallback } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { COLLECTIONS, QUERY_LIMITS, CACHE_TIME } from '@/lib/firebase-config'
import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExpenseError } from './expense-error'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'

interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category?: string
  merchant?: string
  receiptUrl?: string
}

export function ExpenseList() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Cache key based on user
  const cacheKey = `expenses_${user?.uid}`

  const loadExpenses = useCallback(async () => {
    // Check cache first
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_TIME) {
        setExpenses(data)
        setLoading(false)
        return
      }
    }

    // Real-time subscription with limit
    const q = query(
      collection(db, COLLECTIONS.EXPENSES),
      orderBy('date', 'desc'),
      limit(QUERY_LIMITS.MAX_EXPENSES)
    )
    
    return onSnapshot(q, (snapshot) => {
      const expenseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[]
      
      // Update cache
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data: expenseData,
        timestamp: Date.now()
      }))
      
      setExpenses(expenseData)
      setLoading(false)
    })
  }, [user?.uid])

  useEffect(() => {
    if (!user) return
    const unsubscribe = loadExpenses()
    return () => unsubscribe?.()
  }, [loadExpenses, user])

  if (error) {
    return <ExpenseError error={error} reset={loadExpenses} />
  }

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
        <h2 className="text-lg font-semibold">
          All Expenses
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="outline" size="sm">Add Expense</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.category || '—'}</TableCell>
                <TableCell>{expense.merchant || '—'}</TableCell>
                <TableCell>
                  {expense.receiptUrl ? (
                    <a 
                      href={expense.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  ) : '—'}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(expense.amount)}
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No expenses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
} 