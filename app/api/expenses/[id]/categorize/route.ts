import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { category } = await request.json()

    const expense = await prisma.expense.update({
      where: { id: params.id },
      data: { 
        category,
        metadata: {
          categorizedAt: new Date().toISOString(),
          categorizedBy: 'fast-viewer'
        }
      }
    })

    // Also update the statement entry if it exists
    if (expense.sourceId) {
      await prisma.statementEntry.updateMany({
        where: {
          sourceId: expense.sourceId,
          source: expense.source
        },
        data: { category }
      })
    }

    return NextResponse.json({ success: true, expense })
  } catch (error) {
    console.error('Categorization error:', error)
    return NextResponse.json(
      { error: 'Failed to categorize expense' },
      { status: 500 }
    )
  }
} 