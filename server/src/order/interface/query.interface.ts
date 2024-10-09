export interface GiftCodeQuery {
  page: number
  pageSize: number
  id?: number
  code?: string
  sort?: string
  state?: string
  from?: string
  to?: string
  operator?: 'or' | 'and'
}