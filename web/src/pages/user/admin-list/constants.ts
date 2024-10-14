export enum StatusEnum {
  Active = 'active', //正常
  Inactive = 'inactive', //禁用
}

export const StatusEnumText = {
  [StatusEnum.Active]: '正常',
  [StatusEnum.Inactive]: '禁用',
}

export const StatusEnumOptions = [
  ...Object.keys(StatusEnumText).map((key) => ({
    value: key,
    label: StatusEnumText[key as unknown as StatusEnum],
  })),
]

export interface AdminUserDto {
  id: string
  name: string
  email: string
  avatar: string
  phone?: string
  createdAt: string
  updatedAt: string
}

