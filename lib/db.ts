import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['error', 'warn', 'info'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully')
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error)
    // Don't exit in development to allow for database recovery
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  })

// Handle cleanup
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database check failed:', error)
    return false
  }
} 