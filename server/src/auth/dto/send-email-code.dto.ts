import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { VerifyCodeType } from '../type'

export class SendEmailCodeDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: 'verify code type',
    enum: VerifyCodeType,
  })
  @IsNotEmpty()
  @IsEnum(VerifyCodeType)
  type: VerifyCodeType
}
