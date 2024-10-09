export interface ClerkUserQuery {
  page: number
  pageSize: number
  userId?: string
  from?: string
  to?: string
  operator?: 'or' | 'and'
}