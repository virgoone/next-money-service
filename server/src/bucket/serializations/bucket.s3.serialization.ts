import { Type } from 'class-transformer'

import { ApiProperty } from '@nestjs/swagger'

import { faker } from '@faker-js/faker'

export class BucketS3Serialization {
  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.system.directoryPath(),
  })
  @Type(() => String)
  path: string

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.system.filePath(),
  })
  @Type(() => String)
  pathWithFilename: string

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.system.fileName(),
  })
  @Type(() => String)
  filename: string

  @ApiProperty({
    required: true,
    nullable: false,
    example: `${faker.internet.url()}/${faker.system.filePath()}`,
  })
  @Type(() => String)
  completedUrl: string

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.internet.url(),
  })
  @Type(() => String)
  baseUrl: string

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.system.mimeType(),
  })
  @Type(() => String)
  mime: string

  bucket?: string

  type?: string
}
