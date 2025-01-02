import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db'

export async function GET() {
  const isDatabaseConnected = await checkDatabaseConnection()

  if (!isDatabaseConnected) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed'
    }, { status: 500 })
  }

  return NextResponse.json({
    status: 'ok',
    database: 'connected'
  })
} 