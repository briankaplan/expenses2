import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get total expenses
    const [
      totalExpenses,
      businessExpenses,
      personalExpenses,
      uncategorizedCount,
      recentTransactions
    ] = await Promise.all([
      prisma.expense.aggregate({
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: { category: 'business' },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: { category: 'personal' },
        _sum: { amount: true }
      }),
      prisma.expense.count({
        where: { category: null }
      }),
      prisma.expense.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          date: true,
          description: true,
          amount: true,
          category: true
        }
      })
    ])

    return NextResponse.json({
      totalExpenses: totalExpenses._sum.amount || 0,
      businessExpenses: businessExpenses._sum.amount || 0,
      personalExpenses: personalExpenses._sum.amount || 0,
      uncategorizedCount,
      recentTransactions: recentTransactions.map(tx => ({
        ...tx,
        date: tx.date.toISOString()
      }))
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to load stats' },
      { status: 500 }
    )
  }
} 