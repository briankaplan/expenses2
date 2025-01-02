'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface ExpenseStats {
  expenses: Array<{
    date: string
    amount: number
    category: string
  }>
}

export function ExpenseStats({ expenses }: ExpenseStats) {
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {} as Record<string, number>)

    const monthlyData = expenses.reduce((acc, exp) => {
      const month = new Date(exp.date).toLocaleString('default', { month: 'short' })
      acc[month] = (acc[month] || 0) + exp.amount
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      byCategory,
      monthlyData: Object.entries(monthlyData).map(([month, amount]) => ({
        month,
        amount
      }))
    }
  }, [expenses])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Monthly Spending</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Spending by Category</h3>
        <div className="space-y-2">
          {Object.entries(stats.byCategory).map(([category, amount]) => (
            <div key={category} className="flex justify-between">
              <span className="capitalize">{category}</span>
              <span>{formatCurrency(amount)}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-semibold">
            <div className="flex justify-between">
              <span>Total</span>
              <span>{formatCurrency(stats.total)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 