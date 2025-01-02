import { Card } from '@/components/ui/card'
import { RecentExpenses } from '@/components/expenses/recent-expenses'
import { ExpenseStats } from '@/components/expenses/expense-stats'

export default function HomePage() {
  console.log('Rendering HomePage') // Debug log

  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome to E34A Dashboard</h1>
          <p className="text-muted-foreground">
            Your financial management solution
          </p>
        </div>
      </div>
    </div>
  )
} 