import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ChargeProductDto {
  @ApiProperty({ type: String })
  id?: string

  @ApiProperty()
  amount: number

  @ApiProperty()
  originalAmount: number

  @ApiProperty()
  credit: number

  @ApiProperty()
  currency: string

  @ApiProperty()
  locale: string

  @ApiProperty()
  title: string

  @ApiPropertyOptional()
  tag?: any

  @ApiPropertyOptional()
  message?: string

  @ApiProperty()
  state: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
