import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create some sample expenses
  await prisma.expense.createMany({
    data: [
      {
        date: new Date('2024-01-15'),
        description: 'Office Supplies',
        amount: 125.50,
        category: 'business',
        merchant: 'Staples'
      },
      {
        date: new Date('2024-01-14'),
        description: 'Client Lunch',
        amount: 85.75,
        category: 'business',
        merchant: 'Restaurant'
      }
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 