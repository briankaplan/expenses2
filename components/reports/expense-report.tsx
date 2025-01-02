'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { ExportButton } from './export-button'

interface ExpenseReport {
  totalExpenses: number
  businessExpenses: number
  personalExpenses: number
  uncategorizedExpenses: number
  byCategory: {
    category: string
    amount: number
    count: number
  }[]
  byMonth: {
    month: string
    business: number
    personal: number
  }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function ExpenseReport() {
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(new Date().getFullYear(), 0, 1), // Start of current year
    new Date()
  ])
  const [reportType, setReportType] = useState<'all' | 'business' | 'personal'>('all')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<ExpenseReport | null>(null)

  const loadReport = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/reports/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
          type: reportType
        })
      })
      
      if (!response.ok) throw new Error('Failed to load report')
      const data = await response.json()
      setReport(data)
    } catch (error) {
      console.error('Report error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Select
            value={reportType}
            onValueChange={(value: typeof reportType) => setReportType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Expenses</SelectItem>
              <SelectItem value="business">Business Only</SelectItem>
              <SelectItem value="personal">Personal Only</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadReport} disabled={loading}>
            Generate Report
          </Button>
        </div>
        {report && (
          <div className="flex gap-2">
            <ExportButton
              data={report}
              type="csv"
              filename={`expenses-${reportType}-${new Date().toISOString().split('T')[0]}`}
              disabled={loading}
            />
            <ExportButton
              data={report}
              type="pdf"
              filename={`expenses-${reportType}-${new Date().toISOString().split('T')[0]}`}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {report && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Expenses</span>
                <span className="font-semibold">{formatCurrency(report.totalExpenses)}</span>
              </div>
              <div className="flex justify-between">
                <span>Business Expenses</span>
                <span className="font-semibold">{formatCurrency(report.businessExpenses)}</span>
              </div>
              <div className="flex justify-between">
                <span>Personal Expenses</span>
                <span className="font-semibold">{formatCurrency(report.personalExpenses)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Uncategorized</span>
                <span>{formatCurrency(report.uncategorizedExpenses)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={report.byCategory}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {report.byCategory.map((entry, index) => (
                      <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.byMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="business" fill="#0088FE" name="Business" />
                  <Bar dataKey="personal" fill="#00C49F" name="Personal" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
} 