import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { uploadToR2 } from '@/lib/r2'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const source = formData.get('source') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload to R2
    const fileUrl = await uploadToR2(file, 'statements')

    // Create statement record
    const statement = await prisma.statement.create({
      data: {
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        source
      }
    })

    return NextResponse.json(statement)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload statement' },
      { status: 500 }
    )
  }
} 