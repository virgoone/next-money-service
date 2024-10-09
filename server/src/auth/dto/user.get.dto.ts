import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class User {
  @ApiProperty({ type: String })
  id?: string

  @ApiProperty()
  name: string

  @ApiPropertyOptional()
  email?: string

  @ApiPropertyOptional()
  phone?: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export class UserWithProfile extends User {
  @ApiPropertyOptional()
  avatar?: string
}

export class UserWithSts {
  @ApiProperty()
  putUrl: string

  @ApiProperty()
  url: string

  @ApiProperty()
  endpoint: string

  @ApiProperty()
  key: string

  @ApiProperty()
  bucket: string
}
