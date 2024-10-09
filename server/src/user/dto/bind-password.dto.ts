import { IsEmail, IsNotEmpty, IsString, Length, IsStrongPassword } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto {
  @ApiProperty({
    description: 'email',
    example: 'laf-user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: 'code',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty({
    description: 'password',
    example: 'laf-user',
  })
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password: string
}

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
