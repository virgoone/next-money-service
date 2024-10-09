import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class EmailSigninDto {
  @ApiProperty({
    description: 'email',
    example: 'me@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({})
  @IsNotEmpty()
  @Length(6, 6)
  code: string

  @ApiProperty({
    description: 'username',
    example: 'suite-user',
  })
  @IsOptional()
  @IsString()
  @Length(3, 64)
  username: string

  @ApiProperty({
    description: 'password, 8-64 characters',
    example: 'suite-user-password',
  })
  @IsOptional()
  @IsString()
  @Length(8, 64)
  password: string

  @ApiPropertyOptional({
    description: 'invite code',
    example: 'iLeMi7x',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\S+$/, { message: 'invalid characters' })
  inviteCode: string
}
