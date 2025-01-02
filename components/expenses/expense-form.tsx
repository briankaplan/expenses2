'use client'

import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { COLLECTIONS } from '@/lib/firebase-schema'
import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ExpenseForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const formData = new FormData(event.currentTarget)
      
      await addDoc(collection(db, COLLECTIONS.EXPENSES), {
        userId: user.uid,
        date: formData.get('date'),
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description'),
        category: formData.get('category'),
        merchant: formData.get('merchant'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      toast({ title: 'Expense added successfully' })
      event.currentTarget.reset()
    } catch (error) {
      console.error('Add expense error:', error)
      toast({
        title: 'Error',
        description: 'Failed to add expense',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Add Expense</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            name="date"
            required
            disabled={loading}
          />
          <Input
            type="number"
            name="amount"
            placeholder="Amount"
            step="0.01"
            required
            disabled={loading}
          />
        </div>

        <Input
          name="description"
          placeholder="Description"
          required
          disabled={loading}
        />

        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="food">Food & Dining</SelectItem>
            <SelectItem value="transport">Transportation</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Input
          name="merchant"
          placeholder="Merchant (optional)"
          disabled={loading}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Expense'}
        </Button>
      </form>
    </Card>
  )
} 