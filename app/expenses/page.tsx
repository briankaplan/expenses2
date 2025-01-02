import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExpenseList } from '@/components/expenses/expense-list'
import { FastViewer } from '@/components/expenses/fast-viewer'
import { ExpenseStats } from '@/components/expenses/expense-stats'

export default function ExpensesPage() {
  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">
              Manage and track your expenses
            </p>
          </div>
        </div>

        <ExpenseStats />

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Expenses</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="uncategorized">Uncategorized</TabsTrigger>
            <TabsTrigger value="missing-receipts">Missing Receipts</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ExpenseList />
          </TabsContent>
          <TabsContent value="business">
            <ExpenseList filter="business" />
          </TabsContent>
          <TabsContent value="personal">
            <ExpenseList filter="personal" />
          </TabsContent>
          <TabsContent value="uncategorized">
            <FastViewer />
          </TabsContent>
          <TabsContent value="missing-receipts">
            <ExpenseList filter="missing-receipts" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 