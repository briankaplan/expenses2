import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        receipt: null
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        receipt: true
      }
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
} 