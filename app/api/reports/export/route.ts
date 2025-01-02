import { NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { Parser } from 'json2csv'
import { formatCurrency } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const { data, type } = await request.json()

    if (type === 'csv') {
      const fields = [
        'date',
        'description',
        'amount',
        'category',
        'merchant',
      ]
      const parser = new Parser({ fields })
      const csv = parser.parse(data)
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=expenses.csv'
        }
      })
    }

    if (type === 'pdf') {
      const doc = new PDFDocument()
      const chunks: Buffer[] = []

      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', () => {
        const result = Buffer.concat(chunks)
        return new NextResponse(result, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=expenses.pdf'
          }
        })
      })

      // Add content to PDF
      doc.fontSize(20).text('Expense Report', { align: 'center' })
      doc.moveDown()

      // Add summary
      doc.fontSize(14).text('Summary')
      doc.moveDown(0.5)
      doc.fontSize(12)
      doc.text(`Total Expenses: ${formatCurrency(data.totalExpenses)}`)
      doc.text(`Business Expenses: ${formatCurrency(data.businessExpenses)}`)
      doc.text(`Personal Expenses: ${formatCurrency(data.personalExpenses)}`)
      doc.moveDown()

      // Add category breakdown
      doc.fontSize(14).text('Category Breakdown')
      doc.moveDown(0.5)
      doc.fontSize(12)
      data.byCategory.forEach((cat: any) => {
        doc.text(`${cat.category}: ${formatCurrency(cat.amount)} (${cat.count} items)`)
      })

      doc.end()
    }

    return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
} 