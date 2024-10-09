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
