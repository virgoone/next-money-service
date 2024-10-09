export enum StatusEnum {
  Active = 'enable', //启用
  Inactive = 'disable', //禁用
}

export interface ChargeProductDto {
  amount: number
  originalAmount: number
  credit: number
  currency: string
  locale: string
  title: string
  tag: any
  message: string
  state: string
  createdAt: string
  updatedAt: string
  id?: string
}

export const StatusEnumText = {
  [StatusEnum.Active]: '已启用',
  [StatusEnum.Inactive]: '已禁用',
}

export const StatusEnumOptions = [
  {
    value: -1,
    label: '全部',
  },
  ...Object.keys(StatusEnumText).map((key) => ({
    value: key,
    label: StatusEnumText[key as unknown as StatusEnum],
  })),
]
