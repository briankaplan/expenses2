import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        category: null,
      },
      orderBy: {
        date: 'desc'
      },
      select: {
        id: true,
        date: true,
        description: true,
        amount: true,
        category: true,
        merchant: true,
        receipt: {
          select: {
            fileUrl: true
          }
        }
      }
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch uncategorized expenses' },
      { status: 500 }
    )
  }
} 