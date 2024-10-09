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

export interface ChargeOrderQuery {
  page: number
  pageSize: number
  userId?: string
  channel?: string
  id?: number
  sort?: string
  state?: string
  from?: string
  to?: string
}