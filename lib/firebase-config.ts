// Add caching to reduce reads
export const CACHE_TIME = 5 * 60 * 1000 // 5 minutes
export const BATCH_SIZE = 20 // Limit batch operations

// Collection names
export const COLLECTIONS = {
  EXPENSES: 'expenses',
  RECEIPTS: 'receipts',
  USERS: 'users'
} as const

// Storage paths
export const STORAGE_PATHS = {
  RECEIPTS: 'receipts'
} as const

// Query limits to stay within free tier
export const QUERY_LIMITS = {
  MAX_EXPENSES: 50, // Reduced to stay well within daily limits
  MAX_RECEIPTS: 20
} as const

// File limits
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB max file size
  MAX_WIDTH: 1024, // Max image width
  COMPRESSION_QUALITY: 0.8 // Image compression quality
} as const 