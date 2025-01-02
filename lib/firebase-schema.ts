// Type definitions for our Firestore collections
export interface Expense {
  id: string
  userId: string
  date: string
  amount: number
  description: string
  category: string
  merchant?: string
  receiptId?: string
  createdAt: string
  updatedAt: string
}

export interface Receipt {
  id: string
  userId: string
  expenseId?: string
  fileUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  createdAt: string
}

export interface Category {
  id: string
  userId: string
  name: string
  type: 'expense' | 'income'
  color: string
  icon: string
  createdAt: string
}

export interface Budget {
  id: string
  userId: string
  categoryId: string
  amount: number
  period: 'monthly' | 'yearly'
  startDate: string
  endDate?: string
  createdAt: string
}

// Collection names in Firestore
export const COLLECTIONS = {
  EXPENSES: 'expenses',
  RECEIPTS: 'receipts',
  CATEGORIES: 'categories',
  BUDGETS: 'budgets',
  USERS: 'users'
} as const 