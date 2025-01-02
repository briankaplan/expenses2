import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const stats = await prisma.expense.aggregate({
      _sum: {
        amount: true
      },
      _count: {
        _all: true
      }
    })

    return NextResponse.json({
      totalExpenses: stats._sum.amount || 0,
      totalCount: stats._count._all || 0
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 