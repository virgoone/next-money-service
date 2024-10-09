import { IsNotEmpty, IsString, Length, IsStrongPassword } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class BindPasswordDto {
  @ApiProperty({
    description: 'password',
    example: 'laf-user',
  })
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: 'confirm password',
    example: 'laf-user',
  })
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  confirmPassword: string

  @ApiProperty({
    description: 'old password',
    example: 'laf-user',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 32)
  oldPassword: string
}
