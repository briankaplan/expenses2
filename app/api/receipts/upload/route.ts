import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { uploadToR2 } from '@/lib/r2'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const expenseId = formData.get('expenseId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload to R2
    const fileUrl = await uploadToR2(file, 'receipts')

    // Create receipt record
    const receipt = await prisma.receipt.create({
      data: {
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        expenseId
      }
    })

    return NextResponse.json(receipt)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload receipt' },
      { status: 500 }
    )
  }
} 