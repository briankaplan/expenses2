import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      take: 5,
      orderBy: {
        date: 'desc'
      },
      select: {
        id: true,
        date: true,
        description: true,
        amount: true,
        category: true,
        merchant: true
      }
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Recent expenses error:', error)
    return NextResponse.json(
      { error: 'Failed to load recent expenses' },
      { status: 500 }
    )
  }
} 