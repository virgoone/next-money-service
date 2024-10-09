import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { locales } from '@/app/constants/app.constant'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  IsIn,
  IsNumber,
  IsArray,
} from 'class-validator'

export class ChargeProductUpdateDto {
  @ApiProperty({ minimum: 100 })
  @IsOptional()
  @IsNumber()
  amount: number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  originalAmount: number

  @ApiProperty({ minimum: 0 })
  @IsOptional()
  @IsNumber()
  credit: number

  @ApiProperty({ enum: ['USD', 'CNY'] })
  @IsIn(['USD', 'CNY'])
  @IsString()
  @IsOptional()
  currency: string

  @ApiProperty({ enum: locales })
  @IsIn(locales)
  @IsString()
  @IsOptional()
  locale: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string

  @ApiPropertyOptional({ type: [String], description: '标签' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tag?: string[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string

  @ApiProperty({ enum: ["enable", "disabled"] })
  @IsIn(["enable", "disabled"])
  @IsString()
  @IsOptional()
  state: string
}
