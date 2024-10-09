import { Type } from 'class-transformer'

import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty, getSchemaPath } from '@nestjs/swagger'

import { BucketS3Serialization } from '@/bucket/serializations/bucket.s3.serialization'
import { faker } from '@faker-js/faker'

export class BucketS3MultipartPartsSerialization {
  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.string.alpha({ length: 10, casing: 'upper' }),
    description: 'ETag from aws after init multipart',
  })
  @Type(() => String)
  ETag: string

  @ApiProperty({
    required: true,
    nullable: false,
    example: 1,
  })
  @Type(() => Number)
  PartNumber: number
}

export class BucketS3MultipartSerialization extends PartialType(
  BucketS3Serialization,
) {
  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.string.alpha({ length: 20, casing: 'upper' }),
    description: 'Upload id from aws after init multipart',
  })
  @Type(() => String)
  uploadId: string

  @ApiProperty({
    required: false,
    nullable: true,
    example: 1,
    description: 'Last part number uploaded',
  })
  @Type(() => Number)
  partNumber?: number

  @ApiProperty({
    required: false,
    nullable: true,
    example: 200,
    description: 'Max part number, or length of the chunk',
  })
  @Type(() => Number)
  maxPartNumber?: number

  @ApiProperty({
    required: false,
    nullable: true,
    oneOf: [
      {
        $ref: getSchemaPath(BucketS3MultipartPartsSerialization),
        type: 'array',
      },
    ],
  })
  @Type(() => BucketS3MultipartPartsSerialization)
  parts?: BucketS3MultipartPartsSerialization[]
}
