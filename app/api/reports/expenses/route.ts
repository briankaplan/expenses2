import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { startDate, endDate, type } = await request.json()

    const where = {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate)
      },
      ...(type !== 'all' && { category: type })
    }

    // Get all expenses in date range
    const expenses = await prisma.expense.findMany({
      where,
      select: {
        amount: true,
        category: true,
        date: true
      }
    })

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const businessExpenses = expenses
      .filter(exp => exp.category === 'business')
      .reduce((sum, exp) => sum + exp.amount, 0)
    const personalExpenses = expenses
      .filter(exp => exp.category === 'personal')
      .reduce((sum, exp) => sum + exp.amount, 0)
    const uncategorizedExpenses = expenses
      .filter(exp => !exp.category)
      .reduce((sum, exp) => sum + exp.amount, 0)

    // Group by category
    const byCategory = Object.entries(
      expenses.reduce((acc, exp) => {
        const cat = exp.category || 'uncategorized'
        if (!acc[cat]) acc[cat] = { amount: 0, count: 0 }
        acc[cat].amount += exp.amount
        acc[cat].count++
        return acc
      }, {} as Record<string, { amount: number; count: number }>)
    ).map(([category, data]) => ({
      category,
      ...data
    }))

    // Group by month
    const byMonth = Object.entries(
      expenses.reduce((acc, exp) => {
        const month = exp.date.toLocaleString('default', { month: 'short' })
        if (!acc[month]) {
          acc[month] = { month, business: 0, personal: 0 }
        }
        if (exp.category === 'business') {
          acc[month].business += exp.amount
        } else if (exp.category === 'personal') {
          acc[month].personal += exp.amount
        }
        return acc
      }, {} as Record<string, { month: string; business: number; personal: number }>)
    ).map(([_, data]) => data)

    return NextResponse.json({
      totalExpenses,
      businessExpenses,
      personalExpenses,
      uncategorizedExpenses,
      byCategory,
      byMonth
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
} 