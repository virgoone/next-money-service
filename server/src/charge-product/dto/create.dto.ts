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

export class ChargeProductCreateDto {
  @ApiProperty({ minimum: 100 })
  @IsNumber()
  @IsNotEmpty()
  amount: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  originalAmount: number

  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @IsNotEmpty()
  credit: number

  @ApiProperty({ enum: ['USD', 'CNY'] })
  @IsIn(['USD', 'CNY'])
  @IsString()
  @IsNotEmpty()
  currency: string

  @ApiProperty({ enum: locales })
  @IsIn(locales)
  @IsString()
  @IsNotEmpty()
  locale: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  state: string
}
