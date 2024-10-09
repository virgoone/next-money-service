import { IsEmail, IsNotEmpty, Length } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class BindEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'verify code',
    example: '032476',
  })
  @IsNotEmpty()
  @Length(6, 6)
  code: string

  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  @IsNotEmpty()
  password: string
}
