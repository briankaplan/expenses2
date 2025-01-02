import { ReceiptList } from '@/components/receipts/receipt-list'
import { UploadReceipt } from '@/components/receipts/upload-receipt'

export default function ReceiptsPage() {
  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Receipts</h1>
          <p className="text-muted-foreground">
            Upload and manage your receipts
          </p>
        </div>

        <UploadReceipt />
        <ReceiptList />
      </div>
    </div>
  )
} 