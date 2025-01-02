import { prisma } from '@/lib/db'
import { FastViewer } from '@/components/expenses/fast-viewer'

export default async function FastViewerPage() {
  const expenses = await prisma.expense.findMany({
    where: {
      category: null // Only uncategorized expenses
    },
    include: {
      receipt: {
        select: {
          fileUrl: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    }
  })

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Fast Expense Categorization</h1>
          <p className="text-muted-foreground">
            Quickly categorize expenses as personal or business
          </p>
        </div>

        <FastViewer expenses={expenses} />
      </div>
    </div>
  )
} 