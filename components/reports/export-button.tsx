'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { saveAs } from 'file-saver'

interface ExportButtonProps {
  data: any
  type: 'csv' | 'pdf'
  filename: string
  disabled?: boolean
}

export function ExportButton({ data, type, filename, disabled }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, type })
      })

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      saveAs(blob, `${filename}.${type}`)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || loading}
    >
      <Download className="mr-2 h-4 w-4" />
      Export {type.toUpperCase()}
    </Button>
  )
} 