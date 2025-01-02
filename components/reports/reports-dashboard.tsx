'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExpenseReport } from './expense-report'
import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalExpenses: number
  businessExpenses: number
  personalExpenses: number
  uncategorizedCount: number
  recentTransactions: Array<{
    id: string
    date: string
    description: string
    amount: number
    category?: string
  }>
}

export function ReportsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const loadStats = async () => {
    try {
      const response = await fetch('/api/reports/stats')
      if (!response.ok) throw new Error('Failed to load stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Stats error:', error)
    }
  }

  // Load stats on mount
  useEffect(() => {
    loadStats()
  }, [])

  return (
    <div className="space-y-8">
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(stats.totalExpenses)}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Business Expenses
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(stats.businessExpenses)}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Personal Expenses
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(stats.personalExpenses)}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Uncategorized
            </h3>
            <p className="text-2xl font-bold">
              {stats.uncategorizedCount}
            </p>
          </Card>
        </div>
      )}

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="reports" className="space-y-4">
          <ExpenseReport />
        </TabsContent>
        <TabsContent value="recent">
          {stats?.recentTransactions && (
            <Card className="p-6">
              <div className="space-y-4">
                {stats.recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(tx.amount)}
                      </p>
                      {tx.category && (
                        <p className="text-sm text-muted-foreground">
                          {tx.category}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 