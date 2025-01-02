'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'

interface Receipt {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  createdAt: string
  expense?: {
    amount: number
    description: string
    date: string
  }
}

export function ReceiptList() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadReceipts() {
      try {
        const response = await fetch('/api/receipts')
        if (!response.ok) throw new Error('Failed to load receipts')
        const data = await response.json()
        setReceipts(data)
      } catch (error) {
        console.error('Receipts error:', error)
        setError(error instanceof Error ? error : new Error('Failed to load receipts'))
      } finally {
        setLoading(false)
      }
    }

    loadReceipts()
  }, [])

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          {error.message}
        </div>
      </Card>
    )
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Expense</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell>
                  {new Date(receipt.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{receipt.fileName}</TableCell>
                <TableCell>
                  {receipt.expense?.description || '—'}
                </TableCell>
                <TableCell>
                  {receipt.expense ? formatCurrency(receipt.expense.amount) : '—'}
                </TableCell>
                <TableCell>
                  <a
                    href={receipt.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {receipts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No receipts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
} 