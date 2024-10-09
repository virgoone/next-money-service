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
  IsBoolean,
} from 'class-validator'

export class GiftCodeCreateDto {
  @ApiProperty()
  @Length(8, 18)
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  creditAmount: number
}
