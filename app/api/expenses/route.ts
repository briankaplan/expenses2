import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category ? { category } : {}

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: {
        date: 'desc'
      },
      include: {
        receipt: {
          select: {
            fileUrl: true
          }
        }
      }
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Expenses API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
} 