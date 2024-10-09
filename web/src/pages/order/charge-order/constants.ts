export enum StatusEnum {
  Active = 'enable', //已使用
  Inactive = 'disable', //未使用
}

export interface GiftCodeDto {
  creditAmount: number
  code: number
  used: boolean
  createdAt: string
  usedAt: string
  expiredAt?: string
  id?: string
}

export const StatusEnumText = {
  [StatusEnum.Active]: '未使用',
  [StatusEnum.Inactive]: '已使用',
}

export const StatusEnumOptions = [
  ...Object.keys(StatusEnumText).map((key) => ({
    value: key,
    label: StatusEnumText[key as unknown as StatusEnum],
  })),
]
