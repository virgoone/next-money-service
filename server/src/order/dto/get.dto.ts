import { UserJSON } from '@clerk/backend'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GiftCodeDto {
  @ApiProperty({ type: String })
  id?: string

  @ApiProperty()
  code: string

  @ApiProperty()
  creditAmount: number

  @ApiProperty()
  used?: boolean

  @ApiProperty()
  usedBy?: string

  @ApiProperty()
  usedAt: Date

  @ApiProperty()
  transactionId?: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  expiredAt?: Date
}

export class ChargeOrderDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  amount: number

  @ApiProperty()
  credit: number

  @ApiProperty()
  phase: string

  @ApiProperty()
  channel: string

  @ApiProperty()
  currency: string

  @ApiPropertyOptional()
  paymentAt?: Date

  @ApiPropertyOptional()
  result?: any

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiPropertyOptional({
    type: Object,
  })
  user?: UserJSON

  @ApiPropertyOptional({
    type: Object,
  })
  userInfo?: {
    name?: string
    email?: string
    fullName?: string
  }
}
