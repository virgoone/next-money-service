import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty({ type: String })
  id?: string

  @ApiProperty()
  email: string

  @ApiProperty()
  avatar: string

  @ApiProperty()
  name: string

  @ApiProperty()
  phone: string

  @ApiProperty()
  state: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
