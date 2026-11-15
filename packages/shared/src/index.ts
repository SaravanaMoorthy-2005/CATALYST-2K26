// Schemas
export * from './schemas/index'

// Utility types
export type Timestamp = string // ISO 8601 datetime string

export type FirestoreId = string

export interface PaginatedResult<T> {
  items: T[]
  total: number
  hasMore: boolean
  cursor?: string
}

// Error codes shared between functions and web
export const ErrorCodes = {
  UNAUTHENTICATED: 'unauthenticated',
  PERMISSION_DENIED: 'permission-denied',
  NOT_FOUND: 'not-found',
  ALREADY_EXISTS: 'already-exists',
  INVALID_ARGUMENT: 'invalid-argument',
  INTERNAL: 'internal',
  UNAVAILABLE: 'unavailable',
  RESOURCE_EXHAUSTED: 'resource-exhausted',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]
