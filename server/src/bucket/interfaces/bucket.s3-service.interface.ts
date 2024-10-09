import { Readable } from 'stream'

import {
  BucketS3MultipartPartsSerialization,
  BucketS3MultipartSerialization,
} from '@//bucket/serializations/bucket.s3-multipart.serialization'
import { BucketS3Serialization } from '@//bucket/serializations/bucket.s3.serialization'
import { CompletedPart, UploadPartRequest } from '@aws-sdk/client-s3'

import { IBucketS3PutItemOptions } from './bucket.interface'

export interface IBucketS3Service {
  checkConnection(): Promise<Record<string, any>>

  listBucket(): Promise<string[]>

  listItemInBucket(prefix?: string): Promise<BucketS3Serialization[]>

  getItemInBucket(filename: string, path?: string): Promise<Record<string, any>>

  putItemInBucket(
    filename: string,
    content: string | Uint8Array | Buffer | Readable | ReadableStream | Blob,
    options?: IBucketS3PutItemOptions,
  ): Promise<BucketS3Serialization>

  deleteItemInBucket(filename: string): Promise<void>

  deleteItemsInBucket(filenames: string[]): Promise<void>

  deleteFolder(dir: string): Promise<void>

  createMultiPart(
    filename: string,
    options?: IBucketS3PutItemOptions,
  ): Promise<BucketS3MultipartSerialization>

  uploadPart(
    path: string,
    content: UploadPartRequest['Body'] | string | Uint8Array | Buffer,
    uploadId: string,
    partNumber: number,
  ): Promise<BucketS3MultipartPartsSerialization>

  completeMultipart(
    path: string,
    uploadId: string,
    parts: CompletedPart[],
  ): Promise<void>

  abortMultipart(path: string, uploadId: string): Promise<void>
}
