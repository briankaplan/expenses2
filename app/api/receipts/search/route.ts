import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json([])
    }

    const receipts = await prisma.receipt.findMany({
      where: {
        OR: [
          { fileName: { contains: query, mode: 'insensitive' } },
          { expense: { description: { contains: query, mode: 'insensitive' } } }
        ]
      },
      include: {
        expense: true
      }
    })

    return NextResponse.json(receipts)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search receipts' },
      { status: 500 }
    )
  }
} 