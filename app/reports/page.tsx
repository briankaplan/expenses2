import { ExpenseReport } from '@/components/reports/expense-report'
import { ReportsDashboard } from '@/components/reports/reports-dashboard'

export default function ReportsPage() {
  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Expense Reports</h1>
          <p className="text-muted-foreground">
            Analyze your expenses and generate reports
          </p>
        </div>

        <ReportsDashboard />
      </div>
    </div>
  )
} 