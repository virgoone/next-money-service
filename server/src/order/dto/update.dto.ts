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

export class GiftCodeUpdateDto {
  @ApiProperty()
  @Length(8, 18)
  @IsString()
  @IsOptional()
  code: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  creditAmount: number
}
