import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const receipts = await prisma.receipt.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        expense: {
          select: {
            amount: true,
            description: true,
            date: true
          }
        }
      }
    })

    return NextResponse.json(receipts)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch receipts' },
      { status: 500 }
    )
  }
} 