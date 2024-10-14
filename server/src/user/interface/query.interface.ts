export interface UserQuery {
  page: number
  pageSize: number
  id?: number
  sort?: string
  state?: string
  from?: string
  to?: string
}